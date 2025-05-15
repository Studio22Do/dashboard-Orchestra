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

try:
    from . import runwayml
    print("Módulo de rutas runwayml importado")
except ImportError as e:
    print(f"Error importando módulo runwayml: {e}")

try:
    from . import similarweb
    print("Módulo de rutas similarweb importado")
except ImportError as e:
    print(f"Error importando módulo similarweb: {e}")

try:
    from . import google_keyword_insight
    print("Módulo de rutas google_keyword_insight importado")
except ImportError as e:
    print(f"Error importando módulo google_keyword_insight: {e}")

try:
    from . import domain_metrics
    print("Módulo de rutas domain_metrics importado")
except ImportError as e:
    print(f"Error importando módulo domain_metrics: {e}")

try:
    from . import ahrefs_dr
    print("Módulo de rutas ahrefs_dr importado")
except ImportError as e:
    print(f"Error importando módulo ahrefs_dr: {e}")

from .ai_humanizer import ai_humanizer_bp

print("Finalizada inicialización de rutas de la API") 