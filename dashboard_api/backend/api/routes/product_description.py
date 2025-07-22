from flask import Blueprint, request, jsonify, current_app
import requests

product_description_bp = Blueprint('product_description', __name__)

@product_description_bp.route('/generate', methods=['POST'])
def generate_product_description():
    data = request.json
    language = data.get('language', 'English')
    name = data.get('name')
    description = data.get('description')

    if not name or not description:
        return jsonify({'error': 'Faltan campos requeridos: name y description'}), 400

    url = "https://ai-ecommerce-product-description-generator.p.rapidapi.com/generate_product_description"
    params = {
        "language": language,
        "name": name,
        "description": description
    }
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "ai-ecommerce-product-description-generator.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 