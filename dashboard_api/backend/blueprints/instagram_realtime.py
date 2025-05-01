import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from utils.decorators import handle_api_errors

logger = logging.getLogger(__name__)

instagram_blueprint = Blueprint('instagram_realtime', __name__)

@instagram_blueprint.route('/followers', methods=['GET'])
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

@instagram_blueprint.route('/engagement', methods=['GET'])
@handle_api_errors
def get_engagement():
    """Obtiene métricas de engagement."""
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Se requiere un nombre de usuario'}), 400
    
    try:
        api_url = f"{current_app.config['INSTAGRAM_API_BASE_URL']}/profile/{username}"
        headers = {"X-API-KEY": current_app.config['INSTAGRAM_API_KEY']}
        
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extraer estadísticas de las últimas publicaciones
        posts = data.get('edge_owner_to_timeline_media', {}).get('edges', [])
        
        total_likes = 0
        total_comments = 0
        post_count = len(posts)
        
        for post in posts:
            node = post.get('node', {})
            total_likes += node.get('edge_liked_by', {}).get('count', 0)
            total_comments += node.get('edge_media_to_comment', {}).get('count', 0)
        
        avg_likes = total_likes / post_count if post_count > 0 else 0
        avg_comments = total_comments / post_count if post_count > 0 else 0
        
        follower_count = data.get('edge_followed_by', {}).get('count', 1)
        engagement_rate = ((avg_likes + avg_comments) / follower_count) * 100 if follower_count > 0 else 0
        
        return jsonify({
            'username': username,
            'post_count': post_count,
            'avg_likes': avg_likes,
            'avg_comments': avg_comments,
            'engagement_rate': round(engagement_rate, 2)
        })
    
    except requests.RequestException as e:
        logger.error(f"Error al obtener datos de engagement para {username}: {str(e)}")
        return jsonify({'error': 'Error al obtener datos de Instagram'}), 503 