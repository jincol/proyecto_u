from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class ClientSegment(Base):
    __tablename__ = "client_segments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

class ClientSegmentRelation(Base):
    __tablename__ = "client_segment_relations"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    segment_id = Column(Integer, ForeignKey("client_segments.id"), nullable=False)