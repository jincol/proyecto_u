from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Recurrence(Base):
    __tablename__ = "recurrences"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    type = Column(String, nullable=False)  # mensual, semanal, anual
    next_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)

    client = relationship("Client", back_populates="recurrences")