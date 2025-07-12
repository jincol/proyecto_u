from fastapi import FastAPI
from app.api.v1 import client, product, invoice, user
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.models import Base

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Incluye routers
app.include_router(client.router)
app.include_router(product.router)
app.include_router(invoice.router)
app.include_router(user.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las fuentes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)