from flask import Blueprint, request, jsonify, current_app
import requests
from functools import wraps
from utils.error_handlers import handle_api_error
import logging

# Configurar logging
logger = logging.getLogger(__name__)

# Crear blueprint
image_optimizer_bp = Blueprint('image_optimizer', __name__)

def require_api_key(f):
    """Decorator para verificar la API key de RapidAPI."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = current_app.config.get('RAPIDAPI_KEY')
        if not api_key:
            logger.error("RAPIDAPI_KEY no configurada en el backend")
            return jsonify({
                'error': 'Configuración de API no disponible',
                'details': 'La API key no está configurada en el servidor'
            }), 500
        return f(*args, **kwargs)
    return decorated_function

@image_optimizer_bp.route('/api/image-optimize', methods=['POST'])
@require_api_key
@handle_api_error
def optimize_image():
    """
    Endpoint para optimizar imágenes usando RapidAPI.
    
    Espera un archivo de imagen en el campo 'image' del form-data.
    Retorna la imagen optimizada o un error si algo falla.
    """
    try:
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            return jsonify({
                'error': 'No se proporcionó ninguna imagen',
                'details': 'Se requiere un archivo de imagen en el campo "image"'
            }), 400

        image_file = request.files['image']
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            return jsonify({
                'error': 'Nombre de archivo vacío',
                'details': 'No se seleccionó ningún archivo'
            }), 400

        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({
                'error': 'Tipo de archivo no permitido',
                'details': f'Los tipos de archivo permitidos son: {", ".join(allowed_extensions)}'
            }), 400

        # Preparar los datos para la API de RapidAPI
        files = {'image': (image_file.filename, image_file.stream, image_file.content_type)}
        headers = {
            'X-RapidAPI-Key': current_app.config['RAPIDAPI_KEY'],
            'X-RapidAPI-Host': current_app.config['RAPIDAPI_HOST']
        }

        # Realizar la petición a RapidAPI
        response = requests.post(
            current_app.config['RAPIDAPI_URL'],
            files=files,
            headers=headers
        )

        # Verificar la respuesta de RapidAPI
        if response.status_code != 200:
            logger.error(f"Error en RapidAPI: {response.status_code} - {response.text}")
            return jsonify({
                'error': 'Error en el servicio de optimización',
                'details': 'El servicio de optimización de imágenes no respondió correctamente'
            }), 502

        # Retornar la imagen optimizada
        return response.content, 200, {
            'Content-Type': response.headers.get('Content-Type', 'application/octet-stream'),
            'Content-Disposition': f'attachment; filename=optimized_{image_file.filename}'
        }

    except requests.exceptions.RequestException as e:
        logger.error(f"Error en la petición a RapidAPI: {str(e)}")
        return jsonify({
            'error': 'Error de conexión',
            'details': 'No se pudo conectar con el servicio de optimización'
        }), 503
    except Exception as e:
        logger.error(f"Error inesperado en optimize_image: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': 'Ocurrió un error inesperado al procesar la imagen'
        }), 500 