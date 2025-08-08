from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
import os
from api.utils.decorators import credits_required

# Crear blueprint
similarweb_bp = Blueprint('similarweb', __name__)

@similarweb_bp.route('/insights', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def get_insights():
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

@similarweb_bp.route('/website-details', methods=['OPTIONS'])
def website_details_options():
    return '', 200

@similarweb_bp.route('/website-details', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_website_details():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({'error': 'El campo "domain" es obligatorio.'}), 400

    url = "https://similarweb-insights.p.rapidapi.com/website-details"
    params = {"domain": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "similarweb-insights.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=20)
        response.raise_for_status()
        # Manejar caso de HTML devuelto por error/protección
        if 'text/html' in response.headers.get('content-type', ''):
            return jsonify({'error': 'La API devolvió HTML (posible bloqueo o parámetros inválidos).', 'details': response.text[:200]}), 502
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 