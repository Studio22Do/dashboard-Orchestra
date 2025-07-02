from flask import Blueprint, request, jsonify, current_app, send_file
import requests
import io
from flask_jwt_extended import jwt_required

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

        if not text:
            return jsonify({'error': 'El texto es requerido'}), 400

        url = "https://open-ai-text-to-speech1.p.rapidapi.com/"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": current_app.config['RAPIDAPI_KEY'],
            "X-RapidAPI-Host": "open-ai-text-to-speech1.p.rapidapi.com"
        }
        
        payload = {
            "model": model,
            "input": text,
            "voice": voice,
            "instructions": instructions,
            "format": output_format
        }

        # Hacer la petición a la API
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

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
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500 