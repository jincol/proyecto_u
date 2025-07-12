from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductItem(BaseModel):
    product_id: int
    name: Optional[str]
    quantity: int
    unit_price: float

class InvoiceSchema(BaseModel):
    id: Optional[int]
    folio: Optional[str]
    client_id: int
    client_name: Optional[str]
    date: Optional[datetime]
    due_date: Optional[datetime]
    subtotal: float
    taxes: float
    total: float
    notes: Optional[str]
    payment_method: Optional[ str]
    accounts_receivable: Optional[float]
    status: Optional[str]
    products: Optional[List[ProductItem]]

    class Config:
        from_attributes = True