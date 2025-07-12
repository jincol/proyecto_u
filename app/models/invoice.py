from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

# Tabla intermedia para productos en facturas (muchos a muchos)
invoice_products = Table(
    "invoice_products",
    Base.metadata,
    Column("invoice_id", ForeignKey("invoices.id"), primary_key=True),
    Column("product_id", ForeignKey("products.id"), primary_key=True),
    Column("quantity", Integer, nullable=False, default=1),
)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    total = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")
    client = relationship("Client", back_populates="invoices")
    products = relationship("Product", secondary=invoice_products, back_populates="invoices")