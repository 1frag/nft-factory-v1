import json
from typing import Any, List

import requests
from fastapi import FastAPI, Body
from pydantic import BaseModel, BaseSettings
from fastapi.middleware.cors import CORSMiddleware

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Settings(BaseSettings):
    rpc_url: str


class Storage:
    _file_name = './state.json'

    def __init__(self):
        self.state = json.load(open(self._file_name))

    def get(self, key: str) -> Any:
        return self.state[key]

    def append(self, key: str, value: Any):
        self.state[key].append(value)
        return self

    def save_key_with(self, key, prettifier):
        self.state[key] = prettifier(self.state[key])
        json.dump(self.state, open(self._file_name, 'w'))
        return self


settings = Settings(_env_file='../../.env')
storage = Storage()
BLOCKCHAIN_NETWORK = 'goerli'
BLOCK_NUMBER_TO_TIMESTAMP_KEY = 'block_number_to_timestamp_' + BLOCKCHAIN_NETWORK


class Block(BaseModel):
    block_number: int
    timestamp: int
    clarified: bool = True


class BatchGetBlocksResponse(BaseModel):
    blocks: List[Block]


def rpc_command(method: str, params: Any):
    return {
        'method': method,
        'params': params,
        'id': 1,
        'jsonrpc': '2.0'
    }


def between(from_block: Block, block_number: int, to_block: Block) -> bool:
    if block_number < from_block.block_number:
        return False
    if block_number > to_block.block_number:
        return False
    return True


def approximate_block(from_block: Block, block_number: int, to_block: Block) -> Block:
    # b2-bi/b2-b1 = t2-ti/t2-t1;
    # ti = t2-(b2-bi/b2-b1)*t2-t1;
    timestamp = to_block.timestamp - int(
        (to_block.block_number - block_number)
        * (to_block.timestamp - from_block.timestamp)
        / (to_block.block_number - from_block.block_number)
    )
    return Block(
        block_number=block_number,
        timestamp=timestamp,
        clarified=block_number in [from_block.block_number, to_block.block_number],
    )


def state_prettifier(values):
    def filtered():
        seen = set()
        print(values)
        for value in values:
            if value['block_number'] in seen:
                continue
            seen.add(value['block_number'])
            yield value

    return sorted(filtered(), key=lambda v: v['block_number'])


@api.post("/", response_model=BatchGetBlocksResponse)
def batch_get(block_numbers: List[int] = Body(...)) -> BatchGetBlocksResponse:
    numbers = sorted(set(block_numbers))
    saved_blocks: List[Block] = sorted(
        [*map(lambda v: Block(**v), storage.get(BLOCK_NUMBER_TO_TIMESTAMP_KEY))],
        key=lambda b: b.block_number,
    )

    first_block_number = saved_blocks[0].block_number
    first_timestamp = saved_blocks[0].timestamp
    last_block_number = saved_blocks[-1].block_number
    last_timestamp = saved_blocks[-1].timestamp

    blocks = []
    current_block = 0

    for requested_number in numbers:
        if requested_number <= first_block_number:
            blocks.append(Block(
                block_number=requested_number,
                timestamp=first_timestamp,
                clarified=requested_number == first_block_number
            ))
        elif requested_number >= last_block_number:
            blocks.append(Block(
                block_number=requested_number,
                timestamp=last_timestamp,
                clarified=requested_number == last_block_number
            ))
        else:
            while True:
                params = [saved_blocks[current_block], requested_number, saved_blocks[current_block + 1]]
                if between(*params):
                    blocks.append(approximate_block(*params))
                    break
                else:
                    current_block += 1
    return BatchGetBlocksResponse(blocks=blocks)


@api.put("/{block_number}", response_model=Block)
def clarify(block_number: int):
    timestamp = int(requests.post(
        settings.rpc_url,
        json=rpc_command('eth_getBlockByNumber', [hex(block_number), False])
    ).json()['result']['timestamp'], 16)

    block = Block(block_number=block_number, timestamp=timestamp, clarified=True)
    storage.append(
        BLOCK_NUMBER_TO_TIMESTAMP_KEY,
        block.dict(exclude={'clarified'})
    ).save_key_with(BLOCK_NUMBER_TO_TIMESTAMP_KEY, state_prettifier)
    return block
