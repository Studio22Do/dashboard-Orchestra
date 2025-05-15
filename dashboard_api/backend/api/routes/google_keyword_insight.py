from flask import Blueprint, request, jsonify, current_app
import requests

keyword_insight_bp = Blueprint('keyword_insight', __name__)

ENDPOINTS = {
    'keysuggest': 'keysuggest/',
    'urlkeysuggest': 'urlkeysuggest/',
    'globalkey': 'globalkey/',
    'globalurl': 'globalurl/',
    'topkeys': 'topkeys/',
}

@keyword_insight_bp.route('/', methods=['POST'])
def keyword_insight():
    data = request.json
    endpoint = data.get('endpoint')
    if endpoint not in ENDPOINTS:
        return jsonify({'error': 'Tipo de consulta (endpoint) no soportado.'}), 400

    params = {}
    # Mapear parámetros comunes
    for key in ['keyword', 'url', 'location', 'lang', 'mode', 'min_search_vol', 'num']:
        if key in data and data[key] is not None:
            params[key] = data[key]

    url = f"https://google-keyword-insight1.p.rapidapi.com/{ENDPOINTS[endpoint]}"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "google-keyword-insight1.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@keyword_insight_bp.route('/locations', methods=['GET'])
def get_locations():
    url = "https://google-keyword-insight1.p.rapidapi.com/locations/"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "google-keyword-insight1.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@keyword_insight_bp.route('/languages', methods=['GET'])
def get_languages():
    url = "https://google-keyword-insight1.p.rapidapi.com/languages/"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "google-keyword-insight1.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 