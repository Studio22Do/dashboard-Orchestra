from flask import Blueprint, request, jsonify, current_app
import requests

pagespeed_bp = Blueprint('pagespeed_insights', __name__)

@pagespeed_bp.route('', methods=['OPTIONS'])
@pagespeed_bp.route('/', methods=['OPTIONS'])
def handle_options():
    """Manejar peticiones OPTIONS para CORS"""
    return '', 200

@pagespeed_bp.route('/run', methods=['GET'])
def run_pagespeed():
    url_param = request.args.get('url')

    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400

    # Asegurar que la URL tenga protocol://
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param

    api_url = "https://website-speed-test.p.rapidapi.com/speed-check.php"
    
    params = {
        "url": url_param
    }

    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "website-speed-test.p.rapidapi.com"
    }

    current_app.logger.info(f"[WebsiteSpeedTest] Analizando URL: {url_param}")
    current_app.logger.debug(f"[WebsiteSpeedTest] API URL: {api_url}")
    current_app.logger.debug(f"[WebsiteSpeedTest] Params: {params}")

    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=60)
        current_app.logger.info(f"[WebsiteSpeedTest] Status: {response.status_code}")
        current_app.logger.debug(f"[WebsiteSpeedTest] Response: {response.text}")
        
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        current_app.logger.error(f"[WebsiteSpeedTest] HTTP Error: {errh}")
        current_app.logger.error(f"[WebsiteSpeedTest] Response: {response.text}")
        return jsonify({
            'error': 'Error en la respuesta del análisis de velocidad', 
            'details': response.text
        }), response.status_code

    except requests.exceptions.Timeout:
        current_app.logger.error("[WebsiteSpeedTest] Timeout Error")
        return jsonify({
            'error': 'El análisis está tomando más tiempo de lo esperado. Por favor, intente nuevamente.',
            'details': 'Timeout después de 60 segundos'
        }), 504

    except requests.exceptions.RequestException as err:
        current_app.logger.error(f"[WebsiteSpeedTest] Request Error: {err}")
        return jsonify({
            'error': 'Error de conexión con la API de análisis de velocidad', 
            'details': str(err)
        }), 502 