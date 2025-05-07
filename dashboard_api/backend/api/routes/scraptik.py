from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import logging
import json
import sys
import traceback

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
scraptik_bp = Blueprint('scraptik', __name__)

# ID de aplicación en la base de datos
APP_ID = "scraptik"
logger = logging.getLogger(__name__)

@scraptik_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_info():
    """Obtener información de un usuario de TikTok usando sec_user_id (ScrapTik)"""
    sec_user_id = request.args.get('sec_user_id')
    current_user_id = get_jwt_identity()
    
    if not sec_user_id:
        return jsonify({"error": "Se requiere el parámetro sec_user_id"}), 400

    api_url = "https://scraptik.p.rapidapi.com/get-user"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"sec_user_id": sec_user_id}
    
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
    user_id = request.args.get('user_id')
    count = request.args.get('count', 10)
    max_cursor = request.args.get('max_cursor', 0)
    
    if not user_id:
        raise ValidationError("Se requiere el ID del usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/user-posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "user_id": user_id,
        "count": count,
        "max_cursor": max_cursor
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
    aweme_id = request.args.get('aweme_id')
    
    if not aweme_id:
        raise ValidationError("Se requiere el ID del post (aweme_id)")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/get-post"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"aweme_id": aweme_id}
    
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
    keyword = request.args.get('keyword')
    count = request.args.get('count', 20)
    cursor = request.args.get('cursor', 0)
    
    if not keyword:
        raise ValidationError("Se requiere un término de búsqueda (keyword)")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/search-users"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "keyword": keyword,
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
    keyword = request.args.get('keyword')
    count = request.args.get('count', 20)
    offset = request.args.get('offset', 0)
    use_filters = request.args.get('use_filters', 0)
    publish_time = request.args.get('publish_time', 0)
    sort_type = request.args.get('sort_type', 0)
    
    if not keyword:
        raise ValidationError("Se requiere un término de búsqueda (keyword)")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/search-posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "keyword": keyword,
        "count": count,
        "offset": offset,
        "use_filters": use_filters,
        "publish_time": publish_time,
        "sort_type": sort_type
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

@scraptik_bp.route('/hashtag-posts', methods=['GET'])
@jwt_required()
def get_hashtag_posts():
    """Obtener publicaciones de un hashtag específico"""
    # Obtener parámetros
    cid = request.args.get('cid')
    count = request.args.get('count', 20)
    cursor = request.args.get('cursor', 0)
    
    if not cid:
        raise ValidationError("Se requiere el ID del hashtag (cid)")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/hashtag-posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "cid": cid,
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

@scraptik_bp.route('/search-hashtags', methods=['GET'])
@jwt_required()
def search_hashtags():
    """Buscar hashtags en TikTok"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    count = request.args.get('count', 20)
    cursor = request.args.get('cursor', 0)
    
    if not keyword:
        raise ValidationError("Se requiere un término de búsqueda (keyword)")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/search-hashtags"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "keyword": keyword,
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

@scraptik_bp.route('/trending-creators', methods=['GET'])
@jwt_required()
def get_trending_creators():
    """Obtener creadores en tendencia"""
    # Obtener parámetros
    region = request.args.get('region', 'US')
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/trending-creators"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"region": region}
    
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

@scraptik_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_feed():
    """Obtener feed general de TikTok"""
    # Obtener parámetros
    max_cursor = request.args.get('max_cursor', 0)
    min_cursor = request.args.get('min_cursor', 0)
    region = request.args.get('region', 'US')
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/feed"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {
        "max_cursor": max_cursor,
        "min_cursor": min_cursor,
        "region": region
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

@scraptik_bp.route('/music', methods=['GET'])
@jwt_required()
def get_music():
    """Obtener información de una canción"""
    # Obtener parámetros
    music_id = request.args.get('music_id')
    
    if not music_id:
        raise ValidationError("Se requiere el ID de la música")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_SCRAPTIK_HOST']}/get-music"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"music_id": music_id}
    
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

@scraptik_bp.route('/user-by-username', methods=['GET'])
@jwt_required()
def get_user_by_username():
    """Obtener información de un usuario de TikTok usando el username (flujo automático)"""
    username = request.args.get('username')
    current_user_id = get_jwt_identity()

    if not username:
        return jsonify({"error": "Se requiere el parámetro username"}), 400

    # Paso 1: Buscar el usuario para obtener el sec_user_id
    search_url = "https://scraptik.p.rapidapi.com/search-users"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_SCRAPTIK_HOST'])
    params = {"keyword": username, "count": 1, "cursor": 0}

    search_result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=search_url,
        params=params,
        headers=headers
    )

    # Extraer sec_user_id
    users = search_result.get('users') or search_result.get('data') or []
    if not users or not isinstance(users, list):
        return jsonify({"error": "No se encontró el usuario en TikTok"}), 404

    sec_user_id = users[0].get('secUid') or users[0].get('sec_user_id')
    if not sec_user_id:
        return jsonify({"error": "No se pudo obtener el sec_user_id del usuario"}), 404

    # Paso 2: Consultar el perfil con sec_user_id
    user_url = "https://scraptik.p.rapidapi.com/get-user"
    user_params = {"sec_user_id": sec_user_id}

    user_result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=user_url,
        params=user_params,
        headers=headers
    )

    return jsonify(user_result), 200 