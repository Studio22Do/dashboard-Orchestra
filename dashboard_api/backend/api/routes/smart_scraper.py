from flask import Blueprint, request, jsonify, current_app
import requests
from api.utils.error_handlers import ValidationError

# Crear blueprint
smart_scraper_bp = Blueprint('smart_scraper', __name__)

# ID de aplicación en la base de datos
APP_ID = "smart-scraper"

# Configuración de RapidAPI
RAPIDAPI_KEY = "9dc7412cabmsh04d2de9d55522bap1643f6jsn6e3113942f4a"
RAPIDAPI_HOST = "smart-web-scraper-with-ai.p.rapidapi.com"
BASE_URL = "https://smart-web-scraper-with-ai.p.rapidapi.com/api/v1/scrape"

@smart_scraper_bp.route('/content', methods=['POST'])
def scrape_content():
    """Extrae y analiza contenido de una URL usando IA"""
    try:
        data = request.json
        url = data.get('url')
        prompt = data.get('prompt', "Tell me what is this website about")

        if not url:
            raise ValidationError("Se requiere la URL del sitio web")

        api_url = f"{BASE_URL}/content"
        
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        payload = {
            "url": url,
            "prompt": prompt
        }

        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f"Error al conectar con RapidAPI: {str(e)}",
            'status': 'error'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@smart_scraper_bp.route('/links', methods=['POST'])
def scrape_links():
    """Extrae enlaces de una URL"""
    try:
        data = request.json
        url = data.get('url')

        if not url:
            raise ValidationError("Se requiere la URL del sitio web")

        api_url = f"{BASE_URL}/links"
        
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        payload = {"url": url}

        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f"Error al conectar con RapidAPI: {str(e)}",
            'status': 'error'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@smart_scraper_bp.route('/tables', methods=['POST'])
def scrape_tables():
    """Extrae tablas de una URL"""
    try:
        data = request.json
        url = data.get('url')

        if not url:
            raise ValidationError("Se requiere la URL del sitio web")

        api_url = f"{BASE_URL}/tables"
        
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        payload = {"url": url}

        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f"Error al conectar con RapidAPI: {str(e)}",
            'status': 'error'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@smart_scraper_bp.route('/markdown', methods=['POST'])
def scrape_markdown():
    """Convierte contenido web a markdown"""
    try:
        data = request.json
        url = data.get('url')

        if not url:
            raise ValidationError("Se requiere la URL del sitio web")

        api_url = f"{BASE_URL}/markdown"
        
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        payload = {"url": url}

        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': f"Error al conectar con RapidAPI: {str(e)}",
            'status': 'error'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500 