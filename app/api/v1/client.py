from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text
from app.schemas.client import Client, ClientCreate, ClientUpdate
from app.crud import client as crud_client
from app.db.session import get_db

router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

@router.get("/clientes")
def get_clientes(db: Session = Depends(get_db)):
    rows = db.execute(text("""
    SELECT
        c.id,
        c.name,
        c.email,
        c.phone,
        c.address,
        COALESCE(r.result::json->>'segmento_ml_nombre', 'Sin segmento') AS segmento_ml
    FROM clients c
    LEFT JOIN ml_results r
      ON r.entity_type = 'client'
     AND r.entity_id = c.id
     AND r.type = 'segmentacion_clientes'
    ORDER BY c.id
    """)).mappings().all()
    return [dict(r) for r in rows]

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

@router.get("/segmentos-ml-count")
def clientes_segmentos_ml_count(db: Session = Depends(get_db)):
    """
    Devuelve el conteo de clientes agrupado por segmento ML.
    Respuesta: [{"segmento_ml": "Premium", "cantidad": 8}, ...]
    """
    rows = db.execute("""
        SELECT
            COALESCE(r.result::json->>'segmento_ml_nombre', 'Sin segmento') as segmento_ml,
            COUNT(*) as cantidad
        FROM clients c
        LEFT JOIN ml_results r
          ON r.entity_type = 'client'
          AND r.entity_id = c.id
          AND r.type = 'segmentacion_clientes'
        GROUP BY segmento_ml
        ORDER BY cantidad DESC
    """).fetchall()
    return [
        {"segmento_ml": r["segmento_ml"], "cantidad": r["cantidad"]}
        for r in rows
    ]