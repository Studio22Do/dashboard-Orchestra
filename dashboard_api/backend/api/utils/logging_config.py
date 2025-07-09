import logging
import os

def setup_logging():
    """Configura el logging para la aplicación"""
    # Crear directorio de logs si no existe
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs')
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Configurar el logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),  # Salida a consola
            logging.FileHandler(os.path.join(log_dir, 'app.log'))  # Salida a archivo
        ]
    )
    
    # Configurar loggers específicos
    loggers = [
        'api',
        'api.routes',
        'api.models',
        'api.utils',
        'werkzeug'
    ]
    
    for logger_name in loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.INFO) 