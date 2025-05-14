from flask import Blueprint, request, jsonify
import requests
import os

whisper_url_bp = Blueprint('whisper_url', __name__)

@whisper_url_bp.route('/api/whisper-url', methods=['POST'])
def whisper_from_url():
    data = request.json
    audio_url = data.get('audio_url')
    language = data.get('language', 'auto')
    model = data.get('model', 'whisper-1')

    if not audio_url:
        return jsonify({'error': 'La URL del audio es obligatoria'}), 400

    url = "https://whisper-from-url.p.rapidapi.com/transcribe"
    payload = {
        "url": audio_url,
        "language": language if language != 'auto' else '',
        "model": model
    }
    headers = {
        "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
        "x-rapidapi-host": "whisper-from-url.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 