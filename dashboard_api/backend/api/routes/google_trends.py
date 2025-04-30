from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
google_trends_bp = Blueprint('google_trends', __name__)

# ID de aplicación en la base de datos
APP_ID = "google-trends"

@google_trends_bp.route('/trending-searches', methods=['GET'])
@jwt_required()
def get_trending_searches():
    """Obtener búsquedas tendencia por ubicación geográfica"""
    # Obtener parámetros
    geo = request.args.get('geo', 'US')  # Por defecto USA si no se especifica
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST']}/trending-searches"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST'])
    params = {"geo": geo}
    
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

@google_trends_bp.route('/daily-trends', methods=['GET'])
@jwt_required()
def get_daily_trends():
    """Obtener tendencias diarias por ubicación geográfica"""
    # Obtener parámetros
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST']}/daily-trends"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST'])
    params = {"geo": geo}
    
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

@google_trends_bp.route('/interest-over-time', methods=['GET'])
@jwt_required()
def get_interest_over_time():
    """Obtener interés a lo largo del tiempo para un término de búsqueda"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    if not keyword:
        raise ValidationError("Se requiere una palabra clave")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST']}/interest-over-time"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST'])
    params = {"keyword": keyword, "geo": geo}
    
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

@google_trends_bp.route('/related-queries', methods=['GET'])
@jwt_required()
def get_related_queries():
    """Obtener consultas relacionadas para un término de búsqueda"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    if not keyword:
        raise ValidationError("Se requiere una palabra clave")
    
    # Obtener usuario actual
    current_user_id = get_jwt_identity()
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST']}/related-queries"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_TRENDS_HOST'])
    params = {"keyword": keyword, "geo": geo}
    
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