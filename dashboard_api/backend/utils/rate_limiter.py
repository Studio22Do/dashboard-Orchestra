from functools import wraps
from flask import request, jsonify, current_app
from datetime import datetime, timedelta
import redis
import json

# Configuración de Redis para rate limiting
redis_client = None

def init_redis():
    """Inicializar conexión a Redis"""
    global redis_client
    try:
        redis_client = redis.Redis(
            host=current_app.config.get('REDIS_HOST', 'localhost'),
            port=current_app.config.get('REDIS_PORT', 6379),
            db=current_app.config.get('REDIS_DB', 0),
            decode_responses=True
        )
        # Test de conexión
        redis_client.ping()
        return True
    except Exception as e:
        current_app.logger.warning(f"No se pudo conectar a Redis: {e}")
        return False

def get_rate_limit_key(identifier):
    """Generar clave para rate limiting"""
    version = current_app.config.get('MODE', 'beta_v1')
    return f"rate_limit:{version}:{identifier}"

def check_rate_limit(identifier):
    """Verificar si el usuario ha excedido el límite de rate"""
    if not redis_client:
        return True  # Si no hay Redis, permitir todas las requests
    
    version_config = current_app.config.get_version_config()
    max_requests = version_config['rate_limit_per_hour']
    
    key = get_rate_limit_key(identifier)
    current_time = datetime.utcnow()
    window_start = current_time - timedelta(hours=1)
    
    # Obtener requests en la última hora
    requests = redis_client.zrangebyscore(key, window_start.timestamp(), '+inf')
    
    if len(requests) >= max_requests:
        return False
    
    # Agregar nueva request
    redis_client.zadd(key, {current_time.timestamp(): current_time.timestamp()})
    redis_client.expire(key, 3600)  # Expirar en 1 hora
    
    return True

def rate_limit_by_ip(f):
    """Decorador para rate limiting por IP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_app.config.get('MODE') == 'beta_v1':
            return f(*args, **kwargs)  # Solo aplicar rate limiting en beta_v1
        
        client_ip = request.remote_addr
        if not check_rate_limit(client_ip):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': 'Has excedido el límite de requests por hora',
                'limit': current_app.config.get_version_config()['rate_limit_per_hour']
            }), 429
        
        return f(*args, **kwargs)
    return decorated_function

def rate_limit_by_user(f):
    """Decorador para rate limiting por usuario autenticado"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_app.config.get('MODE') == 'beta_v2':
            return f(*args, **kwargs)  # Solo aplicar rate limiting en beta_v2
        
        # Obtener usuario del token JWT
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        if not check_rate_limit(f"user:{user_id}"):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': 'Has excedido el límite de requests por hora',
                'limit': current_app.config.get_version_config()['rate_limit_per_hour']
            }), 429
        
        return f(*args, **kwargs)
    return decorated_function

def get_usage_stats(identifier):
    """Obtener estadísticas de uso para un identificador"""
    if not redis_client:
        return {'requests': 0, 'limit': 0}
    
    version_config = current_app.config.get_version_config()
    key = get_rate_limit_key(identifier)
    current_time = datetime.utcnow()
    window_start = current_time - timedelta(hours=1)
    
    requests = redis_client.zrangebyscore(key, window_start.timestamp(), '+inf')
    
    return {
        'requests': len(requests),
        'limit': version_config['rate_limit_per_hour'],
        'remaining': max(0, version_config['rate_limit_per_hour'] - len(requests))
    } 