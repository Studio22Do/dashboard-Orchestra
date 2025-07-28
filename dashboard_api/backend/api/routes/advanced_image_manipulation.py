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
    'pdf_to_images': 'pdf_to_images',
    'convert': 'convert',
}

@advanced_image_bp.route('', methods=['POST'])
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
    
    # Agregar timestamp para evitar caché
    import time
    querystring['_t'] = str(int(time.time()))

    if operation == 'convert':
        convert_to = params.get('convert_to')
        if not convert_to:
            return jsonify({'error': 'El formato de conversión es obligatorio'}), 400
        querystring['convert_to'] = convert_to
    else:
        # Solo incluir parámetros específicos para cada operación
        if operation == 'thumbnail':
            if 'width' in params:
                querystring['width'] = params['width']
            if 'height' in params:
                querystring['height'] = params['height']
        elif operation == 'resize':
            if 'width' in params:
                querystring['width'] = params['width']
            if 'height' in params:
                querystring['height'] = params['height']
        elif operation == 'blur':
            if 'blur' in params:
                querystring['blur'] = params['blur']
        elif operation == 'crop':
            if 'left' in params:
                querystring['left'] = params['left']
            if 'upper' in params:
                querystring['upper'] = params['upper']
            if 'right' in params:
                querystring['right'] = params['right']
            if 'lower' in params:
                querystring['lower'] = params['lower']
        elif operation == 'rotate':
            if 'angle' in params:
                querystring['angle'] = params['angle']
        elif operation == 'transpose':
            if 'method' in params:
                querystring['method'] = params['method']

    headers = {
        "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
        "x-rapidapi-host": "advanced-image-manipulation-api.p.rapidapi.com"
    }

    try:
        print(f"[IMAGE MANIPULATION] URL: {url}")
        print(f"[IMAGE MANIPULATION] Source URL: {source_url}")
        print(f"[IMAGE MANIPULATION] Params: {querystring}")
        response = requests.get(url, headers=headers, params=querystring, timeout=20)
        response.raise_for_status()
        data = response.json()
        print(f"[IMAGE MANIPULATION] Response: {data}")
        # La API devuelve {"urls": ["url1", ...]} para la imagen procesada
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 