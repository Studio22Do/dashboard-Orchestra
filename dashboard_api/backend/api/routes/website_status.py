from flask import Blueprint, request, jsonify, current_app
import requests

website_status_bp = Blueprint('website_status', __name__)

@website_status_bp.route('/', methods=['POST'])
def check_website_status():
    data = request.json
    domain = data.get('domain')
    if not domain:
        return jsonify({'error': 'El campo "domain" es obligatorio.'}), 400

    api_url = "https://check-if-website-is-up-or-down.p.rapidapi.com/"
    params = {"domain": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "check-if-website-is-up-or-down.p.rapidapi.com"
    }
    print(f"[WebsiteStatus] Llamando a RapidAPI con: {params}")
    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[WebsiteStatus] Status: {response.status_code}")
        print(f"[WebsiteStatus] Response: {response.text}")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        print(f"[WebsiteStatus] HTTP Error: {errh}")
        print(f"[WebsiteStatus] Response: {response.text}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[WebsiteStatus] Request Error: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 