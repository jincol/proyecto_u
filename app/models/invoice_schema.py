from pydantic import BaseModel
from typing import List, Optional

class InvoiceSchema(BaseModel):
    id: Optional[int]
    client_id: int
    date: str
    total: float
    product_ids: Optional[List[int]]

    class Config:
        from_attributes = True