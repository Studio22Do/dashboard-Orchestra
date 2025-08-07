import requests
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required
import os
import logging
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

# Crear blueprint
google_news_bp = Blueprint('google_news', __name__)

def get_headers():
    """Obtiene los headers para la API de Google News"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": current_app.config['GOOGLE_NEWS_API_HOST']
    }

def make_api_request(endpoint, params=None):
    """Realiza una petición a la API de Google News"""
    try:
        url = f"{current_app.config['GOOGLE_NEWS_API_BASE_URL']}/{endpoint}"
        params = params or {}
        headers = get_headers()
        
        logger.debug(f"Realizando petición a Google News API: {url}")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error en petición a Google News API: {str(e)}")
        raise

@google_news_bp.route('/latest', methods=['GET'])
def get_latest_news():
    """Obtiene las últimas noticias"""
    lr = request.args.get('lr', current_app.config['GOOGLE_NEWS_DEFAULT_LANGUAGE'])
    
    try:
        news = make_api_request('latest', {'lr': lr})
        return jsonify(news)
    except Exception as e:
        logger.error(f"Error obteniendo últimas noticias: {str(e)}")
        return jsonify({'error': 'Error al obtener las noticias'}), 500

@google_news_bp.route('/world', methods=['GET'])
def get_world_news():
    """Obtiene noticias mundiales"""
    lr = request.args.get('lr', current_app.config['GOOGLE_NEWS_DEFAULT_LANGUAGE'])
    
    try:
        news = make_api_request('world', {'lr': lr})
        return jsonify(news)
    except Exception as e:
        logger.error(f"Error obteniendo noticias mundiales: {str(e)}")
        return jsonify({'error': 'Error al obtener las noticias mundiales'}), 500

@google_news_bp.route('/category/<category>', methods=['GET'])
def get_category_news(category):
    """Obtiene noticias por categoría"""
    valid_categories = ['business', 'entertainment', 'health', 'science', 'sport', 'technology']
    
    if category not in valid_categories:
        return jsonify({'error': 'Categoría no válida'}), 400
    
    lr = request.args.get('lr', current_app.config['GOOGLE_NEWS_DEFAULT_LANGUAGE'])
    
    try:
        news = make_api_request(category, {'lr': lr})
        return jsonify(news)
    except Exception as e:
        logger.error(f"Error obteniendo noticias de {category}: {str(e)}")
        return jsonify({'error': f'Error al obtener las noticias de {category}'}), 500

@google_news_bp.route('/search', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def search_news():
    """Busca noticias por palabra clave"""
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Se requiere una palabra clave para buscar'}), 400
    
    lr = request.args.get('lr', current_app.config['GOOGLE_NEWS_DEFAULT_LANGUAGE'])
    
    try:
        news = make_api_request('search', {'keyword': keyword, 'lr': lr})
        return jsonify(news)
    except Exception as e:
        logger.error(f"Error en búsqueda de noticias: {str(e)}")
        return jsonify({'error': 'Error en la búsqueda de noticias'}), 500

@google_news_bp.route('/search/suggest', methods=['GET'])
def get_search_suggestions():
    """Obtiene sugerencias de búsqueda"""
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Se requiere una palabra clave'}), 400
    
    lr = request.args.get('lr', current_app.config['GOOGLE_NEWS_DEFAULT_LANGUAGE'])
    
    try:
        suggestions = make_api_request('search/suggest', {'keyword': keyword, 'lr': lr})
        return jsonify(suggestions)
    except Exception as e:
        logger.error(f"Error obteniendo sugerencias: {str(e)}")
        return jsonify({'error': 'Error al obtener sugerencias'}), 500

@google_news_bp.route('/languages', methods=['GET'])
def get_languages():
    """Obtiene los idiomas disponibles"""
    try:
        languages = make_api_request('languageRegions')
        return jsonify(languages)
    except Exception as e:
        logger.error(f"Error obteniendo idiomas: {str(e)}")
        return jsonify({'error': 'Error al obtener los idiomas disponibles'}), 500 