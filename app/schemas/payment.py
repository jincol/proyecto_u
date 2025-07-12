from pydantic import BaseModel
from datetime import date

class PaymentBase(BaseModel):
    client_id: int
    invoice_id: int = None
    amount: float
    due_date: date
    status: str = "pendiente"
    method: str = None
    paid_date: date = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: str = None
    method: str = None
    paid_date: date = None

class PaymentOut(PaymentBase):
    id: int

    class Config:
        orm_mode = True