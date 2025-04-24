# Backend de la API de Dashboard

Backend desarrollado en Flask para la plataforma RapidAPI Dashboard.

## Estructura del Proyecto

```
backend/
├── api/
│   ├── models/      # Modelos SQLAlchemy
│   ├── routes/      # Rutas y endpoints de la API
│   └── utils/       # Utilidades y funciones auxiliares
├── app.py           # Punto de entrada de la aplicación
├── config.py        # Configuración del entorno
└── requirements.txt # Dependencias
```

## Requisitos

- Python 3.8+
- Las dependencias listadas en `requirements.txt`

## Instalación

### 1. Crear y activar entorno virtual (IMPORTANTE)

**Es altamente recomendable usar un entorno virtual para mantener las dependencias del proyecto aisladas:**

```bash
# Crear el entorno virtual
python3 -m venv venv

# Activar el entorno virtual
# En Linux/Mac:
source venv/bin/activate

# En Windows:
# venv\Scripts\activate
```

> **Nota:** El entorno virtual debe activarse cada vez que se trabaje en el proyecto.

### 2. Instalar dependencias

Una vez activado el entorno virtual, instalar las dependencias:

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```
# Entorno de Flask
FLASK_ENV=development
FLASK_APP=app.py
FLASK_DEBUG=1

# Configuración de seguridad
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production

# Base de datos
DEV_DATABASE_URI=sqlite:///dev.db
TEST_DATABASE_URI=sqlite:///:memory:
DATABASE_URI=sqlite:///prod.db

# Puerto
PORT=5000
```

## Ejecución

1. Asegúrate de que el entorno virtual esté activado (el prompt debe mostrar `(venv)`)

2. Ejecuta el servidor de desarrollo:
   ```bash
   # Configurar variables de entorno (si no están en .env)
   export FLASK_ENV=development
   export FLASK_APP=app.py
   export FLASK_DEBUG=1

   # Iniciar el servidor
   flask run
   ```
   
   Alternativamente:
   ```bash
   python app.py
   ```

3. Para inicializar la base de datos manualmente:
   ```bash
   flask init-db
   ```

El servidor estará disponible en `http://127.0.0.1:5000/`

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token de acceso
- `GET /api/auth/me` - Obtener información del usuario actual

### Aplicaciones

- `GET /api/apps/` - Obtener todas las aplicaciones
- `GET /api/apps/<app_id>` - Obtener detalles de una aplicación
- `POST /api/apps/` - Crear una nueva aplicación
- `PUT /api/apps/<app_id>` - Actualizar una aplicación
- `POST /api/apps/<app_id>/usage` - Registrar uso de una API

### Estadísticas

- `GET /api/stats/dashboard` - Obtener estadísticas para el dashboard
- `GET /api/stats/apps/<app_id>` - Obtener estadísticas de una aplicación

## Credenciales de Prueba

Durante el desarrollo, se crea automáticamente un usuario de prueba:
- Email: `test@example.com`
- Contraseña: `test123`
- Rol: `admin`

## Desarrollo

El backend está configurado para cargar datos de prueba automáticamente en el entorno de desarrollo. 