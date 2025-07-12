# Guía de Inicio Rápido - Sistema de Gestión de Facturas

## 🚀 Instalación en 5 Minutos

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/jincol/proyecto_u.git
cd proyecto_u
```

### Paso 2: Configurar Backend
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env  # Editar con tus datos
```

### Paso 3: Configurar Frontend
```bash
cd app
npm install
```

### Paso 4: Configurar Base de Datos
```bash
# Instalar PostgreSQL
# Crear base de datos 'proyecto_u'
# Actualizar DATABASE_URL en .env
```

### Paso 5: Ejecutar Aplicación
```bash
# Terminal 1: Backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd app
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 📝 Primeros Pasos

### 1. Crear tu Primer Cliente
```bash
curl -X POST "http://localhost:8000/api/v1/clients/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Primer Cliente",
    "email": "cliente@example.com",
    "phone": "123456789",
    "address": "Dirección del cliente"
  }'
```

### 2. Crear un Producto
```bash
curl -X POST "http://localhost:8000/api/v1/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto de Prueba",
    "description": "Descripción del producto",
    "price": 29.99,
    "stock": 100
  }'
```

### 3. Crear una Factura
```bash
curl -X POST "http://localhost:8000/api/v1/invoices/" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "products": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ],
    "total": 59.98
  }'
```

## 🔧 Comandos Útiles

### Backend
```bash
# Ejecutar tests
pytest

# Generar migraciones
alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
alembic upgrade head

# Formatear código
black app/

# Linter
flake8 app/
```

### Frontend
```bash
# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Linter
npm run lint

# Formatear código
npm run format
```

## 📊 Estructura de Datos Inicial

### Clientes de Ejemplo
```json
{
  "name": "Empresa ABC",
  "email": "contacto@empresaabc.com",
  "phone": "+1234567890",
  "address": "Av. Principal 123, Ciudad"
}
```

### Productos de Ejemplo
```json
{
  "name": "Servicio de Consultoría",
  "description": "Consultoría técnica especializada",
  "price": 150.00,
  "stock": 50
}
```

## 🐛 Solución de Problemas Comunes

### Error: "No module named 'app'"
```bash
# Asegúrate de estar en el directorio correcto
cd proyecto_u
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar variables de entorno
cat .env | grep DATABASE
```

### Error: "Port already in use"
```bash
# Encontrar y terminar proceso
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 🔐 Configuración de Seguridad

### Generar SECRET_KEY
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Configurar CORS para Producción
```python
# app/main.py
origins = [
    "http://localhost:3000",
    "https://tudominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Cambiar ["*"] por origins específicos
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 📱 Funcionalidades Disponibles

### ✅ Completadas
- [x] CRUD de Clientes
- [x] CRUD de Productos
- [x] CRUD de Facturas
- [x] Autenticación JWT
- [x] Dashboard con estadísticas
- [x] Interfaz responsiva
- [x] Validación de datos

### 🔄 En Desarrollo
- [ ] Reportes avanzados
- [ ] Notificaciones por email
- [ ] Integración con pagos
- [ ] Aplicación móvil

## 🧪 Datos de Prueba

### Crear Usuario Admin
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Script de Datos de Prueba
```python
# scripts/seed_data.py
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Crear clientes de prueba
clients_data = [
    {
        "name": "Cliente Corporativo",
        "email": "corporativo@example.com",
        "phone": "555-0001",
        "address": "Av. Empresarial 100"
    },
    {
        "name": "Cliente Individual",
        "email": "individual@example.com",
        "phone": "555-0002",
        "address": "Calle Residencial 200"
    }
]

for client in clients_data:
    response = requests.post(f"{BASE_URL}/clients/", json=client)
    print(f"Cliente creado: {response.json()}")
```

## 🏗️ Personalización

### Agregar Nuevo Campo a Cliente
1. Actualizar modelo en `app/models/client.py`
2. Crear migración: `alembic revision --autogenerate -m "add field"`
3. Aplicar migración: `alembic upgrade head`
4. Actualizar esquema en `app/schemas/client.py`
5. Actualizar formulario en `app/src/features/clientes/ClientForm.tsx`

### Cambiar Tema de la Aplicación
```typescript
// app/src/theme/theme.ts
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Cambiar color principal
    },
    secondary: {
      main: '#dc004e', // Cambiar color secundario
    },
  },
});
```

## 📞 Soporte

### Logs de Aplicación
```bash
# Backend logs
tail -f app.log

# Frontend logs
# Ver consola del navegador
```

### Información del Sistema
```bash
# Versión de Python
python --version

# Versión de Node.js
node --version

# Versión de PostgreSQL
psql --version
```

---

¡Ahora tienes todo listo para comenzar a desarrollar! 🎉

Para más información detallada, consulta:
- [README.md](README.md) - Información general del proyecto
- [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Documentación técnica completa