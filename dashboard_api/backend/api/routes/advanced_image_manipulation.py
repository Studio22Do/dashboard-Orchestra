from flask import Blueprint, request, jsonify
import requests
import os

advanced_image_bp = Blueprint('advanced_image', __name__)

ENDPOINTS = {
    'resize': 'resize',
    'blur': 'blur',
    'crop': 'crop',
    'rotate': 'rotate',
    'thumbnail': 'thumbnail',
    'transpose': 'transpose',
}

@advanced_image_bp.route('/api/image-manipulation', methods=['POST'])
def image_manipulation():
    data = request.json
    operation = data.get('operation')
    source_url = data.get('source_url')
    params = data.get('params', {})

    if not operation or operation not in ENDPOINTS:
        return jsonify({'error': 'Operación no soportada'}), 400
    if not source_url:
        return jsonify({'error': 'La URL de la imagen es obligatoria'}), 400

    url = f"https://advanced-image-manipulation-api.p.rapidapi.com/{ENDPOINTS[operation]}"
    querystring = {'source_url': source_url}
    querystring.update({k: v for k, v in params.items() if v})

    headers = {
        "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
        "x-rapidapi-host": "advanced-image-manipulation-api.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=20)
        response.raise_for_status()
        data = response.json()
        # La API devuelve {"urls": ["url1", ...]} para la imagen procesada
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 