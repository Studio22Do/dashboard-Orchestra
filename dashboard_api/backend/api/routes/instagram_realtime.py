import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from utils.decorators import handle_api_errors

logger = logging.getLogger(__name__)

instagram_realtime_bp = Blueprint('instagram_realtime', __name__)

@instagram_realtime_bp.route('/hashtags', methods=['GET'])
@handle_api_errors
def get_hashtags():
    """Obtiene información sobre hashtags de Instagram."""
    hashtag = request.args.get('hashtag')
    if not hashtag:
        return jsonify({'error': 'Se requiere un hashtag para buscar'}), 400
    
    try:
        # Headers para RapidAPI
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "instagram-realtimeapi.p.rapidapi.com"
        }
        
        # 1. Obtener información general del hashtag
        info_url = "https://instagram-realtimeapi.p.rapidapi.com/instagram/hashtags"
        info_params = {"query": hashtag}
        
        logger.debug(f"Buscando información del hashtag: {hashtag}")
        info_response = requests.get(info_url, headers=headers, params=info_params, timeout=15)
        
        # 2. Obtener posts del hashtag
        posts_url = f"https://instagram-realtimeapi.p.rapidapi.com/instagram/hashtags/{hashtag}/sections"
        posts_params = {"rank_token": "b"}
        
        logger.debug(f"Buscando posts del hashtag: {hashtag}")
        posts_response = requests.get(posts_url, headers=headers, params=posts_params, timeout=15)
        
        # Combinar resultados
        result = {
            'name': hashtag,
            'posts': []
        }
        
        if info_response.status_code == 200:
            hashtag_info = info_response.json()
            # Añadir información general del hashtag
            if isinstance(hashtag_info, dict):
                result.update(hashtag_info)
        else:
            logger.error(f"Error en la API de info de hashtags: {info_response.status_code} - {info_response.text}")
        
        if posts_response.status_code == 200:
            posts_data = posts_response.json()
            # Procesar y aplanar la estructura de posts
            if isinstance(posts_data, dict) and 'sections' in posts_data:
                for section in posts_data['sections']:
                    if isinstance(section, dict) and 'media' in section:
                        result['posts'].extend(section['media'])
        else:
            logger.error(f"Error en la API de posts de hashtags: {posts_response.status_code} - {posts_response.text}")
        
        logger.debug(f"Enviando respuesta con {len(result['posts'])} posts")
        return jsonify(result)
    
    except requests.RequestException as e:
        logger.error(f"Error de conexión para hashtag {hashtag}: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con la API de Instagram', 
            'details': str(e)
        }), 503

@instagram_realtime_bp.route('/profiles', methods=['GET'])
@handle_api_errors
def get_profile():
    """Obtiene información del perfil de Instagram usando la API en tiempo real."""
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Se requiere un nombre de usuario'}), 400
    
    try:
        # Headers para RapidAPI
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "instagram-realtimeapi.p.rapidapi.com"
        }
        
        # Usar el endpoint de información por nombre de usuario
        url = f"https://instagram-realtimeapi.p.rapidapi.com/instagram/users/{username}/user_name_info"
        
        logger.debug(f"Buscando información para el usuario: {username}")
        logger.debug(f"Realizando solicitud a: {url}")
        
        response = requests.get(url, headers=headers, timeout=15)
        logger.debug(f"Respuesta: Status={response.status_code}, Content={response.text[:200]}...")
        
        if response.status_code == 200:
            profile_data = response.json()
            
            # Formatear y enriquecer la respuesta
            if 'user' in profile_data:
                user_info = profile_data['user']
                
                # Crear una respuesta con la estructura exacta que espera el frontend
                formatted_response = {
                    'username': user_info.get('username'),
                    'full_name': user_info.get('full_name'),
                    'profile_pic_url': user_info.get('profile_pic_url_hd') or user_info.get('profile_pic_url'),
                    'biography': user_info.get('biography'),
                    'external_url': user_info.get('external_url'),
                    'is_private': user_info.get('is_private', False),
                    'is_verified': user_info.get('is_verified', False),
                    'is_business_account': user_info.get('is_business', False),
                    
                    # Estructura anidada para seguidores (como espera el frontend)
                    'edge_followed_by': {
                        'count': user_info.get('follower_count') or 0
                    },
                    
                    # Estructura anidada para seguidos
                    'edge_follow': {
                        'count': user_info.get('following_count') or 0
                    },
                    
                    # Estructura anidada para publicaciones
                    'edge_owner_to_timeline_media': {
                        'count': user_info.get('media_count') or 0,
                        'edges': []  # Array vacío para publicaciones recientes (podría rellenarse con otra llamada API)
                    }
                }
                
                # Incluir ID de usuario para posibles llamadas posteriores
                if user_info.get('pk'):
                    formatted_response['id'] = user_info.get('pk')
                
                # Solo incluir campos relacionados con negocios si es una cuenta de negocios
                if user_info.get('is_business'):
                    formatted_response['business_category_name'] = user_info.get('category')
                    formatted_response['business_email'] = user_info.get('public_email')
                    formatted_response['business_phone_number'] = user_info.get('contact_phone_number')
                
                return jsonify(formatted_response)
            
            # Si no hay estructura 'user', devolver los datos tal cual
            return jsonify(profile_data)
            
        else:
            logger.error(f"Error en la API: {response.status_code} - {response.text}")
            return jsonify({
                'error': 'Error al obtener datos del perfil',
                'details': response.text
            }), response.status_code
    
    except requests.RequestException as e:
        logger.error(f"Error de conexión para {username}: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con la API de Instagram', 
            'details': str(e)
        }), 503
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': f'Error inesperado: {str(e)}'}), 500

@instagram_realtime_bp.route('/followers', methods=['GET'])
@handle_api_errors
def get_followers():
    """Obtiene el conteo de seguidores en tiempo real."""
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Se requiere un nombre de usuario'}), 400
    
    try:
        api_url = f"{current_app.config['INSTAGRAM_API_BASE_URL']}/profile/{username}"
        headers = {"X-API-KEY": current_app.config['INSTAGRAM_API_KEY']}
        
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extraer información relevante
        follower_count = data.get('edge_followed_by', {}).get('count', 0)
        
        return jsonify({
            'username': username,
            'follower_count': follower_count
        })
    
    except requests.RequestException as e:
        logger.error(f"Error al obtener datos de Instagram para {username}: {str(e)}")
        return jsonify({'error': 'Error al obtener datos de Instagram'}), 503

@instagram_realtime_bp.route('/engagement', methods=['GET'])
@handle_api_errors
def get_engagement():
    """Obtiene métricas de engagement."""
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Se requiere un nombre de usuario'}), 400 