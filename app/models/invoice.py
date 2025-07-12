from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

invoice_products = Table(
    "invoice_products",
    Base.metadata,
    Column("invoice_id", ForeignKey("invoices.id"), primary_key=True),
    Column("product_id", ForeignKey("products.id"), primary_key=True),
    Column("quantity", Integer, nullable=False, default=1),
    Column("unit_price", Float, nullable=False, default=0.0),  # Agregado para precio unitario
)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    folio = Column(String, nullable=False, unique=True)  # Nuevo campo
    client_id = Column(Integer, ForeignKey("clients.id"))
    subtotal = Column(Float, nullable=False, default=0.0)
    taxes = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)
    payment_method = Column(String, nullable=True)
    accounts_receivable = Column(Float, nullable=True, default=0.0)
    status = Column(String, default="pending")
    client = relationship("Client", back_populates="invoices")
    products = relationship("Product", secondary=invoice_products, back_populates="invoices")