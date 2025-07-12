# Frontend - Sistema de Gestión de Facturas

Este es el frontend del sistema de gestión de facturas, construido con React + TypeScript + Vite.

## 🚀 Tecnologías Utilizadas

- **React 19** - Librería de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de build y desarrollo
- **Material-UI** - Componentes de interfaz
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualización

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
├── features/          # Funcionalidades por módulo
│   ├── dashboard/     # Panel de control
│   ├── clientes/      # Gestión de clientes
│   ├── facturas/      # Gestión de facturas
│   ├── inventario/    # Gestión de productos
│   └── auth/          # Autenticación
├── pages/             # Páginas principales
├── api/               # Servicios de API
├── routes/            # Configuración de rutas
├── store/             # Estado global
└── types/             # Tipos TypeScript
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Preview de producción
npm run preview
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env.local` con:
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Sistema de Gestión de Facturas
```

### Configuración de ESLint
El proyecto incluye configuración de ESLint con reglas específicas para React y TypeScript.

## 📚 Documentación Completa

Para información completa sobre el proyecto, consulta:
- [README.md](../README.md) - Información general del sistema
- [TECHNICAL_DOCS.md](../TECHNICAL_DOCS.md) - Documentación técnica
- [QUICK_START.md](../QUICK_START.md) - Guía de inicio rápido

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
