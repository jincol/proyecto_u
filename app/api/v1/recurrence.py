from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.recurrence import RecurrenceCreate, RecurrenceUpdate, RecurrenceOut
from app.crud import recurrence as crud
from app.db.session import get_db

router = APIRouter(prefix="/recurrences", tags=["recurrences"])

@router.post("/", response_model=RecurrenceOut, status_code=status.HTTP_201_CREATED)
def create_recurrence(recurrence_in: RecurrenceCreate, db: Session = Depends(get_db)):
    return crud.create_recurrence(db, recurrence_in)

@router.get("/", response_model=List[RecurrenceOut])
def read_recurrences(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_recurrences(db, skip=skip, limit=limit)

@router.get("/{recurrence_id}", response_model=RecurrenceOut)
def read_recurrence(recurrence_id: int, db: Session = Depends(get_db)):
    recurrence = crud.get_recurrence(db, recurrence_id)
    if not recurrence:
        raise HTTPException(status_code=404, detail="Recurrence not found")
    return recurrence

@router.put("/{recurrence_id}", response_model=RecurrenceOut)
def update_recurrence(recurrence_id: int, recurrence_in: RecurrenceUpdate, db: Session = Depends(get_db)):
    recurrence = crud.update_recurrence(db, recurrence_id, recurrence_in)
    if not recurrence:
        raise HTTPException(status_code=404, detail="Recurrence not found")
    return recurrence

@router.delete("/{recurrence_id}", response_model=RecurrenceOut)
def delete_recurrence(recurrence_id: int, db: Session = Depends(get_db)):
    recurrence = crud.delete_recurrence(db, recurrence_id)
    if not recurrence:
        raise HTTPException(status_code=404, detail="Recurrence not found")
    return recurrence