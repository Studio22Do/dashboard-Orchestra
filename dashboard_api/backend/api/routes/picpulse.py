from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
import logging
import re
import json
from api.utils.decorators import credits_required

picpulse_bp = Blueprint('picpulse', __name__)
logger = logging.getLogger(__name__)

def sanitize_filename(filename):
    """Sanitiza el nombre del archivo para asegurar compatibilidad con la API"""
    # Obtener la extensión
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    # Retornar un nombre seguro
    return f"image.{ext}"

@picpulse_bp.route('/analyze', methods=['POST'])
@jwt_required()
@credits_required(amount=2)  # PicPulse cuesta 2 puntos
def analyze_image():
    """Endpoint para análisis básico de imagen con PicPulse"""
    try:
        logger.info("[PICPULSE] Request files: %s", request.files)
        logger.info("[PICPULSE] Request form: %s", request.form)
        
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            logger.error("[PICPULSE] No se encontró archivo 'image' en request.files")
            return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
            
        image_file = request.files['image']
        logger.info("[PICPULSE] Image file: %s", image_file.filename)
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            logger.error("[PICPULSE] Nombre de archivo vacío")
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
            
        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            logger.error("[PICPULSE] Tipo de archivo no permitido: %s", image_file.filename)
            return jsonify({'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG'}), 400
        
        # Verificar el tamaño del archivo (máximo 2MB)
        image_file.seek(0, 2)  # Ir al final del archivo
        file_size = image_file.tell()  # Obtener el tamaño
        image_file.seek(0)  # Volver al inicio
        
        max_size = 2 * 1024 * 1024  # 2MB en bytes
        if file_size > max_size:
            logger.error("[PICPULSE] Archivo demasiado grande: %s bytes", file_size)
            return jsonify({
                'error': 'Archivo demasiado grande. Máximo 2MB permitido.',
                'file_size': file_size,
                'max_size': max_size
            }), 400
        
        logger.info("[PICPULSE] Tamaño del archivo: %s bytes", file_size)
        
        # Obtener parámetros con valores por defecto
        gender = request.form.get('gender', 'Male')
        age_group = request.form.get('age_group', '25-34')
        logger.info("[PICPULSE] Gender: %s, Age Group: %s", gender, age_group)
        
        url = "https://picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com/analyze_image/"
        
        querystring = {
            "gender": gender,
            "age_group": age_group
        }
        
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_PICPULSE_HOST']
        }
        
        # Preparar archivo para envío
        image_file.seek(0)
        
        # Usar el manejo nativo de requests para multipart/form-data
        files = {
            'image': ('image.png', image_file, 'image/png')
        }
        
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_PICPULSE_HOST']
        }
        
        logger.info("[PICPULSE] Enviando solicitud a RapidAPI")
        logger.info(f"[PICPULSE] Files: {files}")
        
        response = requests.post(
            url,
            files=files,
            headers=headers,
            params=querystring
        )
        
        if response.status_code != 200:
            logger.error("[PICPULSE] Error en RapidAPI: %s", response.text)
            return jsonify({
                'error': 'Error en la API de PicPulse',
                'details': response.text
            }), response.status_code
            
        logger.info("[PICPULSE] Respuesta exitosa: %s", response.text)
        return jsonify(response.json()), 200
        
    except requests.exceptions.RequestException as err:
        logger.error("[PICPULSE] Error de conexión: %s", str(err))
        return jsonify({
            'error': 'Error de conexión con la API externa',
            'details': str(err)
        }), 502
    except Exception as e:
        logger.error("[PICPULSE] Error inesperado: %s", str(e))
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@picpulse_bp.route('/analyze-detailed', methods=['POST'])
@jwt_required()
@credits_required(amount=2)  # PicPulse detailed cuesta 2 puntos
def analyze_image_detailed():
    """Endpoint para análisis detallado de imagen con PicPulse"""
    try:
        logger.info("="*50)
        logger.info("[PICPULSE] Iniciando nuevo análisis de imagen")
        logger.info("[PICPULSE] Request files: %s", request.files)
        logger.info("[PICPULSE] Request form: %s", request.form)
        
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            logger.error("[PICPULSE] No se encontró archivo 'image' en request.files")
            return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
            
        image_file = request.files['image']
        logger.info("[PICPULSE] Nombre del archivo: %s", image_file.filename)
        logger.info("[PICPULSE] Tipo MIME: %s", image_file.content_type)
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            logger.error("[PICPULSE] Nombre de archivo vacío")
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
            
        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            logger.error("[PICPULSE] Tipo de archivo no permitido: %s", image_file.filename)
            return jsonify({'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG'}), 400
        
        # Verificar el tamaño del archivo (máximo 2MB)
        image_file.seek(0, 2)  # Ir al final del archivo
        file_size = image_file.tell()  # Obtener el tamaño
        image_file.seek(0)  # Volver al inicio
        
        max_size = 2 * 1024 * 1024  # 2MB en bytes
        if file_size > max_size:
            logger.error("[PICPULSE] Archivo demasiado grande: %s bytes", file_size)
            return jsonify({
                'error': 'Archivo demasiado grande. Máximo 2MB permitido.',
                'file_size': file_size,
                'max_size': max_size
            }), 400
        
        logger.info("[PICPULSE] Tamaño del archivo: %s bytes", file_size)
        
        gender = request.form.get('gender', 'Male')
        age_group = request.form.get('age_group', '25-34')
        logger.info("[PICPULSE] Parámetros - Gender: %s, Age Group: %s", gender, age_group)
        
        url = "https://picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com/analyze_image_detailed/"
        
        querystring = {
            "gender": gender,
            "age_group": age_group
        }

        # Leer el contenido del archivo
        image_file.seek(0)
        image_content = image_file.read()
        logger.info("[PICPULSE] Tamaño de la imagen: %d bytes", len(image_content))

        # Usar un nombre de archivo seguro
        safe_filename = sanitize_filename(image_file.filename)
        files = {
            'image': (safe_filename, image_content, 'image/png')
        }
        
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_PICPULSE_HOST']
        }

        logger.info("[PICPULSE] Configuración de la petición:")
        logger.info("  - URL: %s", url)
        logger.info("  - QueryString: %s", querystring)
        logger.info("  - Nombre archivo seguro: %s", safe_filename)
        
        logger.info("[PICPULSE] Enviando solicitud a RapidAPI...")
        response = requests.post(
            url,
            files=files,
            headers=headers,
            params=querystring
        )
        
        if response.status_code != 200:
            logger.error("[PICPULSE] Error en RapidAPI:")
            logger.error("  - Status Code: %d", response.status_code)
            logger.error("  - Response: %s", response.text)
            try:
                error_json = response.json()
                logger.error("  - Error JSON: %s", json.dumps(error_json, indent=2))
            except:
                logger.error("  - No se pudo parsear la respuesta como JSON")
            return jsonify({
                'error': 'Error en la API de PicPulse',
                'details': response.text
            }), response.status_code
            
        logger.info("[PICPULSE] Respuesta exitosa:")
        logger.info("  - Status Code: %d", response.status_code)
        logger.info("  - Response: %s", response.text)
        try:
            result = response.json()
            logger.info("  - Tiempo de atención: %s ms", result.get('attention_time_ms'))
            logger.info("  - Probabilidad de gustar: %s%%", round(result.get('probability_of_liking', 0) * 100, 2))
            logger.info("  - Puntuación combinada: %s", result.get('combined_score'))
        except:
            logger.error("  - No se pudo parsear la respuesta como JSON")
        
        logger.info("="*50)
        return jsonify(response.json()), 200
        
    except requests.exceptions.RequestException as err:
        logger.error("[PICPULSE] Error de conexión: %s", str(err))
        return jsonify({
            'error': 'Error de conexión con la API externa',
            'details': str(err)
        }), 502
    except Exception as e:
        logger.error("[PICPULSE] Error inesperado: %s", str(e))
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500 