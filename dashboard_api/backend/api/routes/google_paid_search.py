from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
google_paid_search_bp = Blueprint('google_paid_search', __name__)

# ID de aplicación en la base de datos
APP_ID = "google-paid-search"

@google_paid_search_bp.route('/search', methods=['GET'])
# @jwt_required()  # Comentado para desarrollo
def get_paid_search_results():
    """Obtener resultados de Google Ads para una consulta específica"""
    # Obtener parámetros
    query = request.args.get('query')
    country = request.args.get('country', 'us')  # Por defecto US
    language = request.args.get('language', 'en')  # Por defecto inglés
    
    if not query:
        raise ValidationError("Se requiere un término de búsqueda")
    
    # Obtener usuario actual (comentado para desarrollo)
    # current_user_id = get_jwt_identity()
    current_user_id = "dev_user"  # Usuario temporal para desarrollo
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST']}/search"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST'])
    params = {
        "query": query,
        "country": country,
        "language": language
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

@google_paid_search_bp.route('/keywords', methods=['GET'])
# @jwt_required()  # Comentado para desarrollo
def get_keyword_metrics():
    """Obtener métricas de palabras clave en Google Ads"""
    # Obtener parámetros
    keywords = request.args.get('keywords')
    country = request.args.get('country', 'us')  # Por defecto US
    
    if not keywords:
        raise ValidationError("Se requieren palabras clave")
    
    # Obtener usuario actual (comentado para desarrollo)
    # current_user_id = get_jwt_identity()
    current_user_id = "dev_user"  # Usuario temporal para desarrollo
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST']}/keyword-metrics"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST'])
    params = {
        "keywords": keywords,
        "country": country
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

@google_paid_search_bp.route('/competitors', methods=['GET'])
# @jwt_required()  # Comentado para desarrollo
def get_competitors():
    """Obtener principales competidores para una palabra clave en Google Ads"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    country = request.args.get('country', 'us')  # Por defecto US
    limit = request.args.get('limit', 10)  # Número de competidores a devolver
    
    if not keyword:
        raise ValidationError("Se requiere una palabra clave")
    
    # Obtener usuario actual (comentado para desarrollo)
    # current_user_id = get_jwt_identity()
    current_user_id = "dev_user"  # Usuario temporal para desarrollo
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST']}/competitors"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST'])
    params = {
        "keyword": keyword,
        "country": country,
        "limit": limit
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

@google_paid_search_bp.route('/ad-performance', methods=['GET'])
# @jwt_required()  # Comentado para desarrollo
def get_ad_performance():
    """Obtener rendimiento de anuncios para un dominio o marca específica"""
    # Obtener parámetros
    domain = request.args.get('domain')
    period = request.args.get('period', '30d')  # Por defecto últimos 30 días
    
    if not domain:
        raise ValidationError("Se requiere un dominio")
    
    # Obtener usuario actual (comentado para desarrollo)
    # current_user_id = get_jwt_identity()
    current_user_id = "dev_user"  # Usuario temporal para desarrollo
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST']}/ad-performance"
    headers = get_rapidapi_headers(current_app.config['RAPIDAPI_GOOGLE_PAID_SEARCH_HOST'])
    params = {
        "domain": domain,
        "period": period
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