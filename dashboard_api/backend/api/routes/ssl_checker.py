from flask import Blueprint, request, jsonify, current_app
import requests

ssl_checker_bp = Blueprint('ssl_checker', __name__)

@ssl_checker_bp.route('/', methods=['POST'])
def check_ssl():
    data = request.json
    domain = data.get('domain')
    if not domain:
        return jsonify({'error': 'El campo "domain" es obligatorio.'}), 400

    api_url = "https://ssl-checker2.p.rapidapi.com/"
    params = {"domain": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "ssl-checker2.p.rapidapi.com"
    }
    print(f"[SSLChecker] Llamando a RapidAPI con: {params}")
    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[SSLChecker] Status: {response.status_code}")
        print(f"[SSLChecker] Response: {response.text}")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        print(f"[SSLChecker] HTTP Error: {errh}")
        print(f"[SSLChecker] Response: {response.text}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[SSLChecker] Request Error: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 