# Dashboard API - Instagram Real-time

API para obtener datos en tiempo real de Instagram para el dashboard de análisis.

## Requisitos

- Python 3.8+
- pip

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

## Tests
```
pytest
``` 