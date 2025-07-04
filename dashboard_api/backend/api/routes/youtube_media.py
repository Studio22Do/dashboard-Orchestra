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
        params = {"videoId": video_id}
        
        # Hacer solicitud a la API
        response = requests.get(api_url, headers=headers, params=params)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            logger.error(f"Error en la API de YouTube: {error_detail}")
            return jsonify({"error": "Error en la API de YouTube"}), response.status_code
        
        # Procesar y transformar la respuesta para mantener compatibilidad
        data = response.json()
        transformed_data = {
            "id": data.get("videoId", ""),
            "title": data.get("title", ""),
            "description": data.get("description", ""),
            "thumbnail_url": data.get("thumbnail", {}).get("url", "") if data.get("thumbnail") else "",
            "channel": {
                "id": data.get("channelId", ""),
                "title": data.get("channelTitle", ""),
                "thumbnail": data.get("channelThumbnail", "")
            },
            "views": data.get("viewCount", 0),
            "likes": data.get("likeCount", 0),
            "published": data.get("publishDate", ""),
            "duration": data.get("duration", "")
        }
        
        # Devolver resultados transformados
        return jsonify(transformed_data), 200
        
    except Exception as e:
        logger.error(f"Error al obtener detalles del video: {str(e)}")
        return jsonify({"error": str(e)}), 500

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
        
        # Primero obtener detalles del video para el título
        details_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/details"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        
        # Obtener detalles
        details_response = requests.get(details_url, headers=headers, params={"videoId": video_id})
        if details_response.status_code != 200:
            return jsonify({"error": "Error al obtener detalles del video"}), details_response.status_code
        
        video_details = details_response.json()
        
        # Configurar API para formatos
        formats_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/formats"
        
        # Hacer solicitud a la API
        formats_response = requests.get(formats_url, headers=headers, params={"videoId": video_id})
        
        # Verificar respuesta
        if formats_response.status_code != 200:
            error_detail = {
                "status_code": formats_response.status_code,
                "message": formats_response.text
            }
            logger.error(f"Error en la API de YouTube: {error_detail}")
            return jsonify({"error": "Error en la API de YouTube"}), formats_response.status_code
        
        formats_data = formats_response.json()
        
        # Transformar los datos al formato esperado por el frontend
        transformed_formats = []
        
        # Procesar formatos de video+audio
        for format in formats_data.get("formats", []):
            if not format.get("url"):  # Skip formatos sin URL
                continue
                
            transformed_format = {
                "url": format.get("url"),
                "container": format.get("container", "mp4").lower(),
                "width": format.get("width", 0),
                "height": format.get("height", 0),
                "qualityLabel": format.get("qualityLabel", ""),
                "contentLength": format.get("contentLength", "0"),
                "hasVideo": format.get("hasVideo", True),
                "hasAudio": format.get("hasAudio", True),
                "audioBitrate": format.get("audioBitrate", 0)
            }
            transformed_formats.append(transformed_format)
        
        # Devolver resultados en el formato esperado por el frontend
        return jsonify({
            "title": video_details.get("title", ""),
            "formats": transformed_formats
        }), 200
        
    except Exception as e:
        logger.error(f"Error al obtener formatos del video: {str(e)}")
        return jsonify({"error": str(e)}), 500

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