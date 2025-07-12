from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.product_category import (
    ProductCategoryCreate,
    ProductCategoryOut,
    ProductCategoryRelationCreate,
    ProductCategoryRelationOut,
)
from app.crud import product_category as crud
from app.db.session import get_db

router = APIRouter(prefix="/categories", tags=["categories"])  # CAMBIA AQUÍ

@router.post("/", response_model=ProductCategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(category_in: ProductCategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, category_in)

@router.get("/", response_model=List[ProductCategoryOut])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)

@router.delete("/{category_id}", response_model=ProductCategoryOut)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = crud.delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/assign", response_model=ProductCategoryRelationOut)
def assign_product_to_category(relation_in: ProductCategoryRelationCreate, db: Session = Depends(get_db)):
    return crud.assign_product_to_category(db, relation_in)

@router.get("/product/{product_id}", response_model=List[ProductCategoryRelationOut])
def get_product_categories(product_id: int, db: Session = Depends(get_db)):
    return crud.get_product_categories(db, product_id)