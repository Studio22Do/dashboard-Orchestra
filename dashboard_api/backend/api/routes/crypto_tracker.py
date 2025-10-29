from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
import logging
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

crypto_tracker_bp = Blueprint('crypto_tracker', __name__)

TOKEN_METRICS_API_BASE = "https://token-metrics-api1.p.rapidapi.com"
TOKEN_METRICS_HOST = "token-metrics-api1.p.rapidapi.com"

def get_token_metrics_headers():
    return {
        "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
        "x-rapidapi-host": TOKEN_METRICS_HOST,
        "accept": "application/json"
    }

@crypto_tracker_bp.route('/daily-ohlcv', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_daily_ohlcv():
    """Obtener datos OHLCV diarios"""
    try:
        data = request.get_json() or {}
        limit = data.get('limit', '50')
        page = data.get('page', '1')
        
        url = f"{TOKEN_METRICS_API_BASE}/v2/daily-ohlcv"
        headers = get_token_metrics_headers()
        params = {
            'limit': limit,
            'page': page
        }
        
        logger.info(f"[CryptoTracker] Obteniendo datos OHLCV diarios, limit: {limit}, page: {page}")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        return jsonify({
            'status': 'success',
            'data': data,
            'limit': limit,
            'page': page,
            'message': 'Datos OHLCV diarios obtenidos exitosamente'
        }), 200
        
    except Exception as e:
        logger.error(f"Error en get_daily_ohlcv: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@crypto_tracker_bp.route('/hourly-ohlcv', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_hourly_ohlcv():
    """Obtener datos OHLCV por hora"""
    try:
        data = request.get_json() or {}
        limit = data.get('limit', '50')
        page = data.get('page', '1')
        
        url = f"{TOKEN_METRICS_API_BASE}/v2/hourly-ohlcv"
        headers = get_token_metrics_headers()
        params = {
            'limit': limit,
            'page': page
        }
        
        logger.info(f"[CryptoTracker] Obteniendo datos OHLCV por hora, limit: {limit}, page: {page}")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        return jsonify({
            'status': 'success',
            'data': data,
            'limit': limit,
            'page': page,
            'message': 'Datos OHLCV por hora obtenidos exitosamente'
        }), 200
        
    except Exception as e:
        logger.error(f"Error en get_hourly_ohlcv: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@crypto_tracker_bp.route('/market-overview', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_market_overview():
    """Obtener resumen del mercado (top gainers/losers)"""
    try:
        url = f"{TOKEN_METRICS_API_BASE}/v2/daily-ohlcv"
        headers = get_token_metrics_headers()
        params = {'limit': '100', 'page': '1'}
        
        logger.info(f"[CryptoTracker] Obteniendo resumen del mercado")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list):
            # Filtrar tokens con datos válidos
            valid_tokens = []
            for token in data['data']:
                if all(key in token for key in ['TOKEN_SYMBOL', 'CLOSE', 'VOLUME', 'OPEN']):
                    valid_tokens.append(token)
            
            # Calcular cambio de precio para cada token
            for token in valid_tokens:
                if float(token.get('OPEN', 0)) > 0:
                    token['price_change'] = ((float(token.get('CLOSE', 0)) - float(token.get('OPEN', 0))) / float(token.get('OPEN', 0))) * 100
                else:
                    token['price_change'] = 0
            
            # Top gainers (mayor subida)
            top_gainers = sorted(valid_tokens, key=lambda x: x.get('price_change', 0), reverse=True)[:10]
            
            # Top losers (mayor bajada)
            top_losers = sorted(valid_tokens, key=lambda x: x.get('price_change', 0))[:10]
            
            # Tokens con mayor volumen
            highest_volume = sorted(valid_tokens, key=lambda x: float(x.get('VOLUME', 0)), reverse=True)[:10]
            
            # Determinar tendencia del mercado
            avg_change = sum(token.get('price_change', 0) for token in valid_tokens) / len(valid_tokens) if valid_tokens else 0
            market_trend = 'bullish' if avg_change > 2 else 'bearish' if avg_change < -2 else 'neutral'
            
            return jsonify({
                'status': 'success',
                'data': {
                    'top_gainers': top_gainers,
                    'top_losers': top_losers,
                    'highest_volume': highest_volume,
                    'market_trend': market_trend,
                    'total_tokens': len(valid_tokens)
                },
                'message': 'Resumen del mercado obtenido exitosamente'
            }), 200
        else:
            return jsonify({
                'status': 'success',
                'data': {'message': 'No hay datos disponibles'},
                'message': 'Resumen del mercado obtenido exitosamente'
            }), 200
        
    except Exception as e:
        logger.error(f"Error en get_market_overview: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@crypto_tracker_bp.route('/top-tokens', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_top_tokens():
    """Obtener tokens más populares por volumen y cambio de precio"""
    try:
        url = f"{TOKEN_METRICS_API_BASE}/v2/daily-ohlcv"
        headers = get_token_metrics_headers()
        params = {'limit': '100', 'page': '1'}
        
        logger.info(f"[CryptoTracker] Obteniendo tokens más populares")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list):
            # Filtrar tokens con datos válidos
            valid_tokens = []
            for token in data['data']:
                if all(key in token for key in ['TOKEN_SYMBOL', 'CLOSE', 'VOLUME', 'OPEN']):
                    valid_tokens.append(token)
            
            # Ordenar por volumen (más popular)
            top_by_volume = sorted(valid_tokens, 
                                 key=lambda x: float(x.get('VOLUME', 0)), reverse=True)[:20]
            
            # Ordenar por cambio de precio (más volátil)
            top_by_change = sorted(valid_tokens, 
                                 key=lambda x: abs(float(x.get('CLOSE', 0)) - abs(float(x.get('OPEN', 0))), reverse=True)[:20])
            
            return jsonify({
                'status': 'success',
                'data': {
                    'top_by_volume': top_by_volume,
                    'top_by_change': top_by_change,
                    'total_tokens': len(valid_tokens)
                },
                'message': 'Tokens más populares obtenidos exitosamente'
            }), 200
        else:
            return jsonify({
                'status': 'success',
                'data': {'message': 'No hay datos disponibles'},
                'message': 'Tokens más populares obtenidos exitosamente'
            }), 200
        
    except Exception as e:
        logger.error(f"Error en get_top_tokens: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@crypto_tracker_bp.route('/real-time', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_real_time_data():
    """Obtener datos en tiempo real (usando datos por hora como aproximación)"""
    try:
        url = f"{TOKEN_METRICS_API_BASE}/v2/hourly-ohlcv"
        headers = get_token_metrics_headers()
        params = {'limit': '50', 'page': '1'}
        
        logger.info(f"[CryptoTracker] Obteniendo datos en tiempo real")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list):
            real_time_data = []
            for token in data['data'][:20]:  # Solo los primeros 20 para tiempo real
                if 'TOKEN_SYMBOL' in token:
                    real_time_info = {
                        'symbol': token.get('TOKEN_SYMBOL', 'Unknown'),
                        'current_price': token.get('CLOSE', 0),
                        'price_change_1h': 0,  # Calcularemos esto después
                        'volume_1h': token.get('VOLUME', 0),
                        'last_updated': token.get('TIMESTAMP', 'Unknown'),
                        'high_1h': token.get('HIGH', 0),
                        'low_1h': token.get('LOW', 0)
                    }
                    real_time_data.append(real_time_info)
            
            return jsonify({
                'status': 'success',
                'data': {
                    'real_time_tokens': real_time_data,
                    'total_tokens': len(real_time_data),
                    'update_time': 'hourly'
                },
                'message': 'Datos en tiempo real obtenidos exitosamente'
            }), 200
        else:
            return jsonify({
                'status': 'success',
                'data': {'message': 'No hay datos en tiempo real disponibles'},
                'message': 'Datos en tiempo real obtenidos exitosamente'
            }), 200
        
    except Exception as e:
        logger.error(f"Error en get_real_time_data: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@crypto_tracker_bp.route('/token-list', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def get_token_list():
    """Obtener lista completa de tokens disponibles"""
    try:
        data = request.get_json() or {}
        limit = data.get('limit', '100')
        page = data.get('page', '1')
        
        url = f"{TOKEN_METRICS_API_BASE}/v2/daily-ohlcv"
        headers = get_token_metrics_headers()
        params = {
            'limit': limit,
            'page': page
        }
        
        logger.info(f"[CryptoTracker] Obteniendo lista de tokens, limit: {limit}, page: {page}")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error al obtener datos de Token Metrics API',
                'details': response.text,
                'status_code': response.status_code
            }), response.status_code
        
        data = response.json()
        
        # Procesar lista de tokens
        if 'data' in data and isinstance(data['data'], list):
            token_list = []
            for token in data['data']:
                if 'TOKEN_SYMBOL' in token:
                    token_info = {
                        'symbol': token.get('TOKEN_SYMBOL', 'Unknown'),
                        'name': token.get('TOKEN_NAME', 'Unknown'),
                        'current_price': token.get('CLOSE', 0),
                        'price_change_24h': 0,  # Calcularemos esto después
                        'volume_24h': token.get('VOLUME', 0),
                        'market_cap': token.get('market_cap', 0) if 'market_cap' in token else None
                    }
                    token_list.append(token_info)
            
            return jsonify({
                'status': 'success',
                'data': {
                    'tokens': token_list,
                    'total_tokens': len(token_list),
                    'limit': limit,
                    'page': page
                },
                'message': 'Lista de tokens obtenida exitosamente'
            }), 200
        else:
            return jsonify({
                'status': 'success',
                'data': {'message': 'No hay tokens disponibles'},
                'message': 'Lista de tokens obtenida exitosamente'
            }), 200
        
    except Exception as e:
        logger.error(f"Error en get_token_list: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500
