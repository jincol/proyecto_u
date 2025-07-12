from sqlalchemy.orm import Session
from app.models.invoice import Invoice, invoice_product
from app.models.client import Client
from app.models.product import Product
from app.schemas.invoice import InvoiceCreate

def create_invoice(db: Session, invoice_in: InvoiceCreate):
    # Buscar el cliente
    client = db.query(Client).filter(Client.id == invoice_in.client_id).first()
    if not client:
        raise ValueError("Cliente no encontrado")
    
    # Buscar los productos
    products = db.query(Product).filter(Product.id.in_(invoice_in.product_ids)).all()
    if len(products) != len(invoice_in.product_ids):
        raise ValueError("Uno o más productos no existen")
    
    # Crear la factura y asociarla
    invoice = Invoice(
        client_id=invoice_in.client_id,
        date=invoice_in.date,
        total=invoice_in.total
    )
    invoice.products = products

    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def list_invoices(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Invoice).offset(skip).limit(limit).all()