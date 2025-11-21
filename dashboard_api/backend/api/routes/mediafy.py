import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

mediafy_bp = Blueprint('mediafy', __name__)

def get_headers():
    """Obtiene los headers necesarios para la API de Mediafy"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "mediafy-api.p.rapidapi.com"
    }

@mediafy_bp.route('/profile', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_profile_info():
    """Obtiene información completa de un perfil de Instagram usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/info"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy: {str(e)}")
        return jsonify({'error': 'Error al obtener información del perfil'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/search_posts', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def search_posts():
    """Busca posts y reels por query usando Mediafy API"""
    try:
        search_query = request.args.get('search_query')
        if not search_query:
            return jsonify({'error': 'Se requiere el parámetro search_query'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/search_posts"
        headers = get_headers()
        params = {
            'search_query': search_query
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy search_posts: {str(e)}")
        return jsonify({'error': 'Error al buscar posts'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/hashtag', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_hashtag_info():
    """Obtiene información de un hashtag usando Mediafy API"""
    try:
        hashtag = request.args.get('hashtag')
        if not hashtag:
            return jsonify({'error': 'Se requiere el parámetro hashtag'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/hashtag"
        headers = get_headers()
        params = {
            'hashtag': hashtag
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy hashtag: {str(e)}")
        return jsonify({'error': 'Error al obtener información del hashtag'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/hashtag/posts', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_hashtag_posts():
    """Obtiene posts de un hashtag usando Mediafy API"""
    try:
        hashtag = request.args.get('hashtag')
        if not hashtag:
            return jsonify({'error': 'Se requiere el parámetro hashtag'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/hashtag/posts"
        headers = get_headers()
        params = {
            'hashtag': hashtag
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy hashtag_posts: {str(e)}")
        return jsonify({'error': 'Error al obtener posts del hashtag'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500



@mediafy_bp.route('/search_users', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def search_users():
    """Busca usuarios por query usando Mediafy API"""
    try:
        search_query = request.args.get('search_query')
        if not search_query:
            return jsonify({'error': 'Se requiere el parámetro search_query'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/search_users"
        headers = get_headers()
        params = {
            'search_query': search_query
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy search_users: {str(e)}")
        return jsonify({'error': 'Error al buscar usuarios'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/location', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_location_info():
    """Obtiene información de una ubicación usando Mediafy API"""
    try:
        location_query = request.args.get('location_query')
        if not location_query:
            return jsonify({'error': 'Se requiere el parámetro location_query'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/search_location"
        headers = get_headers()
        params = {
            'search_query': location_query
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy location: {str(e)}")
        return jsonify({'error': 'Error al obtener información de la ubicación'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/location_info', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_location_detail_info():
    """Obtiene información detallada de una ubicación específica usando Mediafy API"""
    try:
        location_id = request.args.get('location_id')
        if not location_id:
            return jsonify({'error': 'Se requiere el parámetro location_id'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/location_info"
        headers = get_headers()
        params = {
            'location_id': location_id
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy location_info: {str(e)}")
        return jsonify({'error': 'Error al obtener información detallada de la ubicación'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/location/posts', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_location_posts():
    """Obtiene posts de una ubicación usando Mediafy API"""
    try:
        location_query = request.args.get('location_query')
        if not location_query:
            return jsonify({'error': 'Se requiere el parámetro location_query'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/location/posts"
        headers = get_headers()
        params = {
            'location_query': location_query
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy location_posts: {str(e)}")
        return jsonify({'error': 'Error al obtener posts de la ubicación'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/posts', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_user_posts():
    """Obtiene los posts de un usuario usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/posts"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy posts: {str(e)}")
        return jsonify({'error': 'Error al obtener posts del usuario'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/reels', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_user_reels():
    """Obtiene los reels de un usuario usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/reels"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy reels: {str(e)}")
        return jsonify({'error': 'Error al obtener reels del usuario'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/stories', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_user_stories():
    """Obtiene las stories de un usuario usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/stories"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy stories: {str(e)}")
        return jsonify({'error': 'Error al obtener stories del usuario'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/highlights', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_user_highlights():
    """Obtiene los highlights de un usuario usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/highlights"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy highlights: {str(e)}")
        return jsonify({'error': 'Error al obtener highlights del usuario'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/tagged', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_user_tagged():
    """Obtiene los posts donde un usuario está etiquetado usando Mediafy API"""
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Se requiere el parámetro username'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/tagged"
        headers = get_headers()
        params = {
            'username_or_id_or_url': username
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy tagged: {str(e)}")
        return jsonify({'error': 'Error al obtener posts etiquetados del usuario'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@mediafy_bp.route('/audio_info', methods=['GET'])
@jwt_required()
@credits_required(amount=3)
def get_audio_info():
    """Obtiene información de un audio de Instagram usando Mediafy API"""
    try:
        audio_canonical_id = request.args.get('audio_canonical_id')
        if not audio_canonical_id:
            return jsonify({'error': 'Se requiere el parámetro audio_canonical_id'}), 400
        
        # Llamar a la API de Mediafy
        url = "https://mediafy-api.p.rapidapi.com/v1/audio_info"
        headers = get_headers()
        params = {
            'audio_canonical_id': audio_canonical_id
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API Mediafy audio_info: {str(e)}")
        return jsonify({'error': 'Error al obtener información de audio'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Handlers para CORS preflight
@mediafy_bp.route('', methods=['OPTIONS'])
@mediafy_bp.route('/', methods=['OPTIONS'])
def handle_options():
    return '', 200
