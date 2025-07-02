# Dashboard API - Instagram Real-time

API para obtener datos en tiempo real de Instagram para el dashboard de análisis.

## Requisitos

- Python 3.8+
- pip
- Node.js 18+
- npm o yarn

## Instalación

1. Clona el repositorio:
```
git clone https://github.com/ejemplo/dashboard-instagram-api.git
cd dashboard-instagram-api
```

2. Crea un entorno virtual e instala las dependencias:
```
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
FLASK_ENV=development
SECRET_KEY=tu-clave-secreta
INSTAGRAM_API_KEY=tu-api-key-de-instagram
INSTAGRAM_API_BASE_URL=https://api.instagram.example.com
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Ejecución

### Desarrollo
```
cd dashboard_api
python -m backend.app
```

### Producción
```
cd dashboard_api
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
```

## Endpoints

### Salud de la API
`GET /health`

### Instagram Real-time
- `GET /api/instagram-realtime/followers?username=[username]` - Obtiene el conteo de seguidores
- `GET /api/instagram-realtime/engagement?username=[username]` - Obtiene métricas de engagement

### Sistema de Apps
- `GET /api/apps` - Lista todas las apps disponibles
- `GET /api/apps/user/apps` - Obtiene las apps compradas por el usuario
- `GET /api/apps/user/favorites` - Obtiene las apps favoritas del usuario
- `POST /api/apps/user/apps/{id}/purchase` - Compra una app
- `POST /api/apps/user/apps/{id}/favorite` - Marca/desmarca una app como favorita

## Tests
```
pytest
```

## Estructura de Apps

El dashboard incluye tres categorías principales de apps:

1. **Social Listening**
   - Instagram Statistics API
   - Google Trends
   - Google Paid Search API
   - Instagram Realtime API
   - TikTok Analytics

2. **Creative & Content**
   - YouTube Media Downloader
   - File Converter
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

## Modo Desarrollo

En modo desarrollo, el sistema utiliza datos mock para simular las apps y sus funcionalidades. Esto permite:

- Desarrollo sin backend
- Pruebas rápidas de UI
- Prototipado de funcionalidades
- Pruebas de integración

Para activar el modo desarrollo, asegúrate de que `REACT_APP_ENV=development` esté configurado en tu archivo `.env`.

## Modo Producción

En modo producción, el sistema se conecta con el backend real y requiere:

- Autenticación de usuario
- Tokens válidos
- Conexión a APIs reales
- Base de datos configurada

Para activar el modo producción, configura `REACT_APP_ENV=production` en tu archivo `.env`. 