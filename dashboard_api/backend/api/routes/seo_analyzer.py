from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
import logging
import os
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

seo_analyzer_bp = Blueprint('seo_analyzer', __name__)

@seo_analyzer_bp.route('', methods=['OPTIONS'])
@seo_analyzer_bp.route('/', methods=['OPTIONS'])
def handle_options():
    """Manejar peticiones OPTIONS para CORS"""
    return '', 200

@seo_analyzer_bp.route('/analyze', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def analyze_seo():
    """Analizar SEO de una URL usando la API de SEO Analyzer"""
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'Se requiere una URL para analizar'}), 400

    api_url = current_app.config['RAPIDAPI_WEBSITE_ANALYZER_URL']
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']
    }
    params = {"url": url}

    try:
        response = requests.get(api_url, headers=headers, params=params)
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API de SEO Analyzer',
                'details': response.text
            }), response.status_code

        result = response.json()
        
        if not result.get('success'):
            return jsonify({
                'error': 'La API reportó un error',
                'details': result.get('message', 'Error desconocido')
            }), 400

        data = result['result']
        input_data = data.get('Input', {})
        http_data = data.get('http', {})
        
        # Transformar la respuesta al formato que espera nuestro frontend
        transformed_data = {
            'url': input_data.get('URL'),
            'input_type': input_data.get('Input type'),
            'http_status': http_data.get('status'),
            'using_https': http_data.get('using_https'),
            'content_size': http_data.get('contentSize', {
                'bytes': 0,
                'kb': 0
            }),
            'headers': http_data.get('headers', {}),
            'score': calculate_overall_score(data)
        }
        return jsonify(transformed_data), 200

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Error al conectar con el servicio de SEO Analyzer',
            'details': str(e)
        }), 500

def calculate_overall_score(data):
    """Calcular puntuación general basada en varios factores"""
    score = 100
    
    http_data = data.get('http', {})
    
    # Verificar HTTPS
    if not http_data.get('using_https'):
        score -= 20
    
    # Verificar estado HTTP
    if http_data.get('status') != 200:
        score -= 30
    
    # Verificar tamaño de contenido (penalizar si es mayor a 5MB)
    content_size = http_data.get('contentSize', {})
    if content_size.get('kb', 0) > 5000:
        score -= 10
        
    return max(0, min(100, score)) 