from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InvoiceProduct(BaseModel):
    product_id: int
    quantity: int

class InvoiceBase(BaseModel):
    folio: str
    client_id: int
    products: List[InvoiceProduct]
    total: float
    date: datetime
    status: Optional[str] = "pending"
    notes: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    total: Optional[float] = None
    notes: Optional[str] = None

class InvoiceOut(BaseModel):
    id: int
    folio: str
    client_id: int
    client_name: Optional[str]
    total: float
    date: datetime
    status: str
    notes: Optional[str] = None  # <-- ESTA LÍNEA ES LA SOLUCIÓN

    class Config:
        from_attributes = True