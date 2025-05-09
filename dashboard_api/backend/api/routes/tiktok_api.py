from flask import Blueprint, request, jsonify, current_app
import requests
from flask_jwt_extended import jwt_required

tiktok_api_bp = Blueprint('tiktok_api', __name__)

@tiktok_api_bp.route('/trending-videos', methods=['GET'])
@jwt_required()
def get_trending_videos():
    """Obtiene videos en tendencia de TikTok usando la API de RapidAPI Tiktok Scraper7"""
    region = request.args.get('region', 'us')
    count = request.args.get('count', 20)

    url = "https://tiktok-scraper7.p.rapidapi.com/feed/list"
    querystring = {"region": region, "count": count}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER7_HOST']
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al obtener videos en tendencia", "details": response.text}), 500

    data = response.json()
    # Adaptar la respuesta si es necesario para el frontend
    return jsonify(data)

@tiktok_api_bp.route('/user-posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    """Obtiene los posts de un usuario de TikTok usando la API de RapidAPI Tiktok Scraper7"""
    user_id = request.args.get('user_id')
    count = request.args.get('count', 10)
    cursor = request.args.get('cursor', 0)
    if not user_id:
        return jsonify({"error": "Falta el parámetro user_id"}), 400

    url = "https://tiktok-scraper7.p.rapidapi.com/user/posts"
    querystring = {"user_id": user_id, "count": count, "cursor": cursor}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER7_HOST']
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al obtener posts del usuario", "details": response.text}), 500

    data = response.json()
    return jsonify(data)

@tiktok_api_bp.route('/user-by-username', methods=['GET'])
@jwt_required()
def get_user_by_username():
    """Obtiene información de un usuario de TikTok por username usando la nueva API tiktok-scraper2"""
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Falta el parámetro username"}), 400

    url = "https://tiktok-scraper2.p.rapidapi.com/user/info"
    querystring = {"user_name": username}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER2_HOST']
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al buscar usuario", "details": response.text}), 500

    data = response.json()
    return jsonify(data)

@tiktok_api_bp.route('/hashtag-info', methods=['GET'])
@jwt_required()
def get_hashtag_info():
    """Obtiene información de un hashtag de TikTok usando la nueva API tiktok-scraper2"""
    hashtag = request.args.get('hashtag')
    if not hashtag:
        return jsonify({"error": "Falta el parámetro hashtag"}), 400

    url = "https://tiktok-scraper2.p.rapidapi.com/hashtag/info"
    querystring = {"hashtag": hashtag}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER2_HOST']
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al buscar hashtag", "details": response.text}), 500

    data = response.json()
    return jsonify(data)

@tiktok_api_bp.route('/user-videos', methods=['GET'])
@jwt_required()
def get_user_videos():
    """Obtiene los videos de un usuario de TikTok usando la nueva API tiktok-scraper2"""
    username = request.args.get('username')
    count = request.args.get('count', 20)
    cursor = request.args.get('cursor', 0)
    if not username:
        return jsonify({"error": "Falta el parámetro username"}), 400

    url = "https://tiktok-scraper2.p.rapidapi.com/user/videos"
    querystring = {"user_name": username, "count": count, "cursor": cursor}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER2_HOST']
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al obtener videos del usuario", "details": response.text}), 500

    data = response.json()
    return jsonify(data)

@tiktok_api_bp.route('/video-comments', methods=['GET'])
@jwt_required()
def get_video_comments():
    """Obtiene los comentarios de un video de TikTok usando la nueva API tiktok-scraper2"""
    video_id = request.args.get('video_id')
    url = request.args.get('url')
    count = request.args.get('count', 20)
    cursor = request.args.get('cursor', 0)
    if not video_id and not url:
        return jsonify({"error": "Falta el parámetro video_id o url"}), 400

    api_url = "https://tiktok-scraper2.p.rapidapi.com/video/comments"
    querystring = {"count": count, "cursor": cursor}
    if video_id:
        querystring["video_id"] = video_id
    if url:
        querystring["url"] = url
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['RAPIDAPI_TIKTOK_SCRAPER2_HOST']
    }

    response = requests.get(api_url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Error al obtener comentarios del video", "details": response.text}), 500

    data = response.json()
    return jsonify(data) 