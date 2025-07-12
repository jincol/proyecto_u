from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.client import Client, ClientCreate, ClientUpdate
from app.crud import client as crud_client
from app.db.session import get_db

router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
def create_client(client_in: ClientCreate, db: Session = Depends(get_db)):
    db_client = crud_client.create_client(db, client_in)
    return db_client

@router.get("/", response_model=List[Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud_client.get_clients(db, skip=skip, limit=limit)
    return clients

@router.get("/{client_id}", response_model=Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud_client.get_client(db, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.put("/{client_id}", response_model=Client)
def update_client(client_id: int, client_in: ClientUpdate, db: Session = Depends(get_db)):
    db_client = crud_client.update_client(db, client_id, client_in)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.delete("/{client_id}", response_model=Client)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud_client.delete_client(db, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client