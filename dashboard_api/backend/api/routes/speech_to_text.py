import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required
from utils.decorators import handle_api_errors
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

speech_to_text_bp = Blueprint('speech_to_text', __name__)

def get_headers():
    """Obtiene los headers necesarios para la API de Speech to Text"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "speech-to-text-ai.p.rapidapi.com"
    }

def make_api_request(endpoint, method='GET', params=None, data=None):
    """Función auxiliar para hacer peticiones a la API de Speech to Text"""
    try:
        url = f"https://speech-to-text-ai.p.rapidapi.com/{endpoint}"
        headers = get_headers()
        
        # Siempre usar GET con los parámetros como query string
        response = requests.get(url, headers=headers, params=params)
            
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise

@speech_to_text_bp.route('/transcribe', methods=['GET', 'POST'])
@jwt_required()
@credits_required(amount=1)
@handle_api_errors
def transcribe_audio():
    """Transcribe audio desde una URL"""
    # Obtener parámetros según el método
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'Se requiere una URL de audio/video'}), 400
        url = data['url']
        lang = data.get('language', 'en')
    else:  # GET
        url = request.args.get('url')
        if not url:
            return jsonify({'error': 'Se requiere una URL de audio/video'}), 400
        lang = request.args.get('lang', 'en')
    
    try:
        # Construir los parámetros de la petición
        params = {
            'url': url,
            'lang': lang,
            'task': 'transcribe'
        }
        
        result = make_api_request('transcribe', params=params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error al transcribir el audio'}), 500

@speech_to_text_bp.route('/queue/<task_id>/status', methods=['GET'])
@handle_api_errors
def check_status(task_id):
    """Verifica el estado de una transcripción en cola"""
    try:
        result = make_api_request(f'queue/{task_id}/status', 'GET')
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error verificando estado: {str(e)}")
        return jsonify({'error': 'Error al verificar el estado'}), 500

@speech_to_text_bp.route('/queue/<task_id>/result', methods=['GET'])
@handle_api_errors
def get_result(task_id):
    """Obtiene el resultado de una transcripción en cola"""
    try:
        result = make_api_request(f'queue/{task_id}/result', 'GET')
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error obteniendo resultado: {str(e)}")
        return jsonify({'error': 'Error al obtener el resultado'}), 500 