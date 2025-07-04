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

@youtube_media_bp.route('/video/details-and-formats', methods=['GET'])
def get_video_details_and_formats():
    try:
        video_id = request.args.get('videoId')
        if not video_id:
            return jsonify({"error": "Se requiere el ID del video"}), 400

        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/video/details"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        params = {
            "videoId": video_id,
            "urlAccess": "normal",
            "videos": "auto",
            "audios": "auto"
        }

        response = requests.get(api_url, headers=headers, params=params)
        print("STATUS CODE RAPIDAPI:", response.status_code)
        print("RAW RESPONSE TEXT:", response.text[:1000])
        try:
            data = response.json()
        except Exception as e:
            print("ERROR AL PARSEAR JSON:", str(e))
            data = response.text
        print("TIPO DE DATA:", type(data))
        print("DATA:", str(data)[:1000])  # Solo los primeros 1000 caracteres para no saturar

        # Prints explícitos para depuración de formatos
        videos_items = data.get('videos', {}).get('items', []) if isinstance(data, dict) else []
        audios_items = data.get('audios', {}).get('items', []) if isinstance(data, dict) else []
        print('VIDEOS ITEMS:', videos_items)
        print('AUDIOS ITEMS:', audios_items)

        if response.status_code != 200:
            logger.error(f"Error en la API de YouTube: {response.text}")
            return jsonify({"error": "Error en la API de YouTube"}), response.status_code

        result = {
            "id": data.get("id", "") if isinstance(data, dict) else "",
            "title": data.get("title", "") if isinstance(data, dict) else "",
            "description": data.get("description", "") if isinstance(data, dict) else "",
            "thumbnail_url": data.get("thumbnails", [{}])[-1].get("url", "") if isinstance(data, dict) and data.get("thumbnails") else "",
            "channel": {
                "id": data.get("channel", {}).get("id", "") if isinstance(data, dict) else "",
                "title": data.get("channel", {}).get("name", "") if isinstance(data, dict) else "",
                "thumbnail": data.get("channel", {}).get("avatar", [{}])[-1].get("url", "") if isinstance(data, dict) and data.get("channel", {}).get("avatar") else ""
            },
            "views": data.get("viewCount", 0) if isinstance(data, dict) else 0,
            "likes": data.get("likeCount", 0) if isinstance(data, dict) else 0,
            "published": data.get("publishedTime", "") if isinstance(data, dict) else "",
            "duration": data.get("lengthSeconds", "") if isinstance(data, dict) else "",
            "formats": []
        }

        # Formatos de video+audio
        if isinstance(data, dict):
            for video in videos_items:
                if not video.get("url"):
                    continue
                result["formats"].append({
                    "url": video.get("url"),
                    "container": video.get("extension", "mp4"),
                    "width": video.get("width", 0),
                    "height": video.get("height", 0),
                    "qualityLabel": video.get("quality", ""),
                    "contentLength": video.get("size", 0),
                    "hasVideo": video.get("hasVideo", True),
                    "hasAudio": video.get("hasAudio", True),
                    "audioBitrate": video.get("audioQuality", 0)
                })

            # Formatos de solo audio (si existen)
            for audio in audios_items:
                if not audio.get("url"):
                    continue
                result["formats"].append({
                    "url": audio.get("url"),
                    "container": audio.get("extension", "mp3"),
                    "width": 0,
                    "height": 0,
                    "qualityLabel": f"Audio {audio.get('quality', '')}",
                    "contentLength": audio.get("size", 0),
                    "hasVideo": False,
                    "hasAudio": True,
                    "audioBitrate": audio.get("bitrate", 0)
                })

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error al obtener detalles y formatos del video: {str(e)}")
        return jsonify({"error": str(e)}), 500 

@youtube_media_bp.route('/playlist/videos', methods=['GET'])
def get_playlist_videos():
    """Obtener videos de una lista de reproducción de YouTube"""
    try:
        playlist_id = request.args.get('playlistId')
        if not playlist_id:
            return jsonify({"error": "Se requiere el ID de la lista de reproducción"}), 400

        # Endpoint actualizado de RapidAPI (usualmente /v2/playlist/videos o similar)
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/playlist/videos"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        params = {"playlistId": playlist_id}
        response = requests.get(api_url, headers=headers, params=params)

        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code

        data = response.json()
        # Transformar la respuesta para el frontend
        videos = []
        for item in data.get('items', []):
            videos.append({
                "id": item.get("id", ""),
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "thumbnail_url": item.get("thumbnails", [{}])[-1].get("url", "") if item.get("thumbnails") else "",
                "channel": {
                    "id": item.get("channel", {}).get("id", ""),
                    "title": item.get("channel", {}).get("name", "")
                },
                "views": item.get("viewCount", 0),
                "published": item.get("publishedTime", ""),
                "duration": item.get("lengthSeconds", "")
            })
        return jsonify({"videos": videos}), 200
    except Exception as e:
        logger.error(f"Error al obtener videos de la playlist: {str(e)}")
        return jsonify({"error": str(e)}), 500 

@youtube_media_bp.route('/channel/videos', methods=['GET'])
def get_channel_videos():
    """Obtener videos, shorts o lives de un canal de YouTube"""
    try:
        channel_id = request.args.get('channelId')
        video_type = request.args.get('type', 'videos')  # videos, shorts, lives
        sort_by = request.args.get('sortBy', 'newest')
        next_token = request.args.get('nextToken')

        if not channel_id:
            return jsonify({"error": "Se requiere el ID o handle del canal"}), 400
        if video_type not in ['videos', 'shorts', 'lives']:
            return jsonify({"error": "Tipo de video inválido"}), 400

        # Endpoint RapidAPI (usualmente /v2/channel/videos)
        api_url = f"https://{current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']}/v2/channel/videos"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_YOUTUBE_MEDIA_HOST']
        }
        params = {
            "channelId": channel_id,
            "type": video_type,
            "sortBy": sort_by
        }
        if next_token:
            params["nextToken"] = next_token

        response = requests.get(api_url, headers=headers, params=params)
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            return jsonify({"error": "Error en la API de YouTube", "details": error_detail}), response.status_code

        data = response.json()
        # Transformar la respuesta para el frontend
        items = []
        for item in data.get('items', []):
            items.append({
                "id": item.get("id", ""),
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "thumbnails": item.get("thumbnails", []),
                "lengthText": item.get("lengthText", ""),
                "viewCountText": item.get("viewCountText", ""),
                "publishedTimeText": item.get("publishedTimeText", "")
            })
        return jsonify({
            "items": items,
            "nextToken": data.get("nextToken")
        }), 200
    except Exception as e:
        logger.error(f"Error al obtener videos del canal: {str(e)}")
        return jsonify({"error": str(e)}), 500 