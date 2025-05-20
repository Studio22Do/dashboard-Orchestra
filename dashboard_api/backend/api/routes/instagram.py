from flask import Blueprint, request, jsonify, current_app
# from flask_jwt_extended import jwt_required, get_jwt_identity  # Quitamos get_jwt_identity

from api.utils.error_handlers import ValidationError
import requests

# Crear blueprint
instagram_bp = Blueprint('instagram', __name__)

# Utilidad para obtener headers de RapidAPI Premium
def get_premium_headers():
    return {
        "x-rapidapi-key": current_app.config["RAPIDAPI_KEY"],
        "x-rapidapi-host": "instagram-premium-api-2023.p.rapidapi.com"
    }

PREMIUM_API_BASE = "https://instagram-premium-api-2023.p.rapidapi.com/v1/user"

@instagram_bp.route('/profile/username', methods=['GET'])
# @jwt_required()
def get_profile_by_username():
    """Obtener perfil de Instagram por username usando la Premium API 2023"""
    username = request.args.get('username')
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    url = f"{PREMIUM_API_BASE}/by/username"
    headers = get_premium_headers()
    params = {"username": username}
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/followers', methods=['GET'])
# @jwt_required()
def get_followers():
    """Obtener followers de un usuario de Instagram usando la Premium API 2023"""
    username = request.args.get('username')
    amount = request.args.get('amount', 100)
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    url = f"{PREMIUM_API_BASE}/followers"
    headers = get_premium_headers()
    params = {"username": username, "amount": amount}
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/following', methods=['GET'])
# @jwt_required()
def get_following():
    """Obtener following de un usuario de Instagram usando la Premium API 2023"""
    username = request.args.get('username')
    amount = request.args.get('amount', 100)
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    url = f"{PREMIUM_API_BASE}/following"
    headers = get_premium_headers()
    params = {"username": username, "amount": amount}
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/profile', methods=['GET'])
# @jwt_required()
def get_profile_by_url():
    """Obtener estadísticas de perfil de Instagram por URL"""
    # Obtener parámetros
    profile_url = request.args.get('url')
    
    if not profile_url:
        raise ValidationError("Se requiere una URL de perfil")
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/profile"
    headers = get_premium_headers()
    params = {"url": profile_url}
    
    # Realizar llamada a la API
    response = requests.get(api_url, headers=headers, params=params)
    
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/profile/id', methods=['GET'])
# @jwt_required()
def get_profile_by_id():
    """Obtener estadísticas de perfil de Instagram por ID"""
    # Obtener parámetros
    profile_id = request.args.get('id')
    
    if not profile_id:
        raise ValidationError("Se requiere un ID de perfil")
    
    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/profile/id"
    headers = get_premium_headers()
    params = {"id": profile_id}
    
    # Realizar llamada a la API
    response = requests.get(api_url, headers=headers, params=params)
    
    return jsonify(response.json()), response.status_code

@instagram_bp.route('/posts', methods=['GET'])
# @jwt_required()
def get_posts():
    """Obtener posts de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 10)
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")

    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/v1/user/posts"
    headers = get_premium_headers()
    params = {
        "username": username,
        "amount": amount,
        "force": request.args.get('force', 'true')
    }

    # Realizar llamada a la API
    response = requests.get(api_url, headers=headers, params=params)

    return jsonify(response.json()), response.status_code

@instagram_bp.route('/stories', methods=['GET'])
# @jwt_required()
def get_stories():
    """Obtener stories de un usuario de Instagram"""
    username = request.args.get('username')
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")

    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/v1/user/stories"
    headers = get_premium_headers()
    params = {
        "username": username,
        "force": request.args.get('force', 'true')
    }

    # Realizar llamada a la API
    response = requests.get(api_url, headers=headers, params=params)

    return jsonify(response.json()), response.status_code

@instagram_bp.route('/highlights', methods=['GET'])
# @jwt_required()
def get_highlights():
    """Obtener highlights de un usuario de Instagram"""
    username = request.args.get('username')
    amount = request.args.get('amount', 10)
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")

    # Configurar solicitud a RapidAPI
    api_url = f"https://{current_app.config['RAPIDAPI_INSTAGRAM_HOST']}/v1/user/highlights"
    headers = get_premium_headers()
    params = {
        "username": username,
        "amount": amount,
        "force": request.args.get('force', 'true')
    }

    # Realizar llamada a la API
    response = requests.get(api_url, headers=headers, params=params)

    return jsonify(response.json()), response.status_code

@instagram_bp.route('/full-profile', methods=['GET'])
def get_full_profile():
    username = request.args.get('username')
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")
    headers = get_premium_headers()
    base_url = "https://instagram-premium-api-2023.p.rapidapi.com"
    result = {}
    # 1. Perfil básico y pk
    user_url = f"{base_url}/v1/user/by/username"
    user_params = {"username": username}
    user_resp = requests.get(user_url, headers=headers, params=user_params)
    if user_resp.status_code != 200:
        return jsonify({"error": "No se pudo obtener el perfil", "details": user_resp.text}), user_resp.status_code
    user_data = user_resp.json()
    result['profile'] = user_data
    pk = user_data.get('pk')
    # 2. Highlights
    highlights_url = f"{base_url}/v1/user/highlights"
    highlights_params = {"username": username}
    highlights_resp = requests.get(highlights_url, headers=headers, params=highlights_params)
    result['highlights'] = highlights_resp.json() if highlights_resp.status_code == 200 else None
    # 3. Stories
    stories_url = f"{base_url}/v1/user/stories/by/username"
    stories_params = {"username": username}
    stories_resp = requests.get(stories_url, headers=headers, params=stories_params)
    result['stories'] = stories_resp.json() if stories_resp.status_code == 200 else None
    # 4. Followers
    followers_url = f"{base_url}/v1/user/followers"
    followers_params = {"username": username, "amount": 100}
    followers_resp = requests.get(followers_url, headers=headers, params=followers_params)
    result['followers'] = followers_resp.json() if followers_resp.status_code == 200 else None
    # 5. Following
    following_url = f"{base_url}/v1/user/following"
    following_params = {"username": username, "amount": 100}
    following_resp = requests.get(following_url, headers=headers, params=following_params)
    result['following'] = following_resp.json() if following_resp.status_code == 200 else None
    # 6. Medias (posts, reels, videos)
    medias_url = f"{base_url}/v1/user/medias"
    medias_params = {"username": username}
    medias_resp = requests.get(medias_url, headers=headers, params=medias_params)
    result['medias'] = medias_resp.json() if medias_resp.status_code == 200 else None
    return jsonify(result), 200 