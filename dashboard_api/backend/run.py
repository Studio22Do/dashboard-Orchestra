import os
from app import app
import sys
import logging

logger = logging.getLogger(__name__)

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