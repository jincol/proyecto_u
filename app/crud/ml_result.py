from sqlalchemy.orm import Session
from app.models.ml_result import MLResult
from app.schemas.ml_result import MLResultCreate

def create_ml_result(db: Session, ml_in: MLResultCreate):
    ml_result = MLResult(**ml_in.dict())
    db.add(ml_result)
    db.commit()
    db.refresh(ml_result)
    return ml_result

def get_ml_result(db: Session, ml_id: int):
    return db.query(MLResult).filter(MLResult.id == ml_id).first()

def get_ml_results(db: Session, skip=0, limit=100):
    return db.query(MLResult).offset(skip).limit(limit).all()

def delete_ml_result(db: Session, ml_id: int):
    ml_result = get_ml_result(db, ml_id)
    if not ml_result:
        return None
    db.delete(ml_result)
    db.commit()
    return ml_result