"""Módulo principal de la aplicación Flask"""
import os
import logging
from flask import Flask, request
from flask_cors import CORS
from api import create_app, db
from api.models.app import App
from api.models.user import User
from api.utils.database import init_db
from api.utils.logging_config import setup_logging
from config import get_config

# Configurar logging
setup_logging()
logger = logging.getLogger(__name__)

# Crear y configurar la aplicación
app = create_app(get_config())

# Configurar CORS con opciones específicas
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://192.168.13.109:3000",
            "http://0.0.0.0:3000"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"]
    }
})

# Ruta estática para servir banners
@app.route('/assets/images/apps/banners/<filename>')
def serve_banner(filename):
    """Sirve archivos de banners desde el frontend"""
    try:
        # Construir ruta al archivo en el frontend
        banner_path = os.path.join(
            os.path.dirname(__file__), 
            '..', 'frontend', 'src', 'assets', 'images', 'apps', 'banners', 
            filename
        )
        
        if os.path.exists(banner_path):
            from flask import send_file
            return send_file(banner_path, mimetype='image/png')
        else:
            return "Banner no encontrado", 404
            
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
