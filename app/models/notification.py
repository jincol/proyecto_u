from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    type = Column(String, nullable=False)     # email, whatsapp, push, alerta
    message = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    is_read = Column(Boolean, default=False)

    user = relationship("User")
    client = relationship("Client")