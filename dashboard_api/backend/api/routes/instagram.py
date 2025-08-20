"""Rutas para la API de Instagram"""
from flask import Blueprint, request, jsonify, current_app, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import logging

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi
from api.utils.decorators import credits_required

# Configuración de logging
logger = logging.getLogger(__name__)

# Crear blueprint
instagram_bp = Blueprint('instagram', __name__)

# ID de aplicación en la base de datos
APP_ID = "instagram"

# Constantes
PREMIUM_API_BASE = "https://instagram-premium-api-2023.p.rapidapi.com/v1/user"
PREMIUM_API_V2_BASE = "https://instagram-premium-api-2023.p.rapidapi.com/v2"


def get_premium_headers():
    """Obtener headers para la API Premium"""
    return {
        "x-rapidapi-key": current_app.config["RAPIDAPI_KEY"],
        "x-rapidapi-host": "instagram-premium-api-2023.p.rapidapi.com"
    }



def validate_username(username: str) -> None:
    """Validar que se proporcione un username"""
    if not username:
        raise ValidationError("Se requiere un nombre de usuario")

# Rutas Premium API
@instagram_bp.route('/profile/username', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
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
@credits_required(amount=1)
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
@credits_required(amount=1)
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
@credits_required(amount=1)
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

@instagram_bp.route('/v2/profile/username', methods=['GET'])
@jwt_required()
def get_v2_profile_by_username():
    """Obtener perfil de Instagram por username usando la Premium API v2"""
    username = request.args.get('username')
    validate_username(username)
    
    url = f"{PREMIUM_API_V2_BASE}/by/username"
    headers = get_premium_headers()
    params = {"username": username}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Esto lanzará una excepción para códigos de error HTTP
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        logger.error(f"Error al obtener perfil v2: {str(e)}")
        return jsonify({"error": "Error al obtener el perfil", "details": str(e)}), 500

@instagram_bp.route('/v2/story/url', methods=['GET'])
@jwt_required()
def get_story_by_url():
    """Obtener historia o highlight de Instagram por URL usando la API v2"""
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Se requiere una URL de la historia"}), 400
    
    # Determinar si es un highlight o una historia normal
    is_highlight = 'highlights' in url
    
    if is_highlight:
        # Extraer el ID del highlight de la URL
        highlight_id = url.split('highlights/')[-1].split('/')[0]
        api_url = f"{PREMIUM_API_V2_BASE}/highlight/by/id"
        params = {"id": highlight_id}
    else:
        api_url = f"{PREMIUM_API_V2_BASE}/story/by/url"
        params = {"url": url}
    
    headers = get_premium_headers()
    
    try:
        # Debug de la petición
        print("\n=== DEBUG PETICIÓN ===")
        print(f"URL API: {api_url}")
        print(f"Parámetros: {params}")
        print(f"Headers: {headers}")
        
        response = requests.get(api_url, headers=headers, params=params)
        
        # Debug de la respuesta
        print("\n=== DEBUG RESPUESTA ===")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print("\nContenido:")
        print(response.text[:1000])
        print("\n=== FIN DEBUG ===\n")

        # Manejar errores de la API
        if response.status_code != 200:
            error_data = response.json()
            error_message = error_data.get('error', 'Error desconocido')
            
            if response.status_code == 429:
                retry_after = response.headers.get('Retry-After', '60')
                return jsonify({
                    "error": "Límite de peticiones alcanzado",
                    "message": f"Por favor, espera {retry_after} segundos antes de intentar nuevamente",
                    "retry_after": retry_after
                }), 429
            
            return jsonify({
                "error": error_message,
                "status": response.status_code
            }), response.status_code

        data = response.json()
        
        if is_highlight:
            # La respuesta tiene una estructura anidada para highlights
            highlight_key = f"highlight:{highlight_id}"
            highlight_data = data.get('response', {}).get('reels', {}).get(highlight_key, {})
            
            if not highlight_data:
                return jsonify({
                    "error": "No se encontraron datos del highlight",
                    "highlight_id": highlight_id
                }), 404

            # Obtener y ordenar todos los items
            all_items = highlight_data.get('items', [])
            sorted_items = sorted(all_items, key=lambda x: x.get('taken_at', ''), reverse=True)
            
            # Tomar solo los últimos 5 items
            items_to_show = sorted_items[:5]
            
            # Procesar los datos básicos del highlight
            processed_data = {
                'type': 'highlight',
                'id': highlight_data.get('id'),
                'taken_at': highlight_data.get('latest_reel_media'),
                'cover_media': highlight_data.get('cover_media', {}).get('cropped_image_version', {}).get('url'),
                'can_reply': highlight_data.get('can_reply', False),
                'can_reshare': highlight_data.get('can_reshare', False),
                'total_items': len(all_items),
                'showing_items': len(items_to_show),
                'media_items': []
            }

            # Procesar solo los 5 items seleccionados
            for item in items_to_show:
                media_item = {
                    'id': item.get('id'),
                    'media_type': 'video' if item.get('is_video', False) else 'image',
                    'thumbnail_url': item.get('thumbnail_url') or item.get('display_url'),
                    'display_url': item.get('display_url'),
                    'video_url': item.get('video_url'),
                    'taken_at': item.get('taken_at'),
                    'caption': item.get('caption', '')
                }
                processed_data['media_items'].append(media_item)
            
            print("\n=== DATOS PROCESADOS ===")
            print(processed_data)
            print("\n=== FIN DATOS PROCESADOS ===\n")
            
            return jsonify(processed_data)
        else:
            return jsonify(data.get('response', {}))
            
    except requests.exceptions.RequestException as e:
        print(f"\nERROR: {str(e)}")
        return jsonify({
            "error": f"Error al obtener {'el highlight' if is_highlight else 'la historia'}", 
            "details": str(e)
        }), 500

@instagram_bp.route('/v2/media/proxy', methods=['GET'])
def proxy_media():
    try:
        url = request.args.get('url')
        if not url:
            return jsonify({'error': 'URL no proporcionada'}), 400

        headers = {
            'User-Agent': 'Instagram 219.0.0.12.117 Android',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        }

        response = requests.get(url, headers=headers, stream=True)
        
        if response.status_code != 200:
            return jsonify({'error': f'Error al obtener el medio: {response.status_code}'}), response.status_code

        # Devolver la imagen/video con el tipo de contenido correcto
        return Response(
            response.content,
            content_type=response.headers.get('content-type', 'application/octet-stream'),
            headers={
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000'
            }
        )

    except Exception as e:
        print(f"Error en proxy_media: {str(e)}")
        return jsonify({'error': str(e)}), 500

 