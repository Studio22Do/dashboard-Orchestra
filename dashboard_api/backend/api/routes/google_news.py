import logging
import requests
from flask import Blueprint, jsonify, current_app, request, Response
from flask_jwt_extended import jwt_required
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

google_news_bp = Blueprint('google_news', __name__)

def get_headers():
    """Obtiene los headers necesarios para la API de Google News"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "google-news13.p.rapidapi.com"
    }

@google_news_bp.route('/world', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_world_news():
    """Obtiene noticias del mundo"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/world"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias del mundo con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News world: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias del mundo'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/latest', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_latest_news():
    """Obtiene las últimas noticias"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/latest"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo últimas noticias con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News latest: {str(e)}")
        return jsonify({'error': 'Error al obtener últimas noticias'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/business', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_business_news():
    """Obtiene noticias de negocios"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/business"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de negocios con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News business: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de negocios'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/entertainment', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_entertainment_news():
    """Obtiene noticias de entretenimiento"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/entertainment"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de entretenimiento con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News entertainment: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de entretenimiento'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/health', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_health_news():
    """Obtiene noticias de salud"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/health"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de salud con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News health: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de salud'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/science', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_science_news():
    """Obtiene noticias de ciencia"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/science"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de ciencia con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News science: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de ciencia'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/sport', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_sport_news():
    """Obtiene noticias de deportes"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/sport"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de deportes con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News sport: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de deportes'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/technology', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_technology_news():
    """Obtiene noticias de tecnología"""
    try:
        lr = request.args.get('lr', 'es-ES')
        
        url = "https://google-news13.p.rapidapi.com/technology"
        headers = get_headers()
        params = {"lr": lr}
        
        logger.info(f"Obteniendo noticias de tecnología con lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News technology: {str(e)}")
        return jsonify({'error': 'Error al obtener noticias de tecnología'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/search', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def search_news():
    """Busca noticias por palabra clave"""
    try:
        keyword = request.args.get('keyword')
        lr = request.args.get('lr', 'es-ES')
        
        if not keyword:
            return jsonify({'error': 'Se requiere el parámetro keyword'}), 400
        
        url = "https://google-news13.p.rapidapi.com/search"
        headers = get_headers()
        params = {"keyword": keyword, "lr": lr}
        
        logger.info(f"Buscando noticias con keyword: {keyword}, lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News search: {str(e)}")
        return jsonify({'error': 'Error al buscar noticias'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/search/suggest', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_search_suggestions():
    """Obtiene sugerencias de búsqueda"""
    try:
        keyword = request.args.get('keyword')
        lr = request.args.get('lr', 'es-ES')
        
        if not keyword:
            return jsonify({'error': 'Se requiere el parámetro keyword'}), 400
        
        url = "https://google-news13.p.rapidapi.com/search/suggest"
        headers = get_headers()
        params = {"keyword": keyword, "lr": lr}
        
        logger.info(f"Obteniendo sugerencias para keyword: {keyword}, lr: {lr}")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News search/suggest: {str(e)}")
        return jsonify({'error': 'Error al obtener sugerencias'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@google_news_bp.route('/language-regions', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def get_language_regions():
    """Obtiene las regiones de idioma disponibles"""
    try:
        url = "https://google-news13.p.rapidapi.com/languageRegions"
        headers = get_headers()
        
        logger.info("Obteniendo regiones de idioma disponibles")
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en Google News language-regions: {str(e)}")
        return jsonify({'error': 'Error al obtener regiones de idioma'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500 

@google_news_bp.route('/proxy-image')
def proxy_image():
    """Proxy optimizado para imágenes de Google News"""
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({'error': 'URL de imagen requerida'}), 400
    
    try:
        # Configurar headers para simular un navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # Timeout más corto para mejor rendimiento
        response = requests.get(
            image_url, 
            headers=headers, 
            stream=True, 
            timeout=5,
            allow_redirects=True
        )
        response.raise_for_status()
        
        # Configurar headers de respuesta optimizados
        response_headers = {
            'Content-Type': response.headers.get('Content-Type', 'image/jpeg'),
            'Cache-Control': 'public, max-age=86400',  # Cache por 24 horas
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        
        # Stream de la imagen en chunks más pequeños para mejor rendimiento
        return Response(
            response.iter_content(chunk_size=4096), 
            content_type=response.headers.get('Content-Type'),
            headers=response_headers
        )
        
    except requests.exceptions.Timeout:
        logger.warning(f"Timeout al obtener imagen: {image_url}")
        return jsonify({'error': 'Timeout al obtener imagen'}), 408
    except requests.exceptions.ConnectionError as e:
        logger.warning(f"Error de conexión al obtener imagen: {image_url} - {str(e)}")
        return jsonify({'error': 'Error de conexión'}), 503
    except Exception as e:
        logger.error(f"Error al obtener imagen: {str(e)}")
        return jsonify({'error': 'Error al obtener imagen'}), 500 