from sqlalchemy.orm import Session
from app.models.invoice import Invoice, invoice_products
from app.models.product import Product
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    invoices = db.query(Invoice).offset(skip).limit(limit).all()
    result = []
    for inv in invoices:
        result.append({
            "id": inv.id,
            "folio": inv.folio,
            "client_id": inv.client_id,
            "client_name": inv.client.name if inv.client else "",
            "total": inv.total,
            "date": inv.date,
            "status": inv.status,
        })
    return result

def create_invoice(db: Session, invoice: InvoiceCreate):
    db_invoice = Invoice(
        folio=invoice.folio,
        client_id=invoice.client_id,
        total=invoice.total,
        date=invoice.date,
        status=invoice.status,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    # Añadir productos y cantidades si tu modelo lo soporta
    for item in invoice.products:
        db.execute(
            invoice_products.insert().values(
                invoice_id=db_invoice.id,
                product_id=item.product_id,
                quantity=item.quantity
            )
        )
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def update_invoice(db: Session, invoice_id: int, invoice: InvoiceUpdate):
    db_invoice = get_invoice(db, invoice_id)
    if not db_invoice:
        return None
    if invoice.status is not None:
        db_invoice.status = invoice.status
    if invoice.total is not None:
        db_invoice.total = invoice.total
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_invoice(db: Session, invoice_id: int):
    db_invoice = get_invoice(db, invoice_id)
    if not db_invoice:
        return None
    db.delete(db_invoice)
    db.commit()
    return db_invoice