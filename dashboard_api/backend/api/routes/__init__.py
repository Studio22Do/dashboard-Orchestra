"""Rutas para la API"""
import logging

logger = logging.getLogger(__name__)

print("Inicializando rutas de la API en dashboard_api/backend/api/routes/__init__.py")

# Importar todas las rutas para asegurar que están disponibles
try:
    from . import auth
    print("Módulo de rutas auth importado")
except ImportError as e:
    print(f"Error importando módulo auth: {e}")

try:
    from . import apps
    print("Módulo de rutas apps importado")
except ImportError as e:
    print(f"Error importando módulo apps: {e}")

try:
    from . import stats
    print("Módulo de rutas stats importado")
except ImportError as e:
    print(f"Error importando módulo stats: {e}")

try:
    from . import instagram
    print("Módulo de rutas instagram importado")
except ImportError as e:
    print(f"Error importando módulo instagram: {e}")

try:
    from . import instagram_realtime
    print("Módulo de rutas instagram_realtime importado")
except ImportError as e:
    print(f"Error importando módulo instagram_realtime: {e}")

try:
    from . import google_trends
    print("Módulo de rutas google_trends importado")
except ImportError as e:
    print(f"Error importando módulo google_trends: {e}")

try:
    from . import google_paid_search
    print("Módulo de rutas google_paid_search importado")
except ImportError as e:
    print(f"Error importando módulo google_paid_search: {e}")

try:
    from . import scraptik
    print("Módulo de rutas scraptik importado")
except ImportError as e:
    print(f"Error importando módulo scraptik: {e}")

try:
    from . import youtube_media
    print("Módulo de rutas youtube_media importado")
except ImportError as e:
    print(f"Error importando módulo youtube_media: {e}")

try:
    from . import file_converter
    print("Módulo de rutas file_converter importado")
except ImportError as e:
    print(f"Error importando módulo file_converter: {e}")

try:
    from . import tiktok_api
    print("Módulo de rutas tiktok_api importado")
except ImportError as e:
    print(f"Error importando módulo tiktok_api: {e}")

print("Finalizada inicialización de rutas de la API") 