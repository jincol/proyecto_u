from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int = None
    client_id: int = None
    type: str
    message: str
    date: datetime
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: bool = None

class NotificationOut(NotificationBase):
    id: int

    class Config:
        orm_mode = True