from flask import Blueprint, request, jsonify, current_app
import requests
from flask_jwt_extended import jwt_required
from api.utils.decorators import credits_required

text_extract_bp = Blueprint('text_extract', __name__)

@text_extract_bp.route('/extract', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def extract_text():
    data = request.json
    url_to_extract = data.get('url')
    if not url_to_extract:
        return jsonify({'error': 'URL is required'}), 400

    api_url = "https://text-extract7.p.rapidapi.com/"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "text-extract7.p.rapidapi.com"
    }
    params = {"url": url_to_extract}
    response = requests.get(api_url, headers=headers, params=params)
    # Puede devolver texto plano o JSON, intentamos ambos
    try:
        return jsonify(response.json()), response.status_code
    except Exception:
        return response.text, response.status_code 