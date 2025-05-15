from flask import Blueprint, request, jsonify, current_app
import requests

ahrefs_dr_bp = Blueprint('ahrefs_dr', __name__)

@ahrefs_dr_bp.route('/authority', methods=['POST'])
def ahrefs_authority():
    data = request.json
    url_param = data.get('url')
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400
    
    # Asegurarnos de que la URL tenga el formato correcto
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/authority"
    params = {
        "url": url_param,
        "mode": data.get('mode', 'subdomains')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    print("Making request to Ahrefs API with:")
    print(f"URL: {url}")
    print(f"Params: {params}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Response text: {response.text}")
        
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Authority API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
        print(f"Response text: {response.text}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"Request Error: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@ahrefs_dr_bp.route('/backlinks', methods=['POST'])
def ahrefs_backlinks():
    data = request.json
    url_param = data.get('url')
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400
    
    # Asegurarnos de que la URL tenga el formato correcto
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/backlinks"
    params = {
        "url": url_param,
        "mode": data.get('mode', 'subdomains')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Backlinks API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@ahrefs_dr_bp.route('/broken-links', methods=['POST'])
def ahrefs_broken_links():
    data = request.json
    url_param = data.get('url')
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400
    
    # Asegurarnos de que la URL tenga el formato correcto
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/broken-links"
    params = {
        "url": url_param,
        "mode": data.get('mode', 'subdomains')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Broken Links API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@ahrefs_dr_bp.route('/traffic', methods=['POST'])
def ahrefs_traffic():
    data = request.json
    url_param = data.get('url')
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400
    
    # Asegurarnos de que la URL tenga el formato correcto
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/traffic"
    params = {
        "url": url_param,
        "mode": data.get('mode', 'subdomains')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Traffic API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@ahrefs_dr_bp.route('/keyword-difficulty', methods=['POST'])
def ahrefs_keyword_difficulty():
    data = request.json
    keyword = data.get('keyword')
    if not keyword:
        return jsonify({'error': 'El campo "keyword" es obligatorio.'}), 400
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/keyword-difficulty"
    params = {
        "keyword": keyword,
        "country": data.get('country', 'us')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Keyword Difficulty API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502

@ahrefs_dr_bp.route('/keyword-suggestions', methods=['POST'])
def ahrefs_keyword_suggestions():
    data = request.json
    keyword = data.get('keyword')
    if not keyword:
        return jsonify({'error': 'El campo "keyword" es obligatorio.'}), 400
    
    url = f"https://{current_app.config['RAPIDAPI_AHREFS_HOST']}/keyword_suggestions"
    params = {
        "keyword": keyword,
        "se": data.get('se', 'google'),
        "country": data.get('country', 'us')
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_AHREFS_HOST']
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        print("Ahrefs Keyword Suggestions API response (backend):", data)
        return jsonify(data), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 