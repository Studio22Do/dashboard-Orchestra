from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
import logging
import json
import asyncio
import aiohttp
import hashlib
import time
from urllib.parse import urlparse
from api.utils.decorators import credits_required

website_analyzer_pro_bp = Blueprint('website_analyzer_pro', __name__)
logger = logging.getLogger(__name__)

def print_analysis_results(data_type, response):
    """Imprime los resultados del análisis de forma organizada"""
    print(f"\n=== {data_type} ===")
    
    # Detectar si es aiohttp o requests
    if hasattr(response, 'status'):
        # Es aiohttp
        status = response.status
        print(f"Status: {status}")
    elif hasattr(response, 'status_code'):
        # Es requests
        status = response.status_code
        print(f"Status: {status}")
    else:
        print("Status: Desconocido")
        return
    
    try:
        # Para aiohttp, necesitamos usar response.json() de forma asíncrona
        if hasattr(response, 'status'):  # aiohttp
            # No podemos usar response.json() aquí porque es asíncrono
            print("✅ Respuesta aiohttp recibida")
            return
        else:  # requests
            data = response.json()
            if data_type == "Velocidad":
                if 'data' in data:
                    print("🚀 Métricas:")
                    print(f"- Tiempo total: {data['data'].get('total_time', 'N/A')}s")
                    print(f"- Tamaño descarga: {data['data'].get('size_download', 'N/A')} bytes")
                    print(f"- Velocidad descarga: {data['data'].get('speed_download', 'N/A')} bytes/s")
            
            elif data_type == "SEO":
                if 'basic' in data:
                    print("🔍 Información básica:")
                    print(f"- Título: {data['basic'].get('title', 'N/A')}")
                    print(f"- Longitud título: {data.get('webtitle', {}).get('length', 'N/A')} caracteres")
                    print(f"- Meta descripción: {data.get('metadescription', {}).get('length', 'N/A')} caracteres")
                    print(f"- Imágenes: {data['data'].get('images', {}).get('count', 'N/A')}")
                    print(f"- Enlaces: {data['data'].get('links', {}).get('count', 'N/A')}")
            
            elif data_type == "Dominio":
                if 'age' in data:
                    print("🌐 Información del dominio:")
                    print(f"- Edad: {data['age'].get('domainAge', 'N/A')}")
                    print(f"- Creado: {data['age'].get('createdDate', 'N/A')}")
                    print(f"- Actualizado: {data['age'].get('updatedDate', 'N/A')}")
            
            elif data_type == "Backlinks":
                if 'counts' in data:
                    counts = data['counts'].get('backlinks', {})
                    print("🔗 Estadísticas:")
                    print(f"- Total: {counts.get('total', 0)}")
                    print(f"- DoFollow: {counts.get('doFollow', 0)}")
                    print(f"- A página principal: {counts.get('toHomePage', 0)}")
                    domains = data['counts'].get('domains', {})
                    print(f"- Dominios únicos: {domains.get('total', 0)}")
            
            elif data_type == "Keywords":
                if isinstance(data, list) and len(data) > 0:
                    print("🎯 Top 5 Keywords:")
                    for kw in data[:5]:
                        print(f"- {kw.get('keyword', 'N/A')}")
                        print(f"  Posición: {kw.get('position', 'N/A')} | Volumen: {kw.get('volume', 'N/A')}")
    
    except json.JSONDecodeError:
        print("❌ Error decodificando JSON")
        if hasattr(response, 'text'):
            print(f"Respuesta raw: {response.text[:200]}...")
        else:
            print("Respuesta raw: No disponible")

async def make_api_call(session, url, params, data_type):
    """Hace una llamada a la API de RapidAPI de forma asíncrona"""
    try:
        timeout = aiohttp.ClientTimeout(total=60)  # 60 segundos de timeout
        async with session.get(url, params=params, timeout=timeout) as response:
            print_analysis_results(data_type, response)
            if response.status == 200:
                try:
                    return await response.json()
                except:
                    return None
            return None
    except Exception as e:
        print(f"❌ Error en {data_type}: {str(e)}")
        return None

@website_analyzer_pro_bp.route('', methods=['OPTIONS'])
@website_analyzer_pro_bp.route('/', methods=['OPTIONS'])
def handle_options():
    """Manejar peticiones OPTIONS para CORS"""
    return '', 200

@website_analyzer_pro_bp.route('/full-analysis', methods=['GET'])
@jwt_required()
@credits_required(amount=2)  # Análisis completo cuesta 2 puntos
def full_analysis():
    """Realiza un análisis completo del sitio web incluyendo velocidad, SEO y dominio"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        # Sistema de cache: verificar si ya tenemos resultados recientes
        cache_key = hashlib.md5(url.encode()).hexdigest()
        cache_duration = 3600  # 1 hora en segundos
        
        # Verificar cache (simulado con diccionario en memoria)
        if hasattr(current_app, 'website_analysis_cache'):
            cached_result = current_app.website_analysis_cache.get(cache_key)
            if cached_result and (time.time() - cached_result['timestamp']) < cache_duration:
                print(f"✅ Resultado encontrado en cache para: {url}")
                return jsonify(cached_result['data']), 200
        else:
            current_app.website_analysis_cache = {}
        
        # Extraer el dominio de la URL
        domain = urlparse(url).netloc
        if not domain:
            domain = url.split('/')[0]

        # CORRECCIÓN FORZADA: Usar la API correcta directamente
        api_base = "https://website-analyze-and-seo-audit-pro.p.rapidapi.com"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "website-analyze-and-seo-audit-pro.p.rapidapi.com"
        }

        print(f"\nIniciando análisis para: {url}")
        print(f"Dominio extraído: {domain}")
        print(f"Config RAPIDAPI_WEBSITE_ANALYZER_HOST: {current_app.config.get('RAPIDAPI_WEBSITE_ANALYZER_HOST', 'NO_DEFINIDO')}")
        print(f"Headers: {headers}")

        # Hacer todas las llamadas en paralelo con timeout de 60 segundos
        async def run_parallel_analysis():
            async with aiohttp.ClientSession(headers=headers) as session:
                tasks = [
                    make_api_call(session, f"{api_base}/speed.php", {"website": url}, "Velocidad"),
                    make_api_call(session, f"{api_base}/onpagepro.php", {"website": url}, "SEO"),
                    make_api_call(session, f"{api_base}/domain.php", {"website": url}, "Dominio"),
                    make_api_call(session, f"{api_base}/backlinks.php", {"domain": domain}, "Backlinks Generales"),
                    make_api_call(session, f"{api_base}/excatbacklink.php", {"domain": url}, "Backlinks Exactos"),
                    make_api_call(session, f"{api_base}/newbacklinks.php", {"domain": domain}, "Backlinks Nuevos"),
                    make_api_call(session, f"{api_base}/poorbacklinks.php", {"domain": domain}, "Backlinks Baja Calidad"),
                    make_api_call(session, f"{api_base}/referraldomains.php", {"domain": domain}, "Dominios Referencia"),
                    make_api_call(session, f"{api_base}/topsearchkeywords.php", {"domain": domain}, "Keywords")
                ]
                
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                # Extraer resultados evitando excepciones
                speed_data = results[0] if not isinstance(results[0], Exception) else None
                seo_data = results[1] if not isinstance(results[1], Exception) else None
                domain_data = results[2] if not isinstance(results[2], Exception) else None
                backlinks_data = results[3] if not isinstance(results[3], Exception) else None
                exact_backlinks_data = results[4] if not isinstance(results[4], Exception) else None
                new_backlinks_data = results[5] if not isinstance(results[5], Exception) else None
                poor_backlinks_data = results[6] if not isinstance(results[6], Exception) else None
                referral_domains_data = results[7] if not isinstance(results[7], Exception) else None
                keywords_data = results[8] if not isinstance(results[8], Exception) else None
                
                return {
                    'speed': speed_data,
                    'seo': seo_data,
                    'domain': domain_data,
                    'backlinks': {
                        'general': backlinks_data,
                        'exact': exact_backlinks_data,
                        'new': new_backlinks_data,
                        'poor': poor_backlinks_data,
                        'referral_domains': referral_domains_data
                    },
                    'keywords': keywords_data
                }

        # Ejecutar análisis en paralelo
        result_data = asyncio.run(run_parallel_analysis())

        # Guardar en cache para futuras consultas
        current_app.website_analysis_cache[cache_key] = {
            'data': result_data,
            'timestamp': time.time()
        }
        print(f"💾 Resultado guardado en cache para: {url}")
        
        # Retornar resultados del análisis en paralelo
        return jsonify(result_data), 200

    except requests.exceptions.RequestException as e:
        print(f"Error en la petición: {str(e)}")
        return jsonify({
            'error': 'Error al analizar el sitio web',
            'details': str(e)
        }), 500

@website_analyzer_pro_bp.route('/speed', methods=['GET'])
@jwt_required()
@credits_required(amount=1)  # Análisis de velocidad cuesta 1 punto
def analyze_speed():
    """Analiza solo la velocidad del sitio web"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        # CORRECCIÓN FORZADA: Usar la API correcta directamente
        api_url = "https://website-analyze-and-seo-audit-pro.p.rapidapi.com/speed.php"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "website-analyze-and-seo-audit-pro.p.rapidapi.com"
        }
        
        logger.info(f"Analizando velocidad para: {url}")
        print(f"[DEBUG] RAPIDAPI_WEBSITE_ANALYZER_HOST: {current_app.config.get('RAPIDAPI_WEBSITE_ANALYZER_HOST', 'NO_DEFINIDO')}")
        response = requests.get(api_url, headers=headers, params={"website": url})
        response.raise_for_status()
        
        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        logger.error(f"Error en análisis de velocidad: {str(e)}")
        return jsonify({
            'error': 'Error al analizar velocidad',
            'details': str(e)
        }), 500

@website_analyzer_pro_bp.route('/seo', methods=['GET'])
@jwt_required()
@credits_required(amount=1)  # Análisis SEO cuesta 1 punto
def analyze_seo():
    """Analiza solo el SEO del sitio web"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        # CORRECCIÓN FORZADA: Usar la API correcta directamente
        api_url = "https://website-analyze-and-seo-audit-pro.p.rapidapi.com/onpagepro.php"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "website-analyze-and-seo-audit-pro.p.rapidapi.com"
        }
        
        logger.info(f"Analizando SEO para: {url}")
        print(f"[DEBUG] RAPIDAPI_WEBSITE_ANALYZER_HOST: {current_app.config.get('RAPIDAPI_WEBSITE_ANALYZER_HOST', 'NO_DEFINIDO')}")
        response = requests.get(api_url, headers=headers, params={"website": url})
        response.raise_for_status()
        
        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        logger.error(f"Error en análisis SEO: {str(e)}")
        return jsonify({
            'error': 'Error al analizar SEO',
            'details': str(e)
        }), 500 