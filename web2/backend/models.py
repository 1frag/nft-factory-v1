from typing import List

from pydantic import BaseModel


class Block(BaseModel):
    block_number: int
    timestamp: int
    clarified: bool = True


class BatchGetBlocksResponse(BaseModel):
    blocks: List[Block]
