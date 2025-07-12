from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class MLResult(Base):
    __tablename__ = "ml_results"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # prediccion_venta, recomendacion, anomaly, churn, ocr
    entity_id = Column(Integer, nullable=False)  # puede ser client_id, invoice_id, product_id, etc.
    entity_type = Column(String, nullable=False) # client, invoice, product
    result = Column(JSON, nullable=False)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, nullable=False)