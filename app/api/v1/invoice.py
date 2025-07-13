from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.invoice import InvoiceOut, InvoiceCreate, InvoiceUpdate
from app.crud import invoice as crud_invoice
from app.db.session import get_db

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"]
)

@router.post("/", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice_in: InvoiceCreate, db: Session = Depends(get_db)):
    print("---- INICIO CREACIÓN FACTURA ----")
    print("Datos recibidos:", invoice_in.dict())
    try:
        db_invoice = crud_invoice.create_invoice(db, invoice_in)
        # Extrae el nombre del cliente usando la relación
        client_name = db_invoice.client.name if db_invoice.client else None
        response_data = {
            "id": db_invoice.id,
            "folio": db_invoice.folio,
            "client_id": db_invoice.client_id,
            "client_name": client_name,
            "subtotal": getattr(db_invoice, "subtotal", 0),
            "taxes": getattr(db_invoice, "taxes", 0),
            "total": db_invoice.total,
            "date": db_invoice.date,
            "status": db_invoice.status,
            "notes": db_invoice.notes,
        }
        print("Factura creada correctamente:", response_data)
        return response_data
    except Exception as e:
        print("ERROR al crear factura:", str(e))
        raise HTTPException(status_code=500, detail=f"Error interno al crear factura: {str(e)}")
    


@router.get("/", response_model=List[InvoiceOut])
def read_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_invoice.get_invoices(db, skip=skip, limit=limit)

@router.delete("/{invoice_id}", response_model=InvoiceOut)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.delete_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice