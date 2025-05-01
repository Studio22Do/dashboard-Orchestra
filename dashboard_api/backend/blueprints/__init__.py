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

logger = logging.getLogger(__name__)

def register_blueprints(app):
    """Registra todos los blueprints en la aplicación."""
    app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
    app.register_blueprint(instagram_realtime_bp, url_prefix='/api/instagram-realtime')
    
    # Registrar blueprint de autenticación
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Registrar blueprint de Google Trends
    app.register_blueprint(google_trends_bp, url_prefix='/api/trends')
    
    # Agregar más blueprints aquí
    
    return app 