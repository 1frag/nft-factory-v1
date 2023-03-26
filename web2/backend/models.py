from typing import List, Optional

from pydantic import BaseModel


class Block(BaseModel):
    block_number: int
    timestamp: int
    clarified: bool = True


class BatchGetBlocksResponse(BaseModel):
    blocks: List[Block]


class ResolveAddressResponse(BaseModel):
    contractAddress: str


class GetTokenURIResponse(BaseModel):
    data: Optional[str]


class HiddenItem(BaseModel):
    contract_address: str
    owner: str


class HiddenItemsResponse(BaseModel):
    items: List[HiddenItem]
