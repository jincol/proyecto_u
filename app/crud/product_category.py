from sqlalchemy.orm import Session
from app.models.product_category import ProductCategory, ProductCategoryRelation
from app.schemas.product_category import ProductCategoryCreate, ProductCategoryRelationCreate

def create_category(db: Session, category_in: ProductCategoryCreate):
    category = ProductCategory(**category_in.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def get_category(db: Session, category_id: int):
    return db.query(ProductCategory).filter(ProductCategory.id == category_id).first()

def get_categories(db: Session, skip=0, limit=100):
    return db.query(ProductCategory).offset(skip).limit(limit).all()

def delete_category(db: Session, category_id: int):
    category = get_category(db, category_id)
    if not category:
        return None
    db.delete(category)
    db.commit()
    return category

def assign_product_to_category(db: Session, relation_in: ProductCategoryRelationCreate):
    relation = ProductCategoryRelation(**relation_in.dict())
    db.add(relation)
    db.commit()
    db.refresh(relation)
    return relation

def get_product_categories(db: Session, product_id: int):
    return db.query(ProductCategoryRelation).filter(ProductCategoryRelation.product_id == product_id).all()