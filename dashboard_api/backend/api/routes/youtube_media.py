from flask import Blueprint, request, jsonify, current_app
import requests
import logging

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers

# Crear blueprint
youtube_media_bp = Blueprint('youtube_media', __name__)

# ID de aplicación en la base de datos
APP_ID = "youtube-media"
logger = logging.getLogger(__name__)

@youtube_media_bp.route('/video/details', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def get_video_details():
    """Obtener detalles de un video de YouTube"""
    try:
        # Obtener parámetros
        video_id = request.args.get('videoId')
        url_access = request.args.get('urlAccess', 'normal')
        videos = request.args.get('videos', 'auto')
        audios = request.args.get('audios', 'auto')
        
        if not video_id:
            return jsonify({"error": "Se requiere el ID del video"}), 400
        
        # Configurar API
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/details"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Configurar parámetros
        params = {
            "videoId": video_id,
            "urlAccess": url_access,
            "videos": videos,
            "audios": audios
        }
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code
        
        # Devolver resultados
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al obtener detalles del video: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

@youtube_media_bp.route('/search/videos', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def search_videos():
    """Buscar videos en YouTube"""
    try:
        # Obtener parámetros
        query = request.args.get('query')
        max_results = request.args.get('maxResults', 10)
        
        if not query:
            return jsonify({"error": "Se requiere un término de búsqueda"}), 400
        
        # Configurar API
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/search/videos"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Configurar parámetros
        params = {
            "keyword": query,
            "uploadDate": "all",
            "duration": "all",
            "sortBy": "relevance"
        }
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            logger.error(f"Error en la API de YouTube: {error_detail}")
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code
        
        # Devolver resultados
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al buscar videos: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

@youtube_media_bp.route('/video/formats', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def get_video_formats():
    """Obtener formatos disponibles para descargar un video"""
    try:
        # Obtener parámetros
        video_id = request.args.get('videoId')
        
        if not video_id:
            return jsonify({"error": "Se requiere el ID del video"}), 400
        
        # Configurar API
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/formats"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Configurar parámetros
        params = {
            "videoId": video_id
        }
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code
        
        # Devolver resultados
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al obtener formatos de video: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

@youtube_media_bp.route('/video/download-links', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def get_download_links():
    """Obtener enlaces de descarga para un video"""
    try:
        # Obtener parámetros
        video_id = request.args.get('videoId')
        
        if not video_id:
            return jsonify({"error": "Se requiere el ID del video"}), 400
        
        # Configurar API
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/download-links"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Configurar parámetros
        params = {
            "videoId": video_id
        }
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code
        
        # Devolver resultados
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al obtener enlaces de descarga: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

@youtube_media_bp.route('/playlist/details', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def get_playlist_details():
    """Obtener detalles de una lista de reproducción"""
    try:
        # Obtener parámetros
        playlist_id = request.args.get('playlistId')
        
        if not playlist_id:
            return jsonify({"error": "Se requiere el ID de la lista de reproducción"}), 400
        
        # Configurar API
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/playlist/details"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Configurar parámetros
        params = {
            "playlistId": playlist_id
        }
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code
        
        # Devolver resultados
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al obtener detalles de la lista de reproducción: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500 