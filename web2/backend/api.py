from typing import List

import requests
from fastapi import Body, APIRouter

from storage import storage
from constants import BLOCK_NUMBER_TO_TIMESTAMP_KEY
from models import BatchGetBlocksResponse, Block, ResolveAddressResponse, GetTokenURIResponse
from settings import settings
from utils import approximate_block, between, rpc_command, state_prettifier, hex_concat, encode_uint, decode_string

router = APIRouter()


@router.post("/BlockByNumber", response_model=BatchGetBlocksResponse)
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


@router.put("/BlockByNumber/{block_number}", response_model=Block)
def clarify(block_number: int):
    timestamp = int(requests.post(
        settings.goerli_rpc_url,
        json=rpc_command('eth_getBlockByNumber', [hex(block_number), False])
    ).json()['result']['timestamp'], 16)

    block = Block(block_number=block_number, timestamp=timestamp, clarified=True)
    storage.append(
        BLOCK_NUMBER_TO_TIMESTAMP_KEY,
        block.dict(exclude={'clarified'})
    ).save_key_with(BLOCK_NUMBER_TO_TIMESTAMP_KEY, state_prettifier)
    return block


@router.get('/ResolveAddress/{identifier}', response_model=ResolveAddressResponse)
def resolve_address(identifier: str):
    return ResolveAddressResponse(
        contractAddress=requests.get(f'{settings.resolver_url}/{identifier}').json()['contractAddress']
    )


@router.get('/GetTokenURI/{address}/{token_id}', response_model=GetTokenURIResponse)
def get_token_uri(address: str, token_id: str):
    for method_id in ('0xc87b56dd', '0x0e89341c'):
        response = requests.post(
            settings.mainnet_rpc_url,
            json=rpc_command(
                'eth_call',
                [
                    {
                        "to": address,
                        "data": hex_concat(method_id, encode_uint(token_id)),
                    },
                    "latest"
                ],
            )
        ).json()
        if (result := response.get('result', '0x')) != '0x':
            token_uri = decode_string(result)
            token_uri = token_uri.replace('{id}', hex(int(token_id))[2:].rjust(64, '0'))
            return GetTokenURIResponse(data=token_uri)

    return GetTokenURIResponse(data=None)
