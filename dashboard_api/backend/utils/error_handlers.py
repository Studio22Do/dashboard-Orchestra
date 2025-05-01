import logging
from flask import jsonify, request

logger = logging.getLogger(__name__)

# Clases de error personalizadas
class AuthenticationError(Exception):
    """Error de autenticación"""
    pass

class ValidationError(Exception):
    """Error de validación"""
    pass

def register_error_handlers(app):
    """Registra manejadores de errores personalizados para la aplicación."""
    
    # Manejo de solicitudes OPTIONS para CORS
    @app.after_request
    def handle_options(response):
        if request.method == 'OPTIONS':
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    @app.errorhandler(400)
    def bad_request(error):
        logger.warning(f"Error 400: {error}")
        return jsonify({
            'error': 'Solicitud incorrecta',
            'message': str(error)
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        logger.info(f"Error 404: {error}")
        return jsonify({
            'error': 'Recurso no encontrado',
            'message': str(error)
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        logger.warning(f"Error 405: {error}")
        return jsonify({
            'error': 'Método no permitido',
            'message': str(error)
        }), 405
    
    @app.errorhandler(500)
    def internal_server_error(error):
        logger.error(f"Error 500: {error}")
        return jsonify({
            'error': 'Error interno del servidor',
            'message': 'Ha ocurrido un error en el servidor'
        }), 500
    
    # Manejo de errores personalizados
    @app.errorhandler(AuthenticationError)
    def handle_authentication_error(error):
        logger.warning(f"Error de autenticación: {str(error)}")
        return jsonify({
            'error': 'Error de autenticación',
            'message': str(error)
        }), 401
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        logger.warning(f"Error de validación: {str(error)}")
        return jsonify({
            'error': 'Error de validación',
            'message': str(error)
        }), 422
    
    return app 