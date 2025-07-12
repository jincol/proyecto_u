from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.client_segment import (
    ClientSegmentCreate,
    ClientSegmentOut,
    ClientSegmentRelationCreate,
    ClientSegmentRelationOut,
)
from app.crud import client_segment as crud
from app.db.session import get_db

router = APIRouter(prefix="/segments", tags=["segments"])  # CAMBIA AQUÍ

@router.post("/", response_model=ClientSegmentOut, status_code=status.HTTP_201_CREATED)
def create_segment(segment_in: ClientSegmentCreate, db: Session = Depends(get_db)):
    return crud.create_segment(db, segment_in)

@router.get("/", response_model=List[ClientSegmentOut])
def read_segments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_segments(db, skip=skip, limit=limit)

@router.delete("/{segment_id}", response_model=ClientSegmentOut)
def delete_segment(segment_id: int, db: Session = Depends(get_db)):
    segment = crud.delete_segment(db, segment_id)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return segment

@router.post("/assign", response_model=ClientSegmentRelationOut)
def assign_client_to_segment(relation_in: ClientSegmentRelationCreate, db: Session = Depends(get_db)):
    return crud.assign_client_to_segment(db, relation_in)

@router.get("/client/{client_id}", response_model=List[ClientSegmentRelationOut])
def get_client_segments(client_id: int, db: Session = Depends(get_db)):
    return crud.get_client_segments(db, client_id)