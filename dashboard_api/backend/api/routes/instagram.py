"""Rutas para la API de Instagram"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import logging

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Configuración de logging
logger = logging.getLogger(__name__)

# Crear blueprint
instagram_bp = Blueprint('instagram', __name__)

# ID de aplicación en la base de datos
APP_ID = "instagram"

# Constantes
PREMIUM_API_BASE = "https://instagram-premium-api-2023.p.rapidapi.com/v1/user"
REALTIME_API_BASE = "https://{host}/instagram"

def get_premium_headers():
    """Obtener headers para la API Premium"""
    return {
        "x-rapidapi-key": current_app.config["RAPIDAPI_KEY"],
        "x-rapidapi-host": "instagram-premium-api-2023.p.rapidapi.com"
    }

def get_realtime_headers():
    """Obtener headers para la API Realtime"""
    return get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])

def validate_username(username: str) -> None:
    """Validar que se proporcione un username"""
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")

# Rutas Premium API
@instagram_bp.route('/profile/username', methods=['GET'])
@jwt_required()
def get_profile_by_username():
    """Obtener perfil de Instagram por username usando la Premium API"""
    username = request.args.get('username')
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/by/username"
    headers = get_premium_headers()
    params = {"username": username}
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/followers', methods=['GET'])
@jwt_required()
def get_followers():
    """Obtener followers de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 100)
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/followers"
    headers = get_premium_headers()
    params = {"username": username, "amount": amount}
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/following', methods=['GET'])
@jwt_required()
def get_following():
    """Obtener following de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 100)
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/following"
    headers = get_premium_headers()
    params = {"username": username, "amount": amount}
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    """Obtener posts de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 10)
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/medias"
    headers = get_premium_headers()
    params = {
        "username": username,
        "amount": amount,
        "force": request.args.get('force', 'true')
    }
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/stories', methods=['GET'])
@jwt_required()
def get_stories():
    """Obtener stories de un usuario de Instagram"""
    username = request.args.get('username')
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/stories/by/username"
    headers = get_premium_headers()
    params = {
        "username": username,
        "force": request.args.get('force', 'true')
    }
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/highlights', methods=['GET'])
@jwt_required()
def get_highlights():
    """Obtener highlights de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 10)
    validate_username(username)
    
    url = f"{PREMIUM_API_BASE}/highlights"
    headers = get_premium_headers()
    params = {
        "username": username,
        "amount": amount,
        "force": request.args.get('force', 'true')
    }
    
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/full-profile', methods=['GET'])
@jwt_required()
def get_full_profile():
    """Obtener perfil completo de Instagram incluyendo followers, following, posts, etc."""
    username = request.args.get('username')
    validate_username(username)
    
    headers = get_premium_headers()
    result = {}
    
    # Obtener perfil básico
    user_url = f"{PREMIUM_API_BASE}/by/username"
    user_params = {"username": username}
    user_resp = requests.get(user_url, headers=headers, params=user_params)
    if user_resp.status_code != 200:
        return jsonify({"error": "No se pudo obtener el perfil", "details": user_resp.text}), user_resp.status_code
    result['profile'] = user_resp.json()
    
    # Obtener datos adicionales en paralelo
    endpoints = {
        'highlights': f"{PREMIUM_API_BASE}/highlights",
        'stories': f"{PREMIUM_API_BASE}/stories/by/username",
        'followers': f"{PREMIUM_API_BASE}/followers",
        'following': f"{PREMIUM_API_BASE}/following",
        'medias': f"{PREMIUM_API_BASE}/medias"
    }
    
    for key, endpoint in endpoints.items():
        params = {"username": username}
        if key in ['followers', 'following']:
            params['amount'] = 100
        elif key in ['highlights', 'medias']:
            params['amount'] = 10
            params['force'] = 'true'
        
        response = requests.get(endpoint, headers=headers, params=params)
        result[key] = response.json() if response.status_code == 200 else None
    
    return jsonify(result), 200

# Rutas Realtime API
@instagram_bp.route('/realtime/profile', methods=['GET'])
@jwt_required()
def get_realtime_profile():
    """Obtener información de perfil en tiempo real"""
    username = request.args.get('username')
    validate_username(username)
    
    current_user_id = get_jwt_identity()
    api_url = f"{REALTIME_API_BASE.format(host=current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])}/user/{username}"
    
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        headers=get_realtime_headers()
    )
    
    return jsonify(result), 200

@instagram_bp.route('/realtime/posts', methods=['GET'])
@jwt_required()
def get_realtime_posts():
    """Obtener publicaciones en tiempo real"""
    username = request.args.get('username')
    limit = request.args.get('limit', 10)
    validate_username(username)
    
    current_user_id = get_jwt_identity()
    api_url = f"{REALTIME_API_BASE.format(host=current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])}/user/{username}/posts"
    
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params={"count": limit},
        headers=get_realtime_headers()
    )
    
    return jsonify(result), 200

@instagram_bp.route('/realtime/hashtag', methods=['GET'])
@jwt_required()
def get_realtime_hashtag():
    """Obtener publicaciones con hashtag en tiempo real"""
    tag = request.args.get('tag') or request.args.get('hashtag')
    limit = request.args.get('limit', 10)
    
    if not tag:
        raise ValidationError("Se requiere un hashtag")
    
    tag = tag.replace('#', '')
    current_user_id = get_jwt_identity()
    api_url = f"{REALTIME_API_BASE.format(host=current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])}/hashtag/{tag}/posts"
    
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params={"count": limit},
        headers=get_realtime_headers()
    )
    
    return jsonify(result), 200

@instagram_bp.route('/realtime/comments', methods=['GET'])
@jwt_required()
def get_realtime_comments():
    """Obtener comentarios de una publicación en tiempo real"""
    post_id = request.args.get('post_id')
    if not post_id:
        raise ValidationError("Se requiere el ID de la publicación")
    
    current_user_id = get_jwt_identity()
    api_url = f"{REALTIME_API_BASE.format(host=current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])}/posts/{post_id}/comments"
    
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        headers=get_realtime_headers()
    )
    
    return jsonify(result), 200

@instagram_bp.route('/realtime/mentions', methods=['GET'])
@jwt_required()
def get_realtime_mentions():
    """Obtener menciones de un usuario en tiempo real"""
    username = request.args.get('username')
    limit = request.args.get('limit', 10)
    validate_username(username)
    
    current_user_id = get_jwt_identity()
    api_url = f"{REALTIME_API_BASE.format(host=current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])}/user/{username}/mentions"
    
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        params={"count": limit},
        headers=get_realtime_headers()
    )
    
    return jsonify(result), 200 