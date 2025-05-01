import logging
import os
import sys
from logging.handlers import RotatingFileHandler

def configure_logging(app):
    """Configura el sistema de logging para la aplicación."""
    log_level = getattr(logging, app.config.get('LOG_LEVEL', 'INFO'))
    
    # Crear directorio de logs si no existe
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    log_file = os.path.join(log_dir, 'app.log')
    
    # Configuración del handler para archivo rotativo
    file_handler = RotatingFileHandler(
        filename=log_file,
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(log_level)
    
    # Configuración del handler para consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s'
    ))
    console_handler.setLevel(log_level)
    
    # Configurar el logger de la aplicación
    app.logger.setLevel(log_level)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    
    # Eliminar handler por defecto si existe
    if app.logger.hasHandlers():
        app.logger.handlers.clear()
    
    # Configurar el logger raíz para las librerías
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    
    # Log inicial
    app.logger.info('Logging configurado con nivel: %s', app.config['LOG_LEVEL']) 