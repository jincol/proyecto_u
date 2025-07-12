from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    # stock = Column(Integer, default=0)
    invoices = relationship("Invoice", secondary="invoice_products", back_populates="products")
    inventories = relationship("Inventory", back_populates="product")