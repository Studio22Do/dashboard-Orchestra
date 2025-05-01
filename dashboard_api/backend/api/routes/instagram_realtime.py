from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
instagram_realtime_bp = Blueprint('instagram_realtime', __name__)

# ID de aplicación en la base de datos
APP_ID = "instagram-realtime"

@instagram_realtime_bp.route('/posts/comments', methods=['GET'])
@jwt_required()
def get_post_comments():
    """Obtener comentarios de una publicación de Instagram"""
    # Obtener parámetros
    post_id = request.args.get('post_id')
    
    if not post_id:
        raise ValidationError("Se requiere el ID de la publicación")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST']}/instagram/posts/{post_id}/comments"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        headers=headers
    )
    
    return jsonify(result), 200

@instagram_realtime_bp.route('/profiles', methods=['GET'])
@jwt_required()
def get_profile_info():
    """Obtener información de un perfil de Instagram"""
    # Obtener parámetros
    username = request.args.get('username')
    
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST']}/instagram/user/{username}"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])
    
    # Realizar llamada a la API
    result = call_rapidapi(
        app_id=APP_ID,
        user_id=current_user_id,
        method="GET",
        url=api_url,
        headers=headers
    )
    
    return jsonify(result), 200

# Añadir ruta alternativa para el frontend
@instagram_realtime_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_info():
    """Alias para obtener información de perfil (compatibilidad con frontend)"""
    return get_profile_info()

@instagram_realtime_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    """Obtener publicaciones de un usuario de Instagram"""
    # Obtener parámetros
    username = request.args.get('username')
    limit = request.args.get('limit', 10)
    
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST']}/instagram/user/{username}/posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])
    params = {"count": limit}
    
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

@instagram_realtime_bp.route('/hashtag', methods=['GET'])
@jwt_required()
def get_hashtag_posts():
    """Obtener publicaciones con un hashtag específico"""
    # Obtener parámetros
    tag = request.args.get('tag')
    limit = request.args.get('limit', 10)
    
    if not tag:
        raise ValidationError("Se requiere un hashtag")
    
    # Eliminar el símbolo # si está presente
    tag = tag.replace('#', '')
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST']}/instagram/hashtag/{tag}/posts"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])
    params = {"count": limit}
    
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

# Añadir ruta alternativa para el frontend (hashtag en lugar de tag)
@instagram_realtime_bp.route('/hashtags', methods=['GET'])
@jwt_required()
def get_hashtags_posts():
    """Alias para obtener hashtags (compatibilidad con frontend)"""
    # Modificar request.args para que coincida con la ruta original
    hashtag = request.args.get('hashtag')
    if hashtag:
        request.args = dict(request.args)
        request.args['tag'] = hashtag
    return get_hashtag_posts()

@instagram_realtime_bp.route('/mentions', methods=['GET'])
@jwt_required()
def get_user_mentions():
    """Obtener menciones de un usuario de Instagram"""
    # Obtener parámetros
    username = request.args.get('username')
    limit = request.args.get('limit', 10)
    
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST']}/instagram/user/{username}/mentions"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_INSTAGRAM_REALTIME_HOST'])
    params = {"count": limit}
    
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