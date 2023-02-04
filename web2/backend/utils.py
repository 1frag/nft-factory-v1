from typing import Any

from models import Block


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
