from pydantic import BaseModel

class ClientSegmentBase(BaseModel):
    name: str
    description: str = None

class ClientSegmentCreate(ClientSegmentBase):
    pass

class ClientSegmentOut(ClientSegmentBase):
    id: int

    class Config:
        orm_mode = True

class ClientSegmentRelationBase(BaseModel):
    client_id: int
    segment_id: int

class ClientSegmentRelationCreate(ClientSegmentRelationBase):
    pass

class ClientSegmentRelationOut(ClientSegmentRelationBase):
    id: int

    class Config:
        orm_mode = True