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

## Descripción General

Dashboard Orchestra es una plataforma integral para análisis y gestión de datos de redes sociales y marketing digital. La plataforma está diseñada con una arquitectura de microservicios que proporciona una colección de herramientas especializadas para el monitoreo y análisis de redes sociales, SEO, tendencias y más.

El proyecto sigue un patrón de diseño modular, con un backend en Flask que proporciona APIs RESTful para cada una de las herramientas, y un frontend en React que ofrece una interfaz de usuario moderna e intuitiva.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

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
│
├── requirements.txt             # Dependencias globales
├── logging_config.ini           # Configuración de logs
└── README.md                    # Documentación general
```

## Tecnologías Utilizadas

### Backend
- **Flask**: Framework web de Python
- **Flask-RESTful**: Extensión para crear APIs RESTful
- **Flask-SQLAlchemy**: ORM para interacción con bases de datos
- **Flask-Migrate**: Manejo de migraciones de base de datos
- **Flask-JWT-Extended**: Autenticación mediante JWT
- **Marshmallow**: Serialización/deserialización de objetos Python
- **Redis**: Caché y almacenamiento temporal

### Frontend
- **React 19**: Biblioteca para interfaces de usuario
- **React Router**: Enrutamiento del lado del cliente
- **Redux Toolkit**: Gestión de estado global
- **Material UI 7**: Componentes UI con diseño Material Design
- **Axios**: Cliente HTTP para peticiones a API
- **date-fns**: Utilidades para manejo de fechas

## Configuración y Ejecución

### Requisitos Previos
- Python 3.8+ y pip
- Node.js 18+ y npm
- Redis (opcional, para caché)
- Variables de entorno (ver sección correspondiente)

### Instalación y Ejecución del Backend

1. Navegar al directorio del backend:
```bash
cd dashboard-Orchestra/dashboard_api/backend
```

2. Crear y activar un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
   - Crear un archivo `.env` en el directorio backend (ver sección de Variables de Entorno)

5. Inicializar la base de datos:
```bash
flask init-db
flask update-apps
```

6. Ejecutar el servidor backend:
```bash
python run.py
# O alternativamente:
flask run --host=0.0.0.0 --port=5000
```

El servidor backend estará disponible en `http://localhost:5000`

### Instalación y Ejecución del Frontend

1. Navegar al directorio del frontend:
```bash
cd dashboard-Orchestra/dashboard_api/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en el directorio frontend (ver sección de Variables de Entorno)

4. Ejecutar el servidor de desarrollo:
```bash
npm start
```

La aplicación frontend estará disponible en `http://localhost:3000`

## Aplicaciones Disponibles

El dashboard incluye las siguientes aplicaciones principales agrupadas por categorías:

### Social Listening
- **Instagram Statistics API**: Análisis de estadísticas de cuentas de Instagram
- **Google Trends**: Análisis de tendencias de búsqueda en Google
- **Google Paid Search API**: Análisis de campañas de búsqueda pagada en Google
- **Instagram Realtime API**: Monitoreo en tiempo real de actividad en Instagram
- **TikTok API (ScrapTik)**: Análisis de contenido y tendencias en TikTok

### Creative & Content
- **YouTube Media Downloader**: Herramienta para descargar contenido de YouTube
- **Word Count**: Análisis de texto y conteo de palabras

### Web & SEO
- **SEO Analyzer**: Análisis de SEO para sitios web
- **Page Speed Insights**: Análisis de velocidad de carga de páginas web

## API Backend

El backend proporciona una serie de endpoints RESTful para interactuar con las diferentes aplicaciones:

### Endpoints Principales

- **Autenticación**:
  - `POST /api/auth/login`: Inicio de sesión y generación de token JWT
  - `POST /api/auth/refresh`: Actualización de token JWT

- **Aplicaciones**:
  - `GET /api/apps`: Obtener lista de todas las aplicaciones disponibles
  - `GET /api/apps/<app_id>`: Obtener detalles de una aplicación específica

- **Instagram Statistics**:
  - `GET /api/instagram/stats/<username>`: Obtener estadísticas de un perfil de Instagram
  - `GET /api/instagram/posts/<username>`: Obtener publicaciones recientes de un perfil

- **Google Trends**:
  - `GET /api/trends/explore`: Explorar tendencias por términos de búsqueda
  - `GET /api/trends/related`: Obtener términos relacionados a una búsqueda

- **Google Paid Search**:
  - `GET /api/paid-search/campaigns`: Obtener datos de campañas de búsqueda pagada
  - `GET /api/paid-search/keywords`: Analizar rendimiento de palabras clave

### Autenticación

La API utiliza autenticación JWT. Para realizar solicitudes a endpoints protegidos:

1. Obtener token mediante el endpoint de login
2. Incluir el token en el header de todas las solicitudes:
   ```
   Authorization: Bearer <tu_token_jwt>
   ```

## Interfaz Frontend

La interfaz de usuario del frontend está organizada por:

### Componentes Principales
- **Dashboard**: Página principal con acceso a todas las aplicaciones
- **CategorySection**: Secciones del dashboard por categoría
- **ToolCard**: Tarjetas para cada herramienta/aplicación
- **Layout**: Estructura general con barra lateral y área de contenido

### Navegación

El sistema utiliza React Router para la navegación entre páginas:

- `/`: Dashboard principal
- `/apps/instagram`: Instagram Statistics
- `/apps/trends`: Google Trends
- `/apps/paid-search`: Google Paid Search
- `/instagram-realtime`: Instagram Realtime
- `/tiktok`: TikTok/ScrapTik

### Características de la Interfaz

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Carrusel de Herramientas**: Navegación horizontal entre múltiples herramientas
- **Temas Claro/Oscuro**: Soporte para diferentes modos de visualización
- **Visualización de Datos**: Gráficos y tablas para análisis visual de datos

## Variables de Entorno Necesarias

### Backend (.env)
```
# General
FLASK_APP=app.py
FLASK_ENV=development  # development o production
SECRET_KEY=tu_clave_secreta_muy_segura

# JWT
JWT_SECRET_KEY=tu_clave_jwt_secreta

# APIs
INSTAGRAM_API_KEY=tu_clave_api_instagram
GOOGLE_API_KEY=tu_clave_api_google
TIKTOK_API_KEY=tu_clave_api_tiktok

# Base de datos
DATABASE_URL=sqlite:///api/dev.db  # SQLite para desarrollo
# DATABASE_URL=postgresql://usuario:contraseña@localhost/dashboard  # PostgreSQL para producción
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Ejemplos de Uso

### Consulta de tendencias con Google Trends
1. Ingresar a la sección "Google Trends" desde el Dashboard
2. Ingresar términos de búsqueda separados por comas
3. Seleccionar región y periodo de tiempo
4. Visualizar los gráficos comparativos de tendencias

### Análisis de perfil de Instagram
1. Acceder a "Instagram Statistics" desde el Dashboard
2. Ingresar el nombre de usuario de Instagram a analizar
3. Obtener métricas de seguidores, engagement y crecimiento
4. Exportar los resultados en formato CSV o PDF

## Solución de Problemas

### El servidor backend no inicia
- Verificar que todas las dependencias estén instaladas: `pip install -r requirements.txt`
- Comprobar la configuración de la base de datos y asegurarse de que sea accesible
- Revisar los logs en `dashboard_api/backend/logs/`

### El frontend no se conecta al backend
- Verificar que el backend esté en ejecución y accesible
- Comprobar la URL del API en la variable de entorno `REACT_APP_API_URL`
- Revisar errores CORS en la consola del navegador

### Errores de autenticación
- Verificar que el token JWT esté siendo enviado correctamente
- Comprobar que el token no haya expirado
- Verificar las claves secretas en las variables de entorno

### Problemas con APIs externas
- Verificar que las claves de API externas sean válidas
- Comprobar los límites de uso de las APIs
- Revisar los logs de error para identificar problemas específicos
