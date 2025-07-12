from ..db.base import Base
from .client import Client
from .product import Product
from .invoice import Invoice
from .user import User
from .recurrence import Recurrence
from .payment import Payment
from .notification import Notification
from .client_segment import ClientSegment, ClientSegmentRelation
from .product_category import ProductCategory, ProductCategoryRelation
from .ml_result import MLResult
from .inventory import Inventory

# Exporta todos los modelos para que Base los reconozca
__all__ = [
    "Base",
    "Client",
    "Product",
    "Invoice",
    "User",
    "Recurrence",
    "Payment",
    "Notification",
    "ClientSegment",
    "ClientSegmentRelation",
    "ProductCategory",
    "ProductCategoryRelation",
    "MLResult",
    "Inventory"
]