from flask import Blueprint, request, jsonify, current_app
import requests

seo_mastermind_bp = Blueprint('seo_mastermind', __name__)

@seo_mastermind_bp.route('', methods=['OPTIONS'])
@seo_mastermind_bp.route('/', methods=['OPTIONS'])
def handle_options():
    """Manejar peticiones OPTIONS para CORS"""
    return '', 200

@seo_mastermind_bp.route('', methods=['POST'])
@seo_mastermind_bp.route('/', methods=['POST'])
def generate_seo():
    """Generar análisis SEO para una keyword"""
    data = request.json
    keyword = data.get('keyword')
    
    if not keyword:
        return jsonify({'error': 'El campo "keyword" es obligatorio'}), 400

    api_url = "https://seo-tools-ai-based-keyword-research.p.rapidapi.com/"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "seo-tools-ai-based-keyword-research.p.rapidapi.com"
    }
    params = {"keyword": keyword}

    try:
        print(f"[SEOMastermind] Analizando keyword: {keyword}")
        response = requests.get(api_url, headers=headers, params=params)
        print(f"[SEOMastermind] Status: {response.status_code}")
        print(f"[SEOMastermind] Response: {response.text}")
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API de keywords',
                'details': response.text
            }), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[SEOMastermind] Error: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con el servicio de keywords',
            'details': str(e)
        }), 500 