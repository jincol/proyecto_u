from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory
from app.models.product import Product
from datetime import datetime

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


@router.post("/")
def create_inventory(data: dict, db: Session = Depends(get_db)):
    # Espera {"product_id": ..., "quantity": ...}
    inventory = Inventory(
        product_id=data["product_id"],
        quantity=data["quantity"],
        last_update=datetime.utcnow()
    )
    db.add(inventory)
    db.commit()
    db.refresh(inventory)
    return {"id": inventory.id, "product_id": inventory.product_id, "quantity": inventory.quantity}

@router.put("/{inventory_id}")
def update_inventory(inventory_id: int, data: dict, db: Session = Depends(get_db)):
    inventory = db.query(Inventory).get(inventory_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="No existe inventario")
    inventory.quantity = data["quantity"]
    inventory.last_update = datetime.utcnow()
    db.commit()
    return {"id": inventory.id, "product_id": inventory.product_id, "quantity": inventory.quantity}

@router.delete("/{inventory_id}")
def delete_inventory(inventory_id: int, db: Session = Depends(get_db)):
    inventory = db.query(Inventory).get(inventory_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="No existe inventario")
    db.delete(inventory)
    db.commit()
    return {"ok": True}