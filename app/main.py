from fastapi import FastAPI
from app.api.v1 import (
    client, 
    product, 
    invoice, 
    user,
    recurrence,
    payment,
    notification,
    client_segment,
    product_category,
    ml_result,
    inventory
)
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # Puerto de tu frontend
    "http://localhost:3000",  # Otro ejemplo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client.router)
app.include_router(product.router)
app.include_router(invoice.router)
app.include_router(user.router)
app.include_router(recurrence.router)
app.include_router(payment.router)
app.include_router(notification.router)
app.include_router(client_segment.router)
app.include_router(product_category.router)
app.include_router(ml_result.router)
app.include_router(inventory.router) 

