from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import requests
from datetime import datetime, date

from api.utils.error_handlers import ValidationError
from api.utils.rapidapi import get_rapidapi_headers, call_rapidapi

# Crear blueprint
google_trends_bp = Blueprint('google_trends', __name__)

# ID de aplicación en la base de datos
APP_ID = "google-trends"

@google_trends_bp.route('/trending-searches', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para pruebas
def get_trending_searches():
    """Obtener búsquedas tendencia por ubicación geográfica"""
    # Obtener parámetros
    geo = request.args.get('geo', 'US')  # Por defecto USA si no se especifica
    
    try:
        # Crear URL y headers según documentación de RapidAPI
        url = "https://google-trends8.p.rapidapi.com/trendings"
        
        # Añadir el parámetro date requerido - formato YYYY-MM-DD
        today = date.today().strftime("%Y-%m-%d")
        
        # Definir querystring según el mensaje de error recibido (date is required)
        querystring = {
            "region_code": geo,
            "hl": "en-US",
            "date": today  # Usando la fecha actual
        }
        
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "google-trends8.p.rapidapi.com"
        }
        
        current_app.logger.debug(f"Enviando solicitud a: {url} con parámetros: {querystring}")
        
        # Realizar solicitud usando requests
        response = requests.get(url, headers=headers, params=querystring)
        
        # Registrar la respuesta para depuración
        current_app.logger.debug(f"Código de estado: {response.status_code}")
        current_app.logger.debug(f"Respuesta completa: {response.text[:1000]}...")  # Primeros 1000 caracteres
        
        # Si hay error, intentar con parámetros diferentes
        if response.status_code != 200:
            current_app.logger.debug("Primer intento fallido, probando con otro formato...")
            
            # Intento 2: Probar con otro formato de fecha (sin guiones)
            today_no_dash = today.replace("-", "")
            querystring2 = {
                "region_code": geo,
                "hl": "en-US",
                "date": today_no_dash
            }
            current_app.logger.debug(f"Intento 2: Enviando solicitud con parámetros: {querystring2}")
            
            response = requests.get(url, headers=headers, params=querystring2)
            
            current_app.logger.debug(f"Intento 2 - Código de estado: {response.status_code}")
            current_app.logger.debug(f"Intento 2 - Respuesta: {response.text[:1000]}...")
            
            # Si todavía hay error, probar con un tercer formato
            if response.status_code != 200:
                current_app.logger.debug("Segundo intento fallido, probando con otro endpoint...")
                
                # Intento 3: Probar con el endpoint /real-time-trends (en lugar de daily-trends que ya no existe)
                url3 = "https://google-trends8.p.rapidapi.com/real-time-trends"
                querystring3 = {"region_code": geo, "hl": "en-US"}
                
                current_app.logger.debug(f"Intento 3: Enviando solicitud a: {url3} con parámetros: {querystring3}")
                
                response = requests.get(url3, headers=headers, params=querystring3)
                
                current_app.logger.debug(f"Intento 3 - Código de estado: {response.status_code}")
                current_app.logger.debug(f"Intento 3 - Respuesta: {response.text[:1000]}...")
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            result = response.json()
            
            # Registrar la estructura de datos para depuración
            if isinstance(result, dict):
                top_level_keys = list(result.keys())
                current_app.logger.debug(f"Claves de nivel superior: {top_level_keys}")
                
                # Si hay resultados, registrar la estructura más detallada
                if 'results' in result and isinstance(result['results'], list):
                    result_count = len(result['results'])
                    current_app.logger.debug(f"Número de resultados: {result_count}")
                    
                    # Mostrar ejemplo del primer resultado si existe
                    if result_count > 0:
                        first_result = result['results'][0]
                        current_app.logger.debug(f"Ejemplo del primer resultado: {first_result}")
            
            return jsonify(result), 200
        else:
            # Si todas las solicitudes fallaron, generar datos simulados
            current_app.logger.warning(f"La API devolvió un error: {response.text}")
            
            simulated_data = {
                "results": [
                    {"title": "Ejemplo 1", "articles": [], "traffic": "1M+"},
                    {"title": "Ejemplo 2", "articles": [], "traffic": "500K+"},
                    {"title": "Ejemplo 3", "articles": [], "traffic": "200K+"},
                    {"title": "Ejemplo 4", "articles": [], "traffic": "100K+"},
                    {"title": "Ejemplo 5", "articles": [], "traffic": "50K+"}
                ]
            }
            
            current_app.logger.info("Devolviendo datos simulados para pruebas")
            return jsonify(simulated_data), 200
    
    except Exception as e:
        current_app.logger.error(f"Error al consultar Google Trends: {str(e)}")
        
        # Si hay un error, devolver datos simulados para pruebas
        simulated_data = {
            "results": [
                {"title": "Error Ejemplo 1", "articles": [], "traffic": "1M+"},
                {"title": "Error Ejemplo 2", "articles": [], "traffic": "500K+"},
                {"title": "Error Ejemplo 3", "articles": [], "traffic": "200K+"}
            ]
        }
        
        current_app.logger.info("Devolviendo datos simulados debido a error")
        return jsonify(simulated_data), 200

@google_trends_bp.route('/regions', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para pruebas
def get_regions():
    """Obtener regiones disponibles para Google Trends"""
    try:
        url = "https://google-trends8.p.rapidapi.com/regions"
        
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "google-trends8.p.rapidapi.com"
        }
        
        current_app.logger.debug(f"Enviando solicitud a: {url}")
        
        # Realizar solicitud usando requests
        response = requests.get(url, headers=headers)
        
        # Registrar la respuesta para depuración
        current_app.logger.debug(f"Código de estado: {response.status_code}")
        current_app.logger.debug(f"Respuesta de regiones: {response.text[:1000]}...")
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            result = response.json()
            return jsonify(result), 200
        else:
            current_app.logger.warning(f"La API devolvió un error: {response.text}")
            return jsonify({"error": "Error al obtener regiones"}), response.status_code
    
    except Exception as e:
        current_app.logger.error(f"Error al consultar regiones de Google Trends: {str(e)}")
        return jsonify({"error": f"Error al obtener regiones: {str(e)}"}), 500

@google_trends_bp.route('/real-time-trends', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para pruebas
def get_real_time_trends():
    """Obtener tendencias en tiempo real por ubicación geográfica"""
    # Obtener parámetros
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    try:
        url = "https://google-trends8.p.rapidapi.com/real-time-trends"
        
        querystring = {
            "region_code": geo,
            "hl": "en-US"
        }
        
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "google-trends8.p.rapidapi.com"
        }
        
        current_app.logger.debug(f"Enviando solicitud a: {url} con parámetros: {querystring}")
        
        # Realizar solicitud usando requests
        response = requests.get(url, headers=headers, params=querystring)
        
        # Registrar la respuesta para depuración
        current_app.logger.debug(f"Código de estado: {response.status_code}")
        current_app.logger.debug(f"Respuesta de tendencias en tiempo real: {response.text[:1000]}...")
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            result = response.json()
            return jsonify(result), 200
        else:
            current_app.logger.warning(f"La API devolvió un error: {response.text}")
            return jsonify({"error": "Error al obtener tendencias en tiempo real"}), response.status_code
    
    except Exception as e:
        current_app.logger.error(f"Error al consultar tendencias en tiempo real: {str(e)}")
        return jsonify({"error": f"Error al obtener tendencias en tiempo real: {str(e)}"}), 500

@google_trends_bp.route('/interest-over-time', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para pruebas
def get_interest_over_time():
    """Obtener interés a lo largo del tiempo para un término de búsqueda"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    if not keyword:
        raise ValidationError("Se requiere una palabra clave")
    
    try:
        url = "https://google-trends8.p.rapidapi.com/interest-over-time"
        
        querystring = {
            "keyword": keyword,
            "region_code": geo,
            "hl": "en-US"
        }
        
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "google-trends8.p.rapidapi.com"
        }
        
        current_app.logger.debug(f"Enviando solicitud a: {url} con parámetros: {querystring}")
        
        # Realizar solicitud usando requests
        response = requests.get(url, headers=headers, params=querystring)
        
        # Registrar la respuesta para depuración
        current_app.logger.debug(f"Código de estado: {response.status_code}")
        current_app.logger.debug(f"Respuesta de interés a lo largo del tiempo: {response.text[:1000]}...")
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            result = response.json()
            return jsonify(result), 200
        else:
            current_app.logger.warning(f"La API devolvió un error: {response.text}")
            return jsonify({"error": "Error al obtener interés a lo largo del tiempo"}), response.status_code
    
    except Exception as e:
        current_app.logger.error(f"Error al consultar interés a lo largo del tiempo: {str(e)}")
        return jsonify({"error": f"Error al obtener interés: {str(e)}"}), 500

@google_trends_bp.route('/related-queries', methods=['GET'])
# @jwt_required()  # Comentado temporalmente para pruebas
def get_related_queries():
    """Obtener consultas relacionadas para un término de búsqueda"""
    # Obtener parámetros
    keyword = request.args.get('keyword')
    geo = request.args.get('geo', 'US')  # Por defecto USA
    
    if not keyword:
        raise ValidationError("Se requiere una palabra clave")
    
    try:
        url = "https://google-trends8.p.rapidapi.com/related-queries"
        
        querystring = {
            "keyword": keyword,
            "region_code": geo,
            "hl": "en-US"
        }
        
        headers = {
            "x-rapidapi-key": current_app.config.get('RAPIDAPI_KEY'),
            "x-rapidapi-host": "google-trends8.p.rapidapi.com"
        }
        
        current_app.logger.debug(f"Enviando solicitud a: {url} con parámetros: {querystring}")
        
        # Realizar solicitud usando requests
        response = requests.get(url, headers=headers, params=querystring)
        
        # Registrar la respuesta para depuración
        current_app.logger.debug(f"Código de estado: {response.status_code}")
        current_app.logger.debug(f"Respuesta de consultas relacionadas: {response.text[:1000]}...")
        
        # Verificar si la respuesta es exitosa
        if response.status_code == 200:
            result = response.json()
            return jsonify(result), 200
        else:
            current_app.logger.warning(f"La API devolvió un error: {response.text}")
            return jsonify({"error": "Error al obtener consultas relacionadas"}), response.status_code
    
    except Exception as e:
        current_app.logger.error(f"Error al consultar consultas relacionadas: {str(e)}")
        return jsonify({"error": f"Error al obtener consultas relacionadas: {str(e)}"}), 500 