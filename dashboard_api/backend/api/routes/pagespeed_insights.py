from flask import Blueprint, request, jsonify, current_app
import requests

pagespeed_bp = Blueprint('pagespeed_insights', __name__)

@pagespeed_bp.route('/run', methods=['POST'])
def run_pagespeed():
    data = request.json
    url_param = data.get('url')
    category = data.get('category', None)
    strategy = data.get('strategy', None)
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400

    # Asegurar que la URL tenga https://
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param

    api_url = "https://pagespeed-insights.p.rapidapi.com/run_pagespeed"
    params = {"url": url_param}
    if category:
        params["category"] = category
    if strategy:
        params["strategy"] = strategy
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "pagespeed-insights.p.rapidapi.com"
    }
    print("[PageSpeed] Llamando a RapidAPI con:")
    print(f"URL: {api_url}")
    print(f"Params: {params}")
    print(f"Headers: {headers}")
    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[PageSpeed] Status: {response.status_code}")
        print(f"[PageSpeed] Response: {response.text}")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        print(f"[PageSpeed] HTTP Error: {errh}")
        print(f"[PageSpeed] Response: {response.text}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[PageSpeed] Request Error: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 