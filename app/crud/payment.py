from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentUpdate

def create_payment(db: Session, payment_in: PaymentCreate):
    payment = Payment(**payment_in.dict())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

def get_payment(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()

def get_payments(db: Session, skip=0, limit=100):
    return db.query(Payment).offset(skip).limit(limit).all()

def update_payment(db: Session, payment_id: int, payment_in: PaymentUpdate):
    payment = get_payment(db, payment_id)
    if not payment:
        return None
    for key, value in payment_in.dict(exclude_unset=True).items():
        setattr(payment, key, value)
    db.commit()
    db.refresh(payment)
    return payment

def delete_payment(db: Session, payment_id: int):
    payment = get_payment(db, payment_id)
    if not payment:
        return None
    db.delete(payment)
    db.commit()
    return payment