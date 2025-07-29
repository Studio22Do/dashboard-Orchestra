from flask import Blueprint, request, jsonify, current_app
import requests
import logging

picpulse_bp = Blueprint('picpulse', __name__)
logger = logging.getLogger(__name__)

@picpulse_bp.route('/analyze', methods=['POST'])
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
        files = {'image': (image_file.filename, image_file.read(), image_file.content_type)}
        
        logger.info("[PICPULSE] Enviando solicitud a RapidAPI")
        response = requests.post(url, files=files, headers=headers, params=querystring)
        
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
def analyze_image_detailed():
    """Endpoint para análisis detallado de imagen con PicPulse"""
    try:
        logger.info("[PICPULSE DETAILED] Request files: %s", request.files)
        logger.info("[PICPULSE DETAILED] Request form: %s", request.form)
        
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            logger.error("[PICPULSE DETAILED] No se encontró archivo 'image' en request.files")
            return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
            
        image_file = request.files['image']
        logger.info("[PICPULSE DETAILED] Image file: %s", image_file.filename)
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            logger.error("[PICPULSE DETAILED] Nombre de archivo vacío")
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
            
        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            logger.error("[PICPULSE DETAILED] Tipo de archivo no permitido: %s", image_file.filename)
            return jsonify({'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG'}), 400
        
        # Obtener parámetros con valores por defecto
        gender = request.form.get('gender', 'Male')
        age_group = request.form.get('age_group', '25-34')
        logger.info("[PICPULSE DETAILED] Gender: %s, Age Group: %s", gender, age_group)
        
        url = "https://picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com/analyze_image_detailed/"
        
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
        files = {'image': (image_file.filename, image_file.read(), image_file.content_type)}
        
        logger.info("[PICPULSE DETAILED] Enviando solicitud a RapidAPI")
        response = requests.post(url, files=files, headers=headers, params=querystring)
        
        if response.status_code != 200:
            logger.error("[PICPULSE DETAILED] Error en RapidAPI: %s", response.text)
            return jsonify({
                'error': 'Error en la API de PicPulse',
                'details': response.text
            }), response.status_code
            
        logger.info("[PICPULSE DETAILED] Respuesta exitosa: %s", response.text)
        return jsonify(response.json()), 200
        
    except requests.exceptions.RequestException as err:
        logger.error("[PICPULSE DETAILED] Error de conexión: %s", str(err))
        return jsonify({
            'error': 'Error de conexión con la API externa',
            'details': str(err)
        }), 502
    except Exception as e:
        logger.error("[PICPULSE DETAILED] Error inesperado: %s", str(e))
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500 