from pydantic import BaseModel

class ProductCategoryBase(BaseModel):
    name: str
    description: str = None
    parent_id: int = None

class ProductCategoryCreate(ProductCategoryBase):
    pass

class ProductCategoryOut(ProductCategoryBase):
    id: int

    class Config:
        orm_mode = True

class ProductCategoryRelationBase(BaseModel):
    product_id: int
    category_id: int

class ProductCategoryRelationCreate(ProductCategoryRelationBase):
    pass

class ProductCategoryRelationOut(ProductCategoryRelationBase):
    id: int

    class Config:
        orm_mode = True