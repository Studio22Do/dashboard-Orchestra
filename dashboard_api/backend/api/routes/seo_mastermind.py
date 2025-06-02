from flask import Blueprint, request, jsonify, current_app
import requests

seo_mastermind_bp = Blueprint('seo_mastermind', __name__)

@seo_mastermind_bp.route('/', methods=['POST'])
def generate_seo():
    data = request.json
    topic = data.get('topic')
    
    if not topic:
        return jsonify({'error': 'El campo "topic" es obligatorio'}), 400

    api_url = "https://seo-mastermind-ai-keyword-meta-title-generator.p.rapidapi.com/seo"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "seo-mastermind-ai-keyword-meta-title-generator.p.rapidapi.com",
        "Content-Type": "application/json"
    }
    payload = {"topic": topic}

    try:
        print(f"[SEOMastermind] Generando SEO para topic: {topic}")
        response = requests.post(api_url, json=payload, headers=headers)
        print(f"[SEOMastermind] Status: {response.status_code}")
        print(f"[SEOMastermind] Response: {response.text}")
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API externa',
                'details': response.text
            }), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[SEOMastermind] Error: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con el servicio de SEO',
            'details': str(e)
        }), 500 