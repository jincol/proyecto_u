from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.ml_result import MLResultCreate, MLResultOut
from app.crud import ml_result as crud
from app.db.session import get_db
from fastapi import Query
from typing import Optional

router = APIRouter(prefix="/ml-results", tags=["ml-results"])

@router.get("/prediccion-ventas", response_model=MLResultOut)
def get_last_prediccion_ventas(
    db: Session = Depends(get_db),
    entity_id: Optional[int] = Query(default=None, description="Opcional: id de cliente/entidad")
):
    print(">>> entity_id recibido:", entity_id)
    ml_result = crud.get_last_ml_result_by_type(
        db, 
        result_type="prediccion_ventas", 
        entity_id=entity_id
    )
    print(">>> ml_result encontrado:", ml_result)
    if not ml_result:
        raise HTTPException(status_code=404, detail="Predicción ML no encontrada")
    return ml_result

@router.post("/", response_model=MLResultOut, status_code=status.HTTP_201_CREATED)
def create_ml_result(ml_in: MLResultCreate, db: Session = Depends(get_db)):
    return crud.create_ml_result(db, ml_in)

@router.get("/", response_model=List[MLResultOut])
def read_ml_results(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ml_results(db, skip=skip, limit=limit)

@router.get("/{ml_id}", response_model=MLResultOut)
def read_ml_result(ml_id: int, db: Session = Depends(get_db)):
    ml_result = crud.get_ml_result(db, ml_id)
    if not ml_result:
        raise HTTPException(status_code=404, detail="MLResult not found")
    return ml_result

@router.delete("/{ml_id}", response_model=MLResultOut)
def delete_ml_result(ml_id: int, db: Session = Depends(get_db)):
    ml_result = crud.delete_ml_result(db, ml_id)
    if not ml_result:
        raise HTTPException(status_code=404, detail="MLResult not found")
    return ml_result

