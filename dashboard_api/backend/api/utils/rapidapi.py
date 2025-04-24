"""
Utilidades para manejar llamadas a RapidAPI
"""
import time
import requests
from flask import current_app
from api import db
from api.models.app import ApiUsage
from api.utils.error_handlers import ExternalApiError

def get_rapidapi_headers(host=None):
    """Obtiene los headers necesarios para llamar a RapidAPI"""
    return {
        "x-rapidapi-host": host or current_app.config['RAPIDAPI_INSTAGRAM_HOST'],
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY']
    }

def record_api_usage(app_id, user_id, endpoint, status_code, response_time):
    """Registra el uso de una API en la base de datos"""
    try:
        usage = ApiUsage(
            app_id=app_id,
            user_id=user_id,
            endpoint=endpoint,
            status_code=status_code,
            response_time=response_time
        )
        db.session.add(usage)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error registrando uso de API: {str(e)}")
        return False

def call_rapidapi(app_id, user_id, method, url, params=None, data=None, headers=None):
    """
    Realiza una llamada a RapidAPI y registra su uso
    
    Args:
        app_id (str): ID de la aplicación en nuestra base de datos
        user_id (int): ID del usuario que realiza la solicitud
        method (str): Método HTTP ('GET', 'POST', etc.)
        url (str): URL completa del endpoint
        params (dict, optional): Parámetros de query string
        data (dict, optional): Datos para enviar en el cuerpo (para POST, PUT)
        headers (dict, optional): Headers adicionales
    
    Returns:
        dict: Respuesta de la API
        
    Raises:
        ExternalApiError: Si hay un error en la llamada
    """
    # Preparar headers
    api_headers = {}
    if headers:
        api_headers.update(headers)
    
    # Verificar que la clave de API esté configurada
    if not current_app.config['RAPIDAPI_KEY']:
        raise ExternalApiError("Clave de API de RapidAPI no configurada")
    
    # Construir endpoint para registro (sin incluir host)
    endpoint = url.split('://')[-1].split('/', 1)[-1]
    if params:
        param_str = '&'.join([f"{k}={v}" for k, v in params.items()])
        endpoint = f"{endpoint}?{param_str}"
    
    try:
        # Registrar tiempo de inicio
        start_time = time.time()
        
        # Realizar solicitud HTTP
        if method.upper() == 'GET':
            response = requests.get(url, headers=api_headers, params=params)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=api_headers, params=params, json=data)
        else:
            raise ExternalApiError(f"Método HTTP no soportado: {method}")
        
        # Calcular tiempo de respuesta en ms
        response_time = (time.time() - start_time) * 1000
        
        # Registrar uso
        record_api_usage(
            app_id=app_id,
            user_id=user_id,
            endpoint=endpoint,
            status_code=response.status_code,
            response_time=response_time
        )
        
        # Verificar respuesta
        if response.status_code != 200:
            raise ExternalApiError(f"Error en la API externa: {response.text}")
        
        # Devolver datos JSON
        return response.json()
    
    except requests.RequestException as e:
        current_app.logger.error(f"Error de conexión a RapidAPI: {str(e)}")
        raise ExternalApiError(f"Error de conexión: {str(e)}")
    except ValueError as e:
        current_app.logger.error(f"Error decodificando respuesta JSON: {str(e)}")
        raise ExternalApiError("Respuesta inválida de la API externa")
    except Exception as e:
        current_app.logger.error(f"Error en llamada a RapidAPI: {str(e)}")
        if isinstance(e, ExternalApiError):
            raise e
        raise ExternalApiError(f"Error inesperado: {str(e)}") 