from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory
from app.models.product import Product

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/")
def list_inventory(db: Session = Depends(get_db)):
    # Consulta que une inventario y producto
    inventory_items = (
        db.query(Inventory, Product)
        .join(Product, Inventory.product_id == Product.id)
        .all()
    )
    # Retorna los datos combinados
    return [{
        "id": inv.id,
        "product_id": prod.id,
        "name": prod.name,
        "description": prod.description,
        "price": prod.price,
        "quantity": inv.quantity,
        "last_update": inv.last_update
    } for inv, prod in inventory_items]