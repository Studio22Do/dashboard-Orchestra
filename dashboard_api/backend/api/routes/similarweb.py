from flask import Blueprint, request, jsonify, current_app
import requests

similarweb_bp = Blueprint('similarweb', __name__)

@similarweb_bp.route('/insights', methods=['POST'])
def get_similarweb_insights():
    data = request.json
    domain = data.get('domain')
    if not domain:
        return jsonify({'error': 'El campo "domain" es obligatorio.'}), 400

    url = "https://similarweb-insights.p.rapidapi.com/all-insights"
    params = {"domain": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "similarweb-insights.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 