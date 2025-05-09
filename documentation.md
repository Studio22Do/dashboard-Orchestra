# Dashboard Orchestra - Documentación Completa

## Índice
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Configuración y Ejecución](#configuración-y-ejecución)
5. [Aplicaciones Disponibles](#aplicaciones-disponibles)
6. [API Backend](#api-backend)
7. [Interfaz Frontend](#interfaz-frontend)
8. [Variables de Entorno Necesarias](#variables-de-entorno-necesarias)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Solución de Problemas](#solución-de-problemas)
11. [Modo Desarrollo vs. Modo Producción](#modo-desarrollo-vs-modo-producción)
12. [Uso de Mock de Apps](#uso-de-mock-de-apps)
13. [Transición a Producción](#transición-a-producción)

## Descripción General

Dashboard Orchestra es una plataforma integral para análisis y gestión de datos de redes sociales y marketing digital. La plataforma está diseñada con una arquitectura de microservicios que proporciona una colección de herramientas especializadas para el monitoreo y análisis de redes sociales, SEO, tendencias y más.

## Estructura del Proyecto

```
dashboard-Orchestra/
│
├── dashboard_api/               # Directorio principal del proyecto
│   ├── backend/                 # Servicio backend en Flask
│   │   ├── api/                 # Módulos de API
│   │   │   ├── models/          # Modelos de base de datos
│   │   │   ├── routes/          # Rutas de API
│   │   │   └── utils/           # Utilidades y helpers
│   │   ├── blueprints/          # Blueprints de Flask
│   │   ├── utils/               # Utilidades generales
│   │   ├── app.py               # Aplicación principal Flask
│   │   ├── config.py            # Configuraciones
│   │   ├── requirements.txt     # Dependencias de Python
│   │   └── run.py               # Script de ejecución
│   │
│   └── frontend/                # Aplicación frontend en React
│       ├── public/              # Archivos estáticos públicos
│       ├── src/                 # Código fuente React
│       │   ├── components/      # Componentes reutilizables
│       │   ├── pages/           # Páginas de la aplicación
│       │   ├── redux/           # Estado global con Redux
│       │   ├── App.jsx          # Componente principal
│       │   └── index.jsx        # Punto de entrada
│       ├── package.json         # Dependencias y scripts
│       └── README.md            # Documentación del frontend
```

## Tecnologías Utilizadas

### Backend
- Flask
- Flask-RESTful
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Marshmallow
- Redis

### Frontend
- React 19
- React Router
- Redux Toolkit
- Material UI 7
- Axios
- date-fns

## Aplicaciones Disponibles

### Social Listening
- Instagram Statistics API ✅
- Google Trends ✅
- Google Paid Search API ✅
- Instagram Realtime API ✅
- ScrapTik ✅

### Creative & Content
- YouTube Media Downloader ✅
- All in One File Converter ✅
- Midjourney Best Experience ✅
- Word Count ✅
- PDF to Text Converter ✅
- Snap Video ✅
- Gerwin AI Beta ✅
- OpenAI Text to Speech ✅
- GenieAI - ChatGPT-3 Model ✅
- AI Social Media Content Generator ✅
- Advanced Image Manipulation API ✅
- Whisper: From URL ✅
- RunwayML ✅

### Web & SEO
- SEO Analyzer ✅
- Similar Web Insights ✅
- Google Keyword Insights ✅
- Domain Metrics Check ✅
- Ahrefs DR & Rank Checker ✅
- Page Speed Insights ✅
- AI eCommerce Product Description Generator ✅
- SSL Checker ✅
- Check if WEBSITE is UP or DOWN ✅
- URL Link Shortener and QR Code Generator ✅
- SEO Mastermind – AI Keyword, Meta & Title Generator ✅

## Configuración y Ejecución

### Requisitos Previos
- Python 3.8+
- Node.js 18+
- npm o yarn
- Redis (opcional)
- Variables de entorno configuradas

### Instalación del Backend

1. Navegar al directorio del backend:
```bash
cd dashboard-Orchestra/dashboard_api/backend
```

2. Crear y activar entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
Crear archivo `.env` con:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=tu_clave_secreta
JWT_SECRET_KEY=tu_clave_jwt
```

5. Inicializar base de datos:
```bash
flask init-db
flask update-apps
```

6. Ejecutar servidor:
```bash
python run.py
```

### Instalación del Frontend

1. Navegar al directorio del frontend:
```bash
cd dashboard-Orchestra/dashboard_api/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` con:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

4. Ejecutar servidor de desarrollo:
```bash
npm start
```

## API Backend

### Endpoints Principales

- **Autenticación**:
  - `POST /api/auth/login`: Inicio de sesión
  - `POST /api/auth/refresh`: Actualización de token

- **Aplicaciones**:
  - `GET /api/apps`: Lista de aplicaciones
  - `GET /api/apps/<app_id>`: Detalles de aplicación

## Interfaz Frontend

### Componentes Principales
- Dashboard
- CategorySection
- ToolCard
- Layout

### Características
- Diseño Responsivo
- Carrusel de Herramientas
- Temas Claro/Oscuro
- Visualización de Datos
- Navegación Intuitiva
- Gestión de Estado con Redux
- Protección de Rutas
- Integración con APIs

## Modo Desarrollo vs. Modo Producción

### Modo Desarrollo
- Acceso sin autenticación
- Datos mock para pruebas
- Logs detallados
- Hot-reloading

### Modo Producción
- Autenticación requerida
- Datos reales
- Optimizaciones de rendimiento
- Logs mínimos

## Uso de Mock de Apps

Durante el desarrollo, el frontend utiliza datos mock para simular la lista de apps disponibles. Esto permite:
- Desarrollo sin backend
- Pruebas rápidas
- Prototipado de UI
- Pruebas de funcionalidad

## Transición a Producción

Para migrar de desarrollo a producción:
1. Configurar variables de entorno de producción
2. Deshabilitar modo desarrollo
3. Habilitar autenticación
4. Conectar con backend real
5. Optimizar build
6. Configurar servidor de producción

## Solución de Problemas

### Backend
- Verificar logs en `dashboard_api/backend/logs/`
- Comprobar conexión a base de datos
- Validar variables de entorno

### Frontend
- Revisar consola del navegador
- Verificar conexión con backend
- Comprobar estado de Redux

### APIs Externas
- Validar claves de API
- Comprobar límites de uso
- Revisar logs de error

---
