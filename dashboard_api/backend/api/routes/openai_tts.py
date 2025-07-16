from flask import Blueprint, request, jsonify, current_app, send_file
import requests
import io
import os
import logging
from flask_jwt_extended import jwt_required

logger = logging.getLogger(__name__)

openai_tts_bp = Blueprint('openai_tts', __name__)

@openai_tts_bp.route('/speech', methods=['POST'])
@jwt_required()
def text_to_speech():
    """Endpoint para convertir texto a voz usando OpenAI TTS"""
    try:
        data = request.json
        text = data.get('input')
        voice = data.get('voice', 'alloy')
        model = data.get('model', 'tts-1')
        instructions = data.get('instructions', 'Speak in a natural tone.')
        output_format = data.get('format', 'mp3')

        logger.debug(f"Datos recibidos: {data}")

        if not text:
            return jsonify({'error': 'El texto es requerido'}), 400

        # Validar longitud del texto (máximo 4096 caracteres para TTS-1)
        if len(text) > 4096:
            return jsonify({'error': 'El texto excede el límite de 4096 caracteres'}), 400

        url = "https://open-ai-text-to-speech1.p.rapidapi.com/"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": os.environ.get('RAPIDAPI_KEY', ''),
            "X-RapidAPI-Host": "open-ai-text-to-speech1.p.rapidapi.com"
        }
        
        payload = {
            "model": model,
            "input": text,
            "voice": voice,
            "instructions": instructions,
            "format": output_format
        }

        logger.debug(f"Enviando solicitud a: {url}")
        logger.debug(f"Payload: {payload}")

        # Hacer la petición a la API
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        logger.debug(f"Respuesta recibida, tamaño: {len(response.content)} bytes")

        # Crear un BytesIO con el contenido de audio
        audio_data = io.BytesIO(response.content)
        audio_data.seek(0)

        # Enviar el archivo de audio directamente
        return send_file(
            audio_data,
            mimetype=f'audio/{output_format}',
            as_attachment=True,
            download_name=f'speech.{output_format}'
        )

    except requests.exceptions.HTTPError as errh:
        logger.error(f"Error HTTP en OpenAI TTS: {str(errh)}")
        return jsonify({'error': str(errh), 'details': response.text if 'response' in locals() else 'No response'}), response.status_code if 'response' in locals() else 500
    except requests.exceptions.RequestException as err:
        logger.error(f"Error de conexión en OpenAI TTS: {str(err)}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502
    except Exception as err:
        logger.error(f"Error inesperado en OpenAI TTS: {str(err)}")
        return jsonify({'error': 'Error interno del servidor', 'details': str(err)}), 500

@openai_tts_bp.route('/test', methods=['POST'])
@jwt_required()
def test_tts():
    """Endpoint de prueba para verificar la funcionalidad"""
    try:
        data = request.json
        text = data.get('text', 'Hola, este es un texto de prueba para verificar la funcionalidad de OpenAI TTS.')
        
        logger.info("Endpoint de prueba de OpenAI TTS ejecutado")
        
        # Simular una respuesta exitosa
        return jsonify({
            'message': 'Endpoint de prueba funcionando correctamente',
            'text': text,
            'status': 'success'
        }), 200
        
    except Exception as e:
        logger.error(f"Error en endpoint de prueba de OpenAI TTS: {str(e)}")
        return jsonify({
            'error': 'Error en el endpoint de prueba',
            'details': str(e)
        }), 500 