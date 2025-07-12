from sqlalchemy.orm import Session
from app.models.client_segment import ClientSegment, ClientSegmentRelation
from app.schemas.client_segment import ClientSegmentCreate, ClientSegmentRelationCreate

def create_segment(db: Session, segment_in: ClientSegmentCreate):
    segment = ClientSegment(**segment_in.dict())
    db.add(segment)
    db.commit()
    db.refresh(segment)
    return segment

def get_segment(db: Session, segment_id: int):
    return db.query(ClientSegment).filter(ClientSegment.id == segment_id).first()

def get_segments(db: Session, skip=0, limit=100):
    return db.query(ClientSegment).offset(skip).limit(limit).all()

def delete_segment(db: Session, segment_id: int):
    segment = get_segment(db, segment_id)
    if not segment:
        return None
    db.delete(segment)
    db.commit()
    return segment

def assign_client_to_segment(db: Session, relation_in: ClientSegmentRelationCreate):
    relation = ClientSegmentRelation(**relation_in.dict())
    db.add(relation)
    db.commit()
    db.refresh(relation)
    return relation

def get_client_segments(db: Session, client_id: int):
    return db.query(ClientSegmentRelation).filter(ClientSegmentRelation.client_id == client_id).all()