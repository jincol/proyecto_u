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
        # Obtener productos y cantidades de la tabla pivote
        prod_rows = db.execute(
            invoice_products.select().where(invoice_products.c.invoice_id == inv.id)
        ).fetchall()
        products = []
        for row in prod_rows:
            # Puedes obtener nombre y precio si lo necesitas (no obligatorio para InvoiceOut)
            products.append({
                "product_id": row.product_id,
                "quantity": row.quantity
            })
        result.append({
            "id": inv.id,
            "folio": inv.folio,
            "client_id": inv.client_id,
            "client_name": inv.client.name if inv.client else "",
            "subtotal": getattr(inv, "subtotal", 0),
            "taxes": getattr(inv, "taxes", 0),
            "total": inv.total,
            "date": inv.date.strftime("%Y-%m-%d") if inv.date else "",
            "due_date": inv.due_date.strftime("%Y-%m-%d") if inv.due_date else "",
            "notes": inv.notes or "",
            "status": inv.status,
            "products": products,
        })
    return result

def create_invoice(db: Session, invoice: InvoiceCreate):
    db_invoice = Invoice(
        folio=invoice.folio,
        client_id=invoice.client_id,
        subtotal=invoice.subtotal,   
        taxes=invoice.taxes,         
        total=invoice.total,
        date=invoice.date,
        status=invoice.status,
        notes=invoice.notes,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    print("Factura guardada con ID:", db_invoice.id)
    # Guardar productos
    for item in invoice.products:
        print("Guardando producto en pivote:", item)
        db.execute(
            invoice_products.insert().values(
                invoice_id=db_invoice.id,
                product_id=item.product_id,
                quantity=item.quantity
            )
        )
    db.commit()
    print("Productos guardados correctamente.")
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

def cancel_invoice(db: Session, invoice_id: int):
    db_invoice = get_invoice(db, invoice_id)
    if not db_invoice:
        return None
    db_invoice.status = "cancelled"
    db.commit()
    db.refresh(db_invoice)
    return db_invoice