import logging
from flask import Blueprint
from .instagram import instagram_bp
from .instagram_realtime import instagram_blueprint as instagram_realtime_bp
import sys
import os

# Añadir el directorio raíz al path de Python para importar correctamente
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.routes.auth import auth_bp
from api.routes.google_trends import google_trends_bp
from api.routes.google_paid_search import google_paid_search_bp
from api.routes.scraptik import scraptik_bp

logger = logging.getLogger(__name__)

def register_blueprints(app):
    """Registra todos los blueprints en la aplicación."""
    print("\n=== REGISTRANDO BLUEPRINTS (desde blueprints/__init__.py) ===")
    
    print("Registrando blueprint: instagram_bp en /api/instagram")
    app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
    
    print("Registrando blueprint: instagram_realtime_bp en /api/instagram-realtime")
    app.register_blueprint(instagram_realtime_bp, url_prefix='/api/instagram-realtime')
    
    # Registrar blueprint de autenticación
    print("Registrando blueprint: auth_bp en /api/auth")
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Registrar blueprint de Google Trends
    print("Registrando blueprint: google_trends_bp en /api/trends")
    app.register_blueprint(google_trends_bp, url_prefix='/api/trends')
    
    # Registrar blueprint de Google Paid Search
    print("Registrando blueprint: google_paid_search_bp en /api/paid-search")
    app.register_blueprint(google_paid_search_bp, url_prefix='/api/paid-search')
    
    # Registrar blueprint de TikTok
    print("Registrando blueprint: scraptik_bp en /api/tiktok")
    app.register_blueprint(scraptik_bp, url_prefix='/api/tiktok')
    
    # Agregar más blueprints aquí
    print("=== FIN DE REGISTRO DE BLUEPRINTS (desde blueprints/__init__.py) ===\n")
    
    return app 