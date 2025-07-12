from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, index=True)
    address = Column(String)
    invoices = relationship("Invoice", back_populates="client")
    recurrences = relationship("Recurrence", back_populates="client")  # <-- AGREGA ESTA LÍNEA