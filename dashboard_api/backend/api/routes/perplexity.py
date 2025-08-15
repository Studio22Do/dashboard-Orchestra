import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

perplexity_bp = Blueprint('perplexity', __name__)

def get_headers():
    """Obtiene los headers necesarios para la API de Perplexity"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "perplexity2.p.rapidapi.com",
        "Content-Type": "application/json"
    }

@perplexity_bp.route('/search', methods=['POST'])
@jwt_required()
@credits_required(amount=3)
def search_perplexity():
    """Realiza búsquedas inteligentes usando Perplexity API"""
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'Se requiere el parámetro content en el body'}), 400
        
        content = data['content']
        if not content.strip():
            return jsonify({'error': 'El contenido de la búsqueda no puede estar vacío'}), 400
        
        # Llamar a la API de Perplexity
        url = "https://perplexity2.p.rapidapi.com/"
        headers = get_headers()
        payload = {
            "content": content
        }
        
        logger.info(f"Búsqueda Perplexity: {content}")
        
        response = requests.post(url, json=payload, headers=headers)
        
        # Perplexity siempre responde con 200, pero hay que verificar el campo 'success'
        result = response.json()
        
        if not result.get('success', True):
            error_info = result.get('error', {})
            error_message = error_info.get('message', 'Error desconocido en Perplexity API')
            logger.error(f"Error en Perplexity API: {error_message}")
            return jsonify({'error': f'Error en Perplexity: {error_message}'}), 500
        
        logger.info(f"Búsqueda exitosa en Perplexity para: {content}")
        logger.info(f"Respuesta de Perplexity: {result}")
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error de conexión con Perplexity API: {str(e)}")
        return jsonify({'error': 'Error de conexión con Perplexity API'}), 500
    except Exception as e:
        logger.error(f"Error inesperado en Perplexity: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Handlers para CORS preflight
@perplexity_bp.route('', methods=['OPTIONS'])
@perplexity_bp.route('/', methods=['OPTIONS'])
def handle_preflight():
    """Maneja las peticiones preflight de CORS"""
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response
