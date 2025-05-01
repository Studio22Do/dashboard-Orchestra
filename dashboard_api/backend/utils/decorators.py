import logging
import functools
import traceback
from flask import jsonify, current_app

logger = logging.getLogger(__name__)

def handle_api_errors(f):
    """
    Decorador para manejar errores en las rutas de API.
    Captura excepciones y devuelve respuestas JSON apropiadas.
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error no controlado: {str(e)}")
            logger.debug(traceback.format_exc())
            
            if current_app.config.get('DEBUG', False):
                error_response = {
                    'error': str(e),
                    'type': e.__class__.__name__,
                    'traceback': traceback.format_exc()
                }
            else:
                error_response = {
                    'error': 'Ha ocurrido un error interno',
                    'type': 'ServerError'
                }
            
            return jsonify(error_response), 500
    
    return decorated_function 