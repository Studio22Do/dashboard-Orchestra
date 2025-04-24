from flask import jsonify

class APIError(Exception):
    """Base para errores personalizados de la API"""
    def __init__(self, message, status_code=400, payload=None):
        self.message = message
        self.status_code = status_code
        self.payload = payload
        super().__init__(self.message)

    def to_dict(self):
        result = dict(self.payload or ())
        result['error'] = self.message
        result['status_code'] = self.status_code
        return result

class ResourceNotFoundError(APIError):
    """Error cuando un recurso no se encuentra"""
    def __init__(self, message="Recurso no encontrado", payload=None):
        super().__init__(message, status_code=404, payload=payload)

class AuthenticationError(APIError):
    """Error de autenticación"""
    def __init__(self, message="Error de autenticación", payload=None):
        super().__init__(message, status_code=401, payload=payload)

class ValidationError(APIError):
    """Error de validación de datos"""
    def __init__(self, message="Error de validación", payload=None):
        super().__init__(message, status_code=400, payload=payload)

class ExternalApiError(APIError):
    """Error al comunicarse con una API externa"""
    def __init__(self, message="Error en API externa", payload=None):
        super().__init__(message, status_code=502, payload=payload)

def register_error_handlers(app):
    """Registra los manejadores de errores en la aplicación Flask"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            'error': 'Ruta no encontrada',
            'status_code': 404
        }), 404
    
    @app.errorhandler(500)
    def handle_server_error(error):
        return jsonify({
            'error': 'Error interno del servidor',
            'status_code': 500
        }), 500 