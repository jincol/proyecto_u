from sqlalchemy.orm import Session
from app.models.recurrence import Recurrence
from app.schemas.recurrence import RecurrenceCreate, RecurrenceUpdate

def create_recurrence(db: Session, recurrence_in: RecurrenceCreate):
    recurrence = Recurrence(**recurrence_in.dict())
    db.add(recurrence)
    db.commit()
    db.refresh(recurrence)
    return recurrence

def get_recurrence(db: Session, recurrence_id: int):
    return db.query(Recurrence).filter(Recurrence.id == recurrence_id).first()

def get_recurrences(db: Session, skip=0, limit=100):
    return db.query(Recurrence).offset(skip).limit(limit).all()

def update_recurrence(db: Session, recurrence_id: int, recurrence_in: RecurrenceUpdate):
    recurrence = get_recurrence(db, recurrence_id)
    if not recurrence:
        return None
    for key, value in recurrence_in.dict(exclude_unset=True).items():
        setattr(recurrence, key, value)
    db.commit()
    db.refresh(recurrence)
    return recurrence

def delete_recurrence(db: Session, recurrence_id: int):
    recurrence = get_recurrence(db, recurrence_id)
    if not recurrence:
        return None
    db.delete(recurrence)
    db.commit()
    return recurrence