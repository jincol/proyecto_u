from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.inventory import Inventory

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/")
def list_inventory(db: Session = Depends(get_db)):
    return db.query(Inventory).all()