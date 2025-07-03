from flask import Blueprint, request, jsonify, current_app
import requests

pagespeed_bp = Blueprint('pagespeed_insights', __name__)

@pagespeed_bp.route('/run', methods=['GET'])
def run_pagespeed():
    url_param = request.args.get('url')
    category = request.args.get('category', 'CATEGORY_UNSPECIFIED')
    strategy = request.args.get('strategy', 'STRATEGY_UNSPECIFIED')

    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio.'}), 400

    # Asegurar que la URL tenga https://
    if not url_param.startswith(('http://', 'https://')):
        url_param = 'https://' + url_param

    api_url = "https://pagespeed-insights.p.rapidapi.com/run_pagespeed"
    
    # Validar y mapear categorías
    valid_categories = {
        'performance': 'PERFORMANCE',
        'accessibility': 'ACCESSIBILITY',
        'best-practices': 'BEST_PRACTICES',
        'seo': 'SEO',
        '': 'CATEGORY_UNSPECIFIED'
    }
    
    # Validar y mapear estrategias
    valid_strategies = {
        'desktop': 'DESKTOP',
        'mobile': 'MOBILE',
        '': 'STRATEGY_UNSPECIFIED'
    }

    # Usar los valores mapeados o los valores por defecto
    category = valid_categories.get(category.lower(), 'CATEGORY_UNSPECIFIED')
    strategy = valid_strategies.get(strategy.lower(), 'STRATEGY_UNSPECIFIED')

    params = {
        "url": url_param,
        "category": category,
        "strategy": strategy
    }

    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "pagespeed-insights.p.rapidapi.com"
    }

    current_app.logger.debug("[PageSpeed] Llamando a RapidAPI con:")
    current_app.logger.debug(f"URL: {api_url}")
    current_app.logger.debug(f"Params: {params}")
    current_app.logger.debug(f"Headers: {headers}")

    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=30)
        current_app.logger.debug(f"[PageSpeed] Status: {response.status_code}")
        current_app.logger.debug(f"[PageSpeed] Response: {response.text}")
        
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        current_app.logger.error(f"[PageSpeed] HTTP Error: {errh}")
        current_app.logger.error(f"[PageSpeed] Response: {response.text}")
        return jsonify({
            'error': 'Error en la respuesta de PageSpeed Insights', 
            'details': response.text
        }), response.status_code

    except requests.exceptions.Timeout:
        current_app.logger.error("[PageSpeed] Timeout Error")
        return jsonify({
            'error': 'El análisis está tomando más tiempo de lo esperado. Por favor, intente nuevamente.',
            'details': 'Timeout después de 30 segundos'
        }), 504

    except requests.exceptions.RequestException as err:
        current_app.logger.error(f"[PageSpeed] Request Error: {err}")
        return jsonify({
            'error': 'Error de conexión con PageSpeed Insights', 
            'details': str(err)
        }), 502 