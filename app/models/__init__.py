from ..db.base import Base  # Cambiar esta línea
from .client import Client
from .product import Product
from .invoice import Invoice
from .user import User

# Exporta todos los modelos para que Base los reconozca
__all__ = ["Base", "Client", "Product", "Invoice", "User"]