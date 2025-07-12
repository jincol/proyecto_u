from pydantic import BaseModel
from datetime import date

class RecurrenceBase(BaseModel):
    client_id: int
    type: str
    next_date: date
    is_active: bool = True

class RecurrenceCreate(RecurrenceBase):
    pass

class RecurrenceUpdate(BaseModel):
    type: str = None
    next_date: date = None
    is_active: bool = None

class RecurrenceOut(RecurrenceBase):
    id: int

    class Config:
        orm_mode = True