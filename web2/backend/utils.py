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
        for value in values:
            if value['block_number'] in seen:
                continue
            seen.add(value['block_number'])
            yield value

    return sorted(filtered(), key=lambda v: v['block_number'])


def hex_concat(*values):
    return '0x' + ''.join([*map(lambda v: v.replace('0x', ''), values)])


def encode_uint(value):
    return '0x' + hex(int(value)).replace('0x', '').rjust(64, '0')


def decode_string(value):
    length = int(value[2 + 64:2 + 64 + 64], 16)
    data = bytes.fromhex(value[2 + 64 + 64:2 + 64 + 64 + length * 2])
    return data.decode('utf-8')


def log_is_deployed(address: str):
    def check(log) -> bool:
        if log['topics'] != ['0xf40fcec21964ffb566044d083b4073f29f7f7929110ea19e1b3ebe375d89055e']:
            return False

        return int(log['data'], 16) == int(address, 16)

    return check
