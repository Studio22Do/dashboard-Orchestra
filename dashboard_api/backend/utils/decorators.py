import logging
import functools
import traceback
from flask import jsonify, current_app
from requests.exceptions import HTTPError

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
        except HTTPError as http_err:
            status_code = getattr(http_err.response, 'status_code', 500)
            try:
                error_json = http_err.response.json()
                error_message = error_json.get('message') or error_json.get('error') or str(http_err)
            except Exception:
                error_message = str(http_err)
            logger.error(f"Error HTTP externo: {error_message} (status {status_code})")
            if status_code == 429:
                return jsonify({'error': 'Has alcanzado el límite de peticiones de la API externa. Intenta más tarde.'}), 429
            return jsonify({'error': error_message}), status_code
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