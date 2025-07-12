from fastapi import FastAPI
from app.api.v1 import client, product, invoice, user
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.models import Base  # Esto importa todos los modelos

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Sistema completo de gestión de facturas para empresas",
    debug=settings.DEBUG
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(client.router, prefix="/api/v1", tags=["clients"])
app.include_router(product.router, prefix="/api/v1", tags=["products"])
app.include_router(invoice.router, prefix="/api/v1", tags=["invoices"])
app.include_router(user.router, prefix="/api/v1", tags=["users"])

# Endpoint de salud
@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}

# Crear tablas (solo si la base de datos está disponible)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database connection failed: {e}")
    print("The app will start but database operations will fail until DB is available")