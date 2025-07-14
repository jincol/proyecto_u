from fastapi import APIRouter, Depends, HTTPException, status,Query
from sqlalchemy.orm import Session
from typing import List
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate
from app.crud import product as crud_product
from app.db.session import get_db
from app.models.inventory import Inventory
from app.models.product import Product

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    db_product = crud_product.create_product(db, product_in)
    return db_product

@router.get("/low-stock", response_model=List[ProductOut])
def get_low_stock_products(
    db: Session = Depends(get_db),
    threshold: int = Query(5, description="Umbral para considerar stock bajo")
):
    productos = (
        db.query(Product, Inventory.quantity)
        .join(Inventory, Product.id == Inventory.product_id)
        .filter(Inventory.quantity <= threshold)
        .all()
    )
    resultado = []
    for producto, cantidad in productos:
        resultado.append(ProductOut(
            id=producto.id,
            name=producto.name,
            description=producto.description,
            price=producto.price,
            quantity=cantidad
        ))
    return resultado

@router.get("/", response_model=List[ProductOut])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud_product.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=ProductOut)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud_product.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    db_product = crud_product.update_product(db, product_id, product_in)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", response_model=ProductOut)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud_product.delete_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


