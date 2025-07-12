from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate

def create_notification(db: Session, notification_in: NotificationCreate):
    notification = Notification(**notification_in.dict())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_notification(db: Session, notification_id: int):
    return db.query(Notification).filter(Notification.id == notification_id).first()

def get_notifications(db: Session, skip=0, limit=100):
    return db.query(Notification).offset(skip).limit(limit).all()

def update_notification(db: Session, notification_id: int, notification_in: NotificationUpdate):
    notification = get_notification(db, notification_id)
    if not notification:
        return None
    for key, value in notification_in.dict(exclude_unset=True).items():
        setattr(notification, key, value)
    db.commit()
    db.refresh(notification)
    return notification

def delete_notification(db: Session, notification_id: int):
    notification = get_notification(db, notification_id)
    if not notification:
        return None
    db.delete(notification)
    db.commit()
    return notification