from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
scraptik_bp = Blueprint('scraptik', __name__)

# ID de aplicación en la base de datos
APP_ID = "scraptik"

@scraptik_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_info():
    """Obtener información de un usuario de TikTok"""
    # Obtener parámetros
    username = request.args.get('username')
    
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/user"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"user_id": username}
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200

@scraptik_bp.route('/user-posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    """Obtener las publicaciones de un usuario de TikTok"""
    # Obtener parámetros
    username = request.args.get('username')
    count = request.args.get('count', 10)
    cursor = request.args.get('cursor', 0)
    
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/user-posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "user_id": username,
        "count": count,
        "cursor": cursor
    }
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200

@scraptik_bp.route('/post', methods=['GET'])
@jwt_required()
def get_post():
    """Obtener información de un post específico de TikTok"""
    # Obtener parámetros
    post_id = request.args.get('post_id')
    
    if not post_id:
        raise ValidationError("Se requiere el ID del post")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/post"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"post_id": post_id}
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200

@scraptik_bp.route('/search-users', methods=['GET'])
@jwt_required()
def search_users():
    """Buscar usuarios en TikTok"""
    # Obtener parámetros
    query = request.args.get('query')
    count = request.args.get('count', 10)
    cursor = request.args.get('cursor', 0)
    
    if not query:
        raise ValidationError("Se requiere un término de búsqueda")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/search-users"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "query": query,
        "count": count,
        "cursor": cursor
    }
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200

@scraptik_bp.route('/search-posts', methods=['GET'])
@jwt_required()
def search_posts():
    """Buscar posts en TikTok"""
    # Obtener parámetros
    query = request.args.get('query')
    count = request.args.get('count', 10)
    cursor = request.args.get('cursor', 0)
    
    if not query:
        raise ValidationError("Se requiere un término de búsqueda")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/search-posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "query": query,
        "count": count,
        "cursor": cursor
    }
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200

@scraptik_bp.route('/trending', methods=['GET'])
@jwt_required()
def get_trending():
    """Obtener trending posts en TikTok"""
    # Obtener parámetros
    count = request.args.get('count', 10)
    cursor = request.args.get('cursor', 0)
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/trending"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "count": count,
        "cursor": cursor
    }
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params=params,
        headers=headers
    )
    
    return jsonify(result), 200 