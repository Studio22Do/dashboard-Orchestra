from flask import Blueprint, request, jsonify, current_app
import requests
import logging

logger = logging.getLogger(__name__)
whisper_url_bp = Blueprint('whisper_url', __name__)

@whisper_url_bp.route('/', methods=['POST'])
def whisper_from_url():
    """Transcribe audio desde URL usando Whisper API"""
    data = request.json
    audio_url = data.get('audio_url')
    language = data.get('language', 'auto')
    model = data.get('model', 'whisper-1')

    if not audio_url:
        return jsonify({'error': 'La URL del audio es obligatoria'}), 400

    logger.info(f"Transcribiendo audio desde: {audio_url}")
    
    url = "https://whisper-from-url.p.rapidapi.com/"
    payload = {
        "url": audio_url,
        "language": language if language != 'auto' else '',
        "model": model
    }
    headers = {
        "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
        "x-rapidapi-host": "whisper-from-url.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=payload, headers=headers, timeout=120)
        logger.info(f"Status code: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        logger.info(f"Response content: {response.text[:500]}...")  # Primeros 500 caracteres
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                return jsonify({'error': error_data.get('error', 'Error al transcribir'), 'details': error_data}), response.status_code
            except:
                return jsonify({'error': 'Error al transcribir el audio', 'details': response.text}), response.status_code
        
        result = response.json()
        logger.info(f"JSON response: {result}")
        
        # Formatear la respuesta para el frontend
        # Extraer texto de diferentes posibles ubicaciones en la respuesta
        if 'response' in result and isinstance(result['response'], dict):
            text_content = result['response'].get('text', '')
        else:
            text_content = result.get('text', result.get('transcription', result.get('transcript', '')))
        
        # Verificar si el audio no tiene texto audible
        if not text_content or text_content.strip() in ['.', '...', '']:
            formatted_response = {
                'text': '',
                'message': 'El audio de la URL no contiene texto audible o solo contiene ruidos/música.',
                'metadata': {
                    'duration': result.get('duration', 'N/A'),
                    'confidence': 0,
                    'words': 0,
                    'segments': 0,
                    'language': result.get('response', {}).get('language', language) if 'response' in result else result.get('language', language),
                    'has_audio_content': True,
                    'has_speech_content': False
                },
                'raw_response': result
            }
        else:
            formatted_response = {
                'text': text_content.strip(),
                'metadata': {
                    'duration': result.get('duration', 'N/A'),
                    'confidence': result.get('confidence', 0.95),
                    'words': len(text_content.split()) if text_content else 0,
                    'segments': len(result.get('response', {}).get('segments', [])) if 'response' in result else result.get('segments', 1),
                    'language': result.get('response', {}).get('language', language) if 'response' in result else result.get('language', language),
                    'has_audio_content': True,
                    'has_speech_content': True
                },
                'raw_response': result
            }
        
        logger.info(f"Enviando al frontend: {formatted_response}")
        return jsonify(formatted_response), 200
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Timeout al transcribir - el archivo puede ser muy largo'}), 408
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}", exc_info=True)
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500 