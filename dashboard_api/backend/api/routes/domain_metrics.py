from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
from api.utils.decorators import credits_required

domain_metrics_bp = Blueprint('domain_metrics', __name__)

@domain_metrics_bp.route('', methods=['OPTIONS'])
@domain_metrics_bp.route('/', methods=['OPTIONS'])
def handle_options():
    return '', 200

@domain_metrics_bp.route('', methods=['POST'])
@domain_metrics_bp.route('/', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def domain_metrics():
    data = request.json
    domain = data.get('domain')
    if not domain:
        return jsonify({'error': 'El campo "domain" es obligatorio.'}), 400
    # Limpiar el dominio (quitar http(s):// y /)
    domain = domain.replace('https://', '').replace('http://', '').split('/')[0]
    url = f"https://domain-metrics-check.p.rapidapi.com/domain-metrics/{domain}/"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "domain-metrics-check.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        print("Domain Metrics API response (backend):", response.text)
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 