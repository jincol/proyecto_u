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
    db_invoice = crud_invoice.create_invoice(db, invoice_in)
    return db_invoice

@router.get("/", response_model=List[InvoiceOut])
def read_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    invoices = crud_invoice.get_invoices(db, skip=skip, limit=limit)
    return invoices

@router.get("/{invoice_id}", response_model=InvoiceOut)
def read_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.get_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(invoice_id: int, invoice_in: InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.update_invoice(db, invoice_id, invoice_in)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.delete("/{invoice_id}", response_model=InvoiceOut)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.delete_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice