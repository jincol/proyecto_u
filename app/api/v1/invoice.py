from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.invoice import InvoiceOut, InvoiceCreate, InvoiceUpdate
from app.crud import invoice as crud_invoice
from app.db.session import get_db
from app.models.invoice import invoice_products

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
def cancel_invoice(invoice_id: int, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.cancel_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    # Aquí arma la respuesta igual que en GET, incluyendo el nuevo status
    client_name = db_invoice.client.name if db_invoice.client else ""
    products = []
    prod_rows = db.execute(
        invoice_products.select().where(invoice_products.c.invoice_id == db_invoice.id)
    ).fetchall()
    for row in prod_rows:
        products.append({"product_id": row.product_id, "quantity": row.quantity})
    return {
        "id": db_invoice.id,
        "folio": db_invoice.folio,
        "client_id": db_invoice.client_id,
        "client_name": client_name,
        "subtotal": getattr(db_invoice, "subtotal", 0),
        "taxes": getattr(db_invoice, "taxes", 0),
        "total": db_invoice.total,
        "date": db_invoice.date.strftime("%Y-%m-%d") if db_invoice.date else "",
        "due_date": db_invoice.due_date.strftime("%Y-%m-%d") if db_invoice.due_date else "",
        "notes": db_invoice.notes or "",
        "status": db_invoice.status,
        "products": products,
    }

@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(invoice_id: int, invoice_update: InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = crud_invoice.get_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    if db_invoice.status == "Cancelada":
        raise HTTPException(
            status_code=409,
            detail="No se puede editar una factura anulada. Si necesita realizar cambios, contacto al ADMINISTRADOR"
        )