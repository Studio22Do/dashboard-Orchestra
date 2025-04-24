from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
instagram_bp = Blueprint('instagram', __name__)

# ID de aplicación en la base de datos
APP_ID = "instagram-stats"

@instagram_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile_by_url():
    """Obtener estadísticas de perfil de Instagram por URL"""
    # Obtener parámetros
    profile_url = request.args.get('url')
    
    if not profile_url:
        raise ValidationError("Se requiere una URL de perfil")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/profile"
    headers = get_rapidapi_headers()
    params = {"url": profile_url}
    
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

@instagram_bp.route('/profile/id', methods=['GET'])
@jwt_required()
def get_profile_by_id():
    """Obtener estadísticas de perfil de Instagram por ID"""
    # Obtener parámetros
    profile_id = request.args.get('id')
    
    if not profile_id:
        raise ValidationError("Se requiere un ID de perfil")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/profile/id"
    headers = get_rapidapi_headers()
    params = {"id": profile_id}
    
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