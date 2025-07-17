from flask import Blueprint, request, jsonify, current_app
import requests
import logging

social_media_content_bp = Blueprint('social_media_content', __name__)
logger = logging.getLogger(__name__)

# @jwt_required()  # Comentado para pruebas sin autenticación
@social_media_content_bp.route('/generate', methods=['POST'])
def generate_social_media_content():
    """Genera contenido para redes sociales usando la API externa"""
    try:
        data = request.get_json()
        platform = data.get('platform')
        text = data.get('text')
        lang = data.get('lang', 'es')
        length = data.get('length', 150)

        if not platform or not text:
            return jsonify({'error': 'Faltan campos requeridos: platform y text'}), 400

        # Mapear plataforma al endpoint de RapidAPI
        valid_platforms = [
            'Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'Pinterest', 'YouTube',
            'Snapchat', 'Reddit', 'Tumblr', 'Medium', 'Quora', 'Clubhouse', 'Twitch', 'Blog', 'Website'
        ]
        if platform not in valid_platforms:
            return jsonify({'error': f'Plataforma no soportada: {platform}'}), 400

        api_url = f"https://ai-social-media-content-generator-viral-content-creator.p.rapidapi.com/{platform}?noqueue=1"
        rapidapi_key = current_app.config.get('RAPIDAPI_KEY')
        rapidapi_host = current_app.config.get('RAPIDAPI_SOCIAL_MEDIA_CONTENT_HOST')
        print(f"RAPIDAPI KEY: {rapidapi_key}")
        print(f"RAPIDAPI HOST: {rapidapi_host}")
        headers = {
            "x-rapidapi-key": rapidapi_key,
            "x-rapidapi-host": rapidapi_host,
            "Content-Type": "application/json"
        }
        proxy_secret = current_app.config.get('RAPIDAPI_SOCIAL_MEDIA_CONTENT_PROXY_SECRET')
        if proxy_secret:
            headers['x-rapidapi-proxy-secret'] = proxy_secret

        payload = {
            "text": text,
            "lang": lang,
            "length": length
        }

        print(f"Payload: {payload}")
        print(f"Headers: {headers}")
        print(f"URL: {api_url}")

        response = requests.post(api_url, json=payload, headers=headers, timeout=20)
        print(f"RapidAPI Status: {response.status_code}")
        print(f"RapidAPI Response: {response.text}")

        if response.status_code != 200:
            return jsonify({'error': 'Error en la API externa', 'details': response.text}), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[SocialMediaContent] Error de conexión: {str(e)}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(e)}), 502
    except Exception as e:
        print(f"[SocialMediaContent] Error interno: {str(e)}")
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500 