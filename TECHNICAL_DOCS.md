# Documentación Técnica - Sistema de Gestión de Facturas

## 🔧 Arquitectura Técnica

### Patrón de Arquitectura: MVC + Clean Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Components    │    │ • API Routes    │    │ • Tables        │
│ • Pages         │    │ • Models        │    │ • Relations     │
│ • Services      │    │ • Schemas       │    │ • Indexes       │
│ • State Mgmt    │    │ • CRUD Ops      │    │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Estructura de Datos

#### Modelo Relacional
```sql
-- Clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    address TEXT
);

-- Productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0
);

-- Facturas
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    total DECIMAL(10,2) NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    status VARCHAR DEFAULT 'pending'
);

-- Productos en Facturas (Relación N:M)
CREATE TABLE invoice_products (
    invoice_id INTEGER REFERENCES invoices(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (invoice_id, product_id)
);
```

### API Endpoints

#### Autenticación
```
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /api/v1/auth/me
```

#### Clientes
```
GET    /api/v1/clients/         # Listar todos
GET    /api/v1/clients/{id}     # Obtener por ID
POST   /api/v1/clients/         # Crear nuevo
PUT    /api/v1/clients/{id}     # Actualizar
DELETE /api/v1/clients/{id}     # Eliminar
```

#### Productos
```
GET    /api/v1/products/        # Listar todos
GET    /api/v1/products/{id}    # Obtener por ID
POST   /api/v1/products/        # Crear nuevo
PUT    /api/v1/products/{id}    # Actualizar
DELETE /api/v1/products/{id}    # Eliminar
```

#### Facturas
```
GET    /api/v1/invoices/        # Listar todas
GET    /api/v1/invoices/{id}    # Obtener por ID
POST   /api/v1/invoices/        # Crear nueva
PUT    /api/v1/invoices/{id}    # Actualizar
DELETE /api/v1/invoices/{id}    # Eliminar
```

## 🛠️ Configuración del Entorno

### Variables de Entorno (.env)
```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost/proyecto_u
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyecto_u
DB_USER=postgres
DB_PASSWORD=password

# Autenticación
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuración de la aplicación
APP_NAME=Sistema de Gestión de Facturas
APP_VERSION=1.0.0
DEBUG=True
```

### Configuración de Base de Datos
```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
```

## 🏗️ Patrones de Diseño Implementados

### 1. Repository Pattern
```python
# app/crud/base.py
from typing import Generic, TypeVar, Type
from sqlalchemy.orm import Session
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def get(self, db: Session, id: int):
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(self.model).offset(skip).limit(limit).all()
```

### 2. Dependency Injection
```python
# app/api/deps.py
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db)):
    # Lógica de autenticación
    pass
```

### 3. Schema Validation
```python
# app/schemas/client.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class ClientInDB(ClientBase):
    id: int
    
    class Config:
        from_attributes = True
```

## 🔒 Seguridad Implementada

### Autenticación JWT
```python
# app/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### Middleware de Seguridad
```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Estructura del Frontend

### Componentes Principales
```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── forms/           # Formularios
│   │   ├── ClientForm.tsx
│   │   └── ProductForm.tsx
│   └── layout/          # Componentes de layout
│       ├── Header.tsx
│       └── Sidebar.tsx
├── features/            # Funcionalidades por módulo
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── StatsCard.tsx
│   │   └── ChartComponent.tsx
│   ├── clients/
│   │   ├── ClientsList.tsx
│   │   ├── ClientForm.tsx
│   │   └── ClientDetails.tsx
│   └── invoices/
│       ├── InvoicesList.tsx
│       ├── InvoiceForm.tsx
│       └── InvoiceDetails.tsx
├── hooks/               # Custom hooks
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── services/           # Servicios de API
│   ├── api.ts
│   ├── clientService.ts
│   └── authService.ts
├── store/              # Estado global
│   ├── authSlice.ts
│   ├── clientSlice.ts
│   └── store.ts
└── types/              # Tipos TypeScript
    ├── client.ts
    ├── product.ts
    └── invoice.ts
```

### Manejo de Estado
```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import clientSlice from './clientSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    clients: clientSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Servicios de API
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🧪 Testing

### Backend Tests
```python
# tests/test_clients.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_client():
    response = client.post(
        "/api/v1/clients/",
        json={
            "name": "Test Client",
            "email": "test@example.com",
            "phone": "123456789"
        }
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test Client"
```

### Frontend Tests
```typescript
// src/components/__tests__/ClientForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ClientForm from '../ClientForm';

describe('ClientForm', () => {
  test('renders form fields', () => {
    render(<ClientForm />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: proyecto_u
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/proyecto_u

  frontend:
    build: ./app
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

## 📈 Métricas y Monitoreo

### Logging
```python
# app/core/logging.py
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Health Check
```python
# app/api/v1/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
```

## 🔄 Ciclo de Desarrollo

1. **Desarrollo Local**
   - Usar `uvicorn app.main:app --reload` para backend
   - Usar `npm run dev` para frontend

2. **Testing**
   - Ejecutar `pytest` para backend
   - Ejecutar `npm test` para frontend

3. **Build**
   - Backend: Docker build
   - Frontend: `npm run build`

4. **Deployment**
   - Docker compose up
   - Configurar variables de entorno
   - Ejecutar migraciones de BD

---

Esta documentación técnica proporciona una guía completa para entender, configurar y mantener el sistema de gestión de facturas.