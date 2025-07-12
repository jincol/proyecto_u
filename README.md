# Sistema de Gestión de Facturas - Proyecto U

## ¿Para qué está esta estructura?

Este proyecto es un **sistema completo de gestión de facturas** que permite a las empresas administrar clientes, productos e invoices de manera eficiente. La estructura está diseñada para ser escalable, mantenible y siguiendo las mejores prácticas de desarrollo.

## Arquitectura del Sistema

### 🏗️ Estructura General
```
proyecto_u/
├── app/                    # Aplicación principal
│   ├── api/               # APIs REST (Backend)
│   ├── src/               # Código fuente (Frontend)
│   ├── models/            # Modelos de base de datos
│   ├── schemas/           # Esquemas de validación
│   ├── crud/              # Operaciones CRUD
│   ├── core/              # Configuración central
│   ├── db/                # Configuración de base de datos
│   └── main.py            # Punto de entrada del backend
├── requirements.txt       # Dependencias de Python
└── venv/                  # Entorno virtual Python
```

### 🔧 Tecnologías Utilizadas

**Backend (API REST)**
- **FastAPI**: Framework web moderno y rápido para Python
- **SQLAlchemy**: ORM para manejo de base de datos
- **PostgreSQL**: Base de datos relacional
- **Pydantic**: Validación de datos
- **uvicorn**: Servidor ASGI
- **python-jose**: Manejo de JWT para autenticación
- **passlib**: Hashing de contraseñas

**Frontend (Aplicación Web)**
- **React 19**: Librería para interfaces de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Vite**: Herramienta de build y desarrollo
- **Material-UI**: Componentes de interfaz
- **React Router**: Enrutamiento del frontend
- **Axios**: Cliente HTTP para APIs
- **Recharts**: Gráficos y visualización de datos

## 📋 Funcionalidades del Sistema

### 1. Gestión de Clientes
- ✅ Crear, editar, eliminar y listar clientes
- ✅ Información completa: nombre, email, teléfono, dirección
- ✅ Validación de datos y emails únicos

### 2. Gestión de Productos
- ✅ Inventario de productos con stock
- ✅ Información: nombre, descripción, precio, stock disponible
- ✅ Control de existencias

### 3. Gestión de Facturas
- ✅ Crear facturas asociadas a clientes
- ✅ Agregar múltiples productos a una factura
- ✅ Cálculo automático de totales
- ✅ Estados de factura (pendiente, pagada, etc.)
- ✅ Historial de facturas

### 4. Dashboard y Reportes
- ✅ Panel de control con métricas
- ✅ Gráficos de ventas y estadísticas
- ✅ Exportación de datos

### 5. Autenticación y Seguridad
- ✅ Sistema de usuarios y roles
- ✅ Autenticación JWT
- ✅ Hashing seguro de contraseñas

## 🗂️ Descripción Detallada de la Estructura

### Backend (API)
```
app/
├── api/v1/                # Endpoints de la API versión 1
│   ├── client.py          # Rutas para clientes
│   ├── product.py         # Rutas para productos
│   ├── invoice.py         # Rutas para facturas
│   └── user.py            # Rutas para usuarios
├── models/                # Modelos de SQLAlchemy
│   ├── client.py          # Modelo Cliente
│   ├── product.py         # Modelo Producto
│   ├── invoice.py         # Modelo Factura
│   └── user.py            # Modelo Usuario
├── schemas/               # Esquemas Pydantic
├── crud/                  # Operaciones CRUD
├── core/                  # Configuración
├── db/                    # Configuración de DB
└── main.py                # Aplicación FastAPI
```

### Frontend (React)
```
src/
├── components/            # Componentes reutilizables
│   ├── Header.tsx         # Cabecera de la aplicación
│   ├── Sidebar.tsx        # Barra lateral de navegación
│   ├── NotificationBell.tsx # Notificaciones
│   └── ThemeToggle.tsx    # Cambio de tema
├── features/              # Funcionalidades por módulo
│   ├── dashboard/         # Panel de control
│   ├── clientes/          # Gestión de clientes
│   ├── facturas/          # Gestión de facturas
│   ├── inventario/        # Gestión de productos
│   └── auth/              # Autenticación
├── pages/                 # Páginas principales
├── api/                   # Cliente HTTP
└── routes/                # Configuración de rutas
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
# Crear archivo .env con las variables de entorno

# Ejecutar servidor
uvicorn app.main:app --reload
```

### Frontend
```bash
# Entrar al directorio de la aplicación
cd app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎯 Propósito del Sistema

Este sistema está diseñado para:

1. **Pequeñas y medianas empresas** que necesitan digitalizar su proceso de facturación
2. **Freelancers** que requieren un sistema simple pero profesional
3. **Empresas de servicios** que necesitan control de clientes y facturación
4. **Cualquier negocio** que busque automatizar la gestión de ventas

## 🔄 Flujo de Trabajo

1. **Registro de Clientes**: Agregar información de clientes
2. **Gestión de Inventario**: Mantener productos actualizados
3. **Creación de Facturas**: Seleccionar cliente y productos
4. **Seguimiento**: Monitorear estado de facturas
5. **Reportes**: Analizar ventas y rendimiento

## 🛡️ Seguridad

- Autenticación JWT
- Validación de datos en frontend y backend
- Hashing seguro de contraseñas
- Protección CORS configurada
- Validación de esquemas con Pydantic

## 📈 Escalabilidad

La estructura modular permite:
- Agregar nuevas funcionalidades fácilmente
- Separar responsabilidades
- Mantener código limpio y organizado
- Facilitar el trabajo en equipo
- Implementar pruebas unitarias

## 🔧 Próximas Mejoras

- [ ] Módulo de reportes avanzados
- [ ] Integración con sistemas de pago
- [ ] Notificaciones por email
- [ ] API para integraciones externas
- [ ] Aplicación móvil
- [ ] Backup automático de datos

---

**Resumen**: Esta estructura está diseñada para crear un sistema de gestión de facturas completo, escalable y fácil de mantener, utilizando tecnologías modernas tanto en el backend como en el frontend.