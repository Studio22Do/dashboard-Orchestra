import os
import sys

# Añadir el directorio actual al path de Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
import logging
from flask_cors import CORS

logger = logging.getLogger(__name__)

# Configurar CORS directamente aquí para asegurar que funcione en producción
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://192.168.13.109:3000",
            "http://0.0.0.0:3000",
            "https://m-aestro-i-qfrontendcompleto-esk1.vercel.app",
            "https://m-aestro-i-qfrontendcompleto.vercel.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"]
    }
})

def print_startup_info():
    """Imprime información de inicio de la aplicación"""
    logger.info("===== INICIANDO APLICACIÓN DASHBOARD API =====")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Config DEBUG: {app.config.get('DEBUG', False)}")
    logger.info(f"FLASK_DEBUG: {os.environ.get('FLASK_DEBUG', 'No definido')}")

if __name__ == '__main__':
    print_startup_info()
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Iniciando servidor en: http://0.0.0.0:{port}")
    app.run(
        host='0.0.0.0', 
        port=port, 
        debug=app.config.get('DEBUG', False)
    ) 