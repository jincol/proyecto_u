from pydantic import BaseModel
from datetime import datetime
from typing import Any

class MLResultBase(BaseModel):
    type: str
    entity_id: int
    entity_type: str
    result: Any
    score: float = None
    created_at: datetime

class MLResultCreate(MLResultBase):
    pass

class MLResultOut(MLResultBase):
    id: int

    class Config:
        orm_mode = True