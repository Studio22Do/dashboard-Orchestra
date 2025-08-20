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

@speech_to_text_bp.route('/whisper-url', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
@handle_api_errors
def whisper_from_url():
    """Transcribe audio desde URL usando la API específica de Whisper from URL"""
    data = request.get_json()
    if not data or 'audio_url' not in data:
        return jsonify({'error': 'Se requiere audio_url'}), 400
    
    audio_url = data['audio_url']
    language = data.get('language', 'auto')
    model = data.get('model', 'whisper-1')
    
    # Validar que la URL sea un archivo de audio directo
    audio_extensions = ['.mp3', '.wav', '.m4a', '.mpga', '.aac', '.ogg', '.flac', '.wma']
    
    # Detectar URLs de plataformas que NO son archivos directos
    platform_domains = [
        'spotify.com', 'youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 
        'facebook.com', 'twitter.com', 'vimeo.com', 'linkedin.com', 'soundcloud.com',
        'apple.co', 'music.apple.com', 'deezer.com', 'tidal.com', 'amazon.com'
    ]
    
    # Verificar si es una URL de plataforma
    from urllib.parse import urlparse
    parsed_url = urlparse(audio_url)
    domain = parsed_url.netloc.lower()
    
    is_platform_url = any(platform in domain for platform in platform_domains)
    
    if is_platform_url:
        return jsonify({
            'error': 'No se aceptan URLs de plataformas (Spotify, YouTube, TikTok, etc.). Solo URLs directas de archivos de audio. Para plataformas, usa "Speech to Text AI".'
        }), 400
    
    # Verificar extensión de archivo de audio
    is_audio_file = any(audio_url.lower().endswith(ext) for ext in audio_extensions)
    
    if not is_audio_file:
        return jsonify({
            'error': 'Solo se aceptan URLs de archivos de audio directos (MP3, WAV, M4A, MPGA, AAC, OGG, FLAC, WMA). Para YouTube y otras plataformas, usa "Speech to Text AI".'
        }), 400
    
    try:
        # Usar la API específica de Whisper from URL (configuración EXACTA de RapidAPI)
        url = "https://whisper-from-url.p.rapidapi.com/"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "whisper-from-url.p.rapidapi.com",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        payload = {
            'url': audio_url,
            'language': language if language != 'auto' else None,
            'model': model
        }
        
        # Filtrar valores None del payload
        payload = {k: v for k, v in payload.items() if v is not None}
        
        response = requests.post(url, data=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Whisper from URL: {str(e)}")
        return jsonify({'error': 'Error al transcribir el audio'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

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