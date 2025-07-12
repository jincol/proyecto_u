from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InvoiceProduct(BaseModel):
    product_id: int
    quantity: int

class InvoiceBase(BaseModel):
    client_id: int
    products: List[InvoiceProduct]
    total: float
    status: Optional[str] = "pending"

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    status: Optional[str] = None

class InvoiceOut(BaseModel):
    id: int
    client_id: int
    total: float
    date: datetime
    status: str
    products: List[InvoiceProduct]

    class Config:
        orm_mode = True