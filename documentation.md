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
14. [Sistema de Apps y Drawer](#sistema-de-apps-y-drawer)

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

## Sistema de Apps y Drawer

### Estructura de Apps

Cada app en el dashboard está definida con la siguiente estructura:

```javascript
{
  id: 'unique-id',              // Identificador único de la app
  title: 'App Title',           // Título de la app
  description: 'Description',   // Descripción detallada
  imageUrl: 'url-to-image',     // URL de la imagen de la app
  category: 'Category',         // Categoría (Social Listening, Creative & Content, Web & SEO)
  route: '/apps/route',         // Ruta de la app en el frontend
  apiName: 'API Name'           // Nombre de la API asociada
}
```

### Categorías de Apps

El dashboard organiza las apps en tres categorías principales:

1. **Social Listening**
   - Instagram Statistics API
   - Google Trends
   - Google Paid Search API
   - Instagram Realtime API
   - TikTok Analytics

2. **Creative & Content**
   - YouTube Media Downloader
   - File Converter
   - Midjourney
   - Word Count
   - PDF to Text
   - Snap Video
   - Gerwin AI
   - OpenAI TTS
   - GenieAI
   - AI Social Media
   - Image Manipulation
   - Whisper URL
   - RunwayML

3. **Web & SEO**
   - SEO Analyzer
   - Similar Web
   - Keyword Insights
   - Domain Metrics
   - Ahrefs Checker
   - Page Speed
   - Product Description Generator
   - SSL Checker
   - Website Status
   - URL Shortener
   - SEO Mastermind

### AppDetailDrawer

El `AppDetailDrawer` es un componente que muestra los detalles de una app cuando se hace clic en ella. Características:

- Se abre desde el lado derecho de la pantalla
- Muestra:
  - Imagen de la app
  - Título
  - Descripción
  - Categoría
  - API Name
  - Botón de acción (Agregar/Abrir)

#### Funcionamiento

1. **Apertura del Drawer**
   ```javascript
   setSelectedApp({
     id: 'app-id',
     title: 'App Title',
     description: 'Description',
     imageUrl: 'url',
     category: 'Category',
     route: '/apps/route',
     apiName: 'API Name'
   });
   setDrawerOpen(true);
   ```

2. **Acción de Agregar**
   - Si la app no está comprada, muestra botón "Agregar"
   - Al hacer clic, dispara la acción `purchaseApp` de Redux
   - La app se agrega a `purchasedApps` en el estado de Redux

3. **Acción de Abrir**
   - Si la app está comprada, muestra botón "Abrir"
   - Al hacer clic, navega a la ruta de la app

### Estado de Redux

El estado de las apps se maneja en `appsSlice.js` con las siguientes características:

```javascript
const initialState = {
  allApps: [],          // Todas las apps disponibles
  purchasedApps: [],    // Apps compradas por el usuario
  favoriteApps: [],     // Apps marcadas como favoritas
  loading: false,       // Estado de carga
  error: null          // Errores
};
```

#### Acciones Principales

1. **fetchAllApps**: Obtiene todas las apps disponibles
2. **purchaseApp**: Agrega una app a las compradas
3. **toggleFavoriteApp**: Marca/desmarca una app como favorita
4. **fetchPurchasedApps**: Obtiene las apps compradas
5. **fetchFavoriteApps**: Obtiene las apps favoritas

### Modo Mock vs. Producción

El sistema soporta dos modos de operación:

1. **Modo Mock**
   - Usa `MOCK_APPS_DATA` para simular apps
   - No requiere backend
   - Ideal para desarrollo y pruebas

2. **Modo Producción**
   - Conecta con backend real
   - Requiere autenticación
   - Usa endpoints reales para operaciones

### Integración con Backend

Los endpoints principales para la gestión de apps son:

```
GET    /api/apps              - Lista todas las apps
GET    /api/apps/user/apps    - Apps compradas
GET    /api/apps/user/favorites - Apps favoritas
POST   /api/apps/user/apps/{id}/purchase - Comprar app
POST   /api/apps/user/apps/{id}/favorite - Marcar como favorita
```

### Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:5000/api  # URL del backend
REACT_APP_ENV=development                    # Modo de operación
```

---
