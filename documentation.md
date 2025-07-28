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
15. [Mejoras Recientes Implementadas](#mejoras-recientes-implementadas)

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
- PostgreSQL (base de datos principal)

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
- **Speech to Text AI** ✅ (Nuevo)

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
- PostgreSQL
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
DATABASE_URI=postgresql://username:password@localhost/rapidapi_dashboard
RAPIDAPI_KEY=tu_clave_rapidapi
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
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

4. Ejecutar servidor de desarrollo:
```bash
npm start
```

## API Backend

### Endpoints Principales

- **Autenticación**:
  - `POST /api/beta_v2/auth/login`: Inicio de sesión
  - `POST /api/beta_v2/auth/register`: Registro de usuario
  - `POST /api/beta_v2/auth/refresh`: Actualización de token
  - `GET /api/beta_v2/auth/me`: Información del usuario

- **Aplicaciones**:
  - `GET /api/beta_v2/apps`: Lista de aplicaciones
  - `GET /api/beta_v2/apps/<app_id>`: Detalles de aplicación
  - `GET /api/beta_v2/apps/user/favorites`: Apps favoritas
  - `POST /api/beta_v2/apps/user/apps/<app_id>/favorite`: Marcar como favorita

- **Estadísticas**:
  - `GET /api/beta_v2/stats/dashboard`: Dashboard de Analytics
  - `GET /api/beta_v2/stats/apps/<app_id>`: Estadísticas de app específica

- **Notificaciones**:
  - `GET /api/beta_v2/notifications`: Lista de notificaciones
  - `GET /api/beta_v2/notifications/unread`: Notificaciones no leídas
  - `POST /api/beta_v2/notifications/mark-read`: Marcar como leída

## Interfaz Frontend

### Componentes Principales
- Dashboard
- CategorySection
- ToolCard
- Layout
- Analytics Dashboard
- NotificationBell

### Características
- Diseño Responsivo
- Carrusel de Herramientas
- Temas Claro/Oscuro
- Visualización de Datos
- Navegación Intuitiva
- Gestión de Estado con Redux
- Protección de Rutas
- Integración con APIs
- Sistema de Notificaciones
- Dashboard de Analytics con datos reales

## Modo Desarrollo vs. Modo Producción

### Modo Desarrollo (beta_v1)
- Acceso sin autenticación
- Datos mock para pruebas
- Logs detallados
- Hot-reloading

### Modo Producción (beta_v2)
- Autenticación requerida
- Datos reales de base de datos
- Optimizaciones de rendimiento
- Logs mínimos
- Sistema de roles y permisos

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

### Dependencias Faltantes
Si después de un `git pull` encuentras errores como:
```
Module not found: Error: Can't resolve 'swiper/react'
Module not found: Error: Can't resolve 'swiper/modules'
Module not found: Error: Can't resolve 'swiper/css'
```
Esto significa que faltan dependencias que están siendo utilizadas en el código. Para solucionarlo:

1. Instalar las dependencias faltantes:
   ```bash
   npm install swiper
   # o
   yarn add swiper
   ```

2. Si el error persiste, verifica el `package.json` y asegúrate de que todas las dependencias estén listadas.

3. Después de cada `git pull`, siempre ejecuta:
   ```bash
   npm install
   # o
   yarn install
   ```
   para actualizar todas las dependencias.

### APIs Externas
- Validar claves de API
- Comprobar límites de uso
- Revisar logs de error

### Problemas de Autenticación
- Verificar que el hash de contraseña sea compatible (usar `pbkdf2:sha256`)
- Asegurar que el usuario esté activo y verificado
- Comprobar que la columna `password_hash` tenga suficiente espacio (255 caracteres)

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
   - **Speech to Text AI**

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
GET    /api/beta_v2/apps              - Lista todas las apps
GET    /api/beta_v2/apps/user/apps    - Apps compradas
GET    /api/beta_v2/apps/user/favorites - Apps favoritas
POST   /api/beta_v2/apps/user/apps/{id}/purchase - Comprar app
POST   /api/beta_v2/apps/user/apps/{id}/favorite - Marcar como favorita
```

### Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:5000  # URL del backend (sin /api al final)
REACT_APP_ENV=development                # Modo de operación
```

## Mejoras Recientes Implementadas

### Sistema de Autenticación Mejorado

#### Gestión de Contraseñas
- **Hash Compatible**: Implementado sistema de hash `pbkdf2:sha256` compatible con werkzeug
- **Base de Datos**: Columna `password_hash` expandida a 255 caracteres
- **Verificación Robusta**: Sistema de verificación de contraseñas sin errores de OpenSSL

#### Estructura de Usuario
```sql
-- Tabla users con campos mejorados
id                   | integer (primary key)
email                | character varying(100) (unique)
password_hash        | character varying(255) (hash pbkdf2:sha256)
name                 | character varying(100)
role                 | character varying(20) (user, admin, superadmin)
is_active            | boolean (default: true)
is_verified          | boolean (default: false)
version              | character varying(20) (beta_v1, beta_v2)
```

### Sistema de Control de Acceso Basado en Roles (RBAC)

#### Roles Implementados
1. **user**: Usuario normal con acceso básico
2. **admin**: Administrador con acceso a Analytics y gestión
3. **superadmin**: Super administrador con acceso total

#### Decorador de Roles
```python
@role_required('admin', 'superadmin')
def protected_endpoint():
    # Solo accesible para admin y superadmin
    pass
```

#### Permisos por Rol
- **user**: Dashboard básico, apps compradas
- **admin**: Analytics completo, métricas globales
- **superadmin**: Todo + gestión de usuarios (futuro)

### Dashboard de Analytics con Datos Reales

#### Componentes Implementados
1. **Vista General**: Métricas principales (llamadas API, usuarios activos, apps, tasa de éxito)
2. **Uso de Herramientas**: Gráfico de uso por aplicación
3. **Rendimiento de APIs**: Tabla de estado y rendimiento de APIs
4. **Métricas de Usuario**: Estadísticas de usuarios y crecimiento

#### Integración con Backend
- **Endpoint**: `/api/beta_v2/stats/dashboard`
- **Datos Reales**: Conectado a PostgreSQL
- **Filtrado por Rol**: Diferentes métricas según el rol del usuario
- **Estado de Carga**: Loading states y manejo de errores

#### Estructura de Datos
```javascript
{
  metrics: {
    apiCalls: { value: "10", change: "+0%", label: "Llamadas API" },
    activeUsers: { value: "5", change: "+0%", label: "Usuarios Activos" },
    totalApps: { value: "11", change: "+0", label: "Apps Activas" },
    successRate: { value: "99.8%", change: "+0%", label: "Tasa de Éxito" }
  },
  usage: [
    { tool: "Instagram Statistics", percent: 45 },
    { tool: "SEO Analyzer", percent: 30 }
  ],
  userMetrics: [
    {
      title: "Usuarios Activos",
      value: "5",
      change: "+0%",
      period: "vs mes anterior",
      icon: "GroupAdd",
      color: "#837cf2"
    }
  ],
  apiPerformance: [
    {
      name: "Instagram API",
      status: "success",
      responseTime: "245ms",
      uptime: "99.9%",
      lastCheck: "2 min ago"
    }
  ]
}
```

### Sistema de Notificaciones

#### Componente NotificationBell
- **Icono de Campana**: Con badge de notificaciones no leídas
- **Dropdown**: Lista de notificaciones recientes
- **Acciones**: Marcar como leída, limpiar todas
- **Persistente**: Notificaciones almacenadas en base de datos

#### Modelo de Notificación
```python
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    type = db.Column(db.String(50))  # info, warning, error, success
    title = db.Column(db.String(200))
    message = db.Column(db.Text)
    category = db.Column(db.String(50))
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    link = db.Column(db.String(500))
```

#### Endpoints de Notificaciones
```
GET    /api/beta_v2/notifications           - Lista todas las notificaciones
GET    /api/beta_v2/notifications/unread    - Notificaciones no leídas
POST   /api/beta_v2/notifications/mark-read - Marcar como leída
DELETE /api/beta_v2/notifications/clear     - Limpiar todas
```

### Nuevas APIs Integradas

#### Speech to Text AI
- **Endpoint**: `/api/beta_v2/speech-to-text/transcribe`
- **Funcionalidad**: Conversión de audio a texto desde URL
- **Integración**: RapidAPI Speech-to-Text AI
- **Frontend**: Componente completo con UI moderna

#### SEO Analyzer Mejorado
- **Endpoint**: `/api/beta_v2/seo-analyzer/analyze`
- **Funcionalidad**: Análisis completo de SEO de sitios web
- **Integración**: RapidAPI SEO Analyzer
- **Datos**: URL, estado HTTP, HTTPS, tamaño de contenido, score

### Mejoras en la Configuración

#### Configuración de JWT
```python
# config.py
JWT_ALGORITHM = 'HS256'
JWT_TOKEN_LOCATION = ['headers']
JWT_HEADER_NAME = 'Authorization'
JWT_HEADER_TYPE = 'Bearer'
```

#### Configuración de CORS Mejorada
```python
# app.py
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://192.168.13.109:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"]
    }
})
```

### Correcciones de Bugs y Mejoras de UX

#### Frontend
- **URL Base**: Corrección automática de URLs duplicadas (`/api/api/`)
- **Manejo de Arrays**: Protección contra errores de `.map()` en componentes
- **Estados de Carga**: Loading states en todos los componentes
- **Manejo de Errores**: Try-catch robusto en todas las operaciones

#### Backend
- **Validación de Datos**: Mejor validación con Marshmallow
- **Manejo de Excepciones**: Logging detallado y respuestas consistentes
- **Base de Datos**: Migraciones y estructura optimizada
- **Autenticación**: Sistema robusto sin errores de OpenSSL

### Gestión de Usuarios

#### Comandos Útiles para Base de Datos
```sql
-- Verificar usuario
SELECT id, email, name, role, is_active, is_verified FROM users WHERE email = 'user@example.com';

-- Activar usuario
UPDATE users SET is_active = true, is_verified = true WHERE email = 'user@example.com';

-- Cambiar contraseña (generar hash primero)
UPDATE users SET password_hash = 'pbkdf2:sha256:1000000$...' WHERE email = 'user@example.com';

-- Cambiar rol
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

#### Generación de Hash de Contraseña
```bash
# En el backend
python3 -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('password', method='pbkdf2:sha256'))"
```

### Próximas Funcionalidades Planificadas

1. **Panel de Administración**: Gestión completa de usuarios y apps
2. **Sistema de Planes**: Planes premium con límites de uso
3. **Logs de Auditoría**: Registro de todas las acciones de usuarios
4. **API Rate Limiting**: Límites de uso por usuario y plan
5. **Notificaciones Push**: Notificaciones en tiempo real
6. **Exportación de Datos**: Exportar métricas y reportes
7. **Integración de Pagos**: Sistema de suscripciones

---
