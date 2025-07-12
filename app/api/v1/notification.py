from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationOut
from app.crud import notification as crud
from app.db.session import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.post("/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def create_notification(notification_in: NotificationCreate, db: Session = Depends(get_db)):
    return crud.create_notification(db, notification_in)

@router.get("/", response_model=List[NotificationOut])
def read_notifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_notifications(db, skip=skip, limit=limit)

@router.get("/{notification_id}", response_model=NotificationOut)
def read_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = crud.get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.put("/{notification_id}", response_model=NotificationOut)
def update_notification(notification_id: int, notification_in: NotificationUpdate, db: Session = Depends(get_db)):
    notification = crud.update_notification(db, notification_id, notification_in)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.delete("/{notification_id}", response_model=NotificationOut)
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = crud.delete_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification