from flask import Blueprint, request, jsonify, current_app
import requests
import logging
import json
from urllib.parse import urlparse

website_analyzer_bp = Blueprint('website_analyzer', __name__)
logger = logging.getLogger(__name__)

def print_analysis_results(data_type, response):
    """Imprime los resultados del análisis de forma organizada"""
    print(f"\n=== {data_type} ===")
    print(f"Status: {response.status_code}")
    
    try:
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
                print(f"- Imágenes: {data.get('images', {}).get('count', 'N/A')}")
                print(f"- Enlaces: {data.get('links', {}).get('count', 'N/A')}")
        
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
        print(f"Respuesta raw: {response.text[:200]}...")

@website_analyzer_bp.route('/full-analysis', methods=['GET'])
def full_analysis():
    """Realiza un análisis completo del sitio web incluyendo velocidad, SEO y dominio"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        # Extraer el dominio de la URL
        domain = urlparse(url).netloc
        if not domain:
            domain = url.split('/')[0]

        api_base = f"https://{current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']}"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']
        }

        print(f"\nIniciando análisis para: {url}")
        print(f"Dominio extraído: {domain}")
        print(f"Headers: {headers}")

        # 1. Análisis de Velocidad
        speed_response = requests.get(f"{api_base}/speed.php", 
            headers=headers, params={"website": url})
        print_analysis_results("Velocidad", speed_response)
        try:
            speed_data = speed_response.json() if speed_response.status_code == 200 else None
        except json.JSONDecodeError:
            speed_data = None

        # 2. Análisis SEO
        seo_response = requests.get(f"{api_base}/onpagepro.php", 
            headers=headers, params={"website": url})
        print_analysis_results("SEO", seo_response)
        try:
            seo_data = seo_response.json() if seo_response.status_code == 200 else None
        except json.JSONDecodeError:
            seo_data = None

        # 3. Información del Dominio
        domain_response = requests.get(f"{api_base}/domain.php", 
            headers=headers, params={"website": url})
        print_analysis_results("Dominio", domain_response)
        try:
            domain_data = domain_response.json() if domain_response.status_code == 200 else None
        except json.JSONDecodeError:
            domain_data = None

        # 4. Backlinks Generales
        backlinks_response = requests.get(f"{api_base}/backlinks.php",
            headers=headers, params={"domain": domain})
        print_analysis_results("Backlinks", backlinks_response)
        try:
            backlinks_data = backlinks_response.json() if backlinks_response.status_code == 200 else None
        except json.JSONDecodeError:
            backlinks_data = None

        # 5. Backlinks Exactos
        exact_backlinks_response = requests.get(f"{api_base}/excatbacklink.php",
            headers=headers, params={"domain": url})
        print_analysis_results("Backlinks", exact_backlinks_response)
        try:
            exact_backlinks_data = exact_backlinks_response.json() if exact_backlinks_response.status_code == 200 else None
        except json.JSONDecodeError:
            exact_backlinks_data = None

        # 6. Backlinks Nuevos
        new_backlinks_response = requests.get(f"{api_base}/newbacklinks.php",
            headers=headers, params={"domain": domain})
        print_analysis_results("Backlinks", new_backlinks_response)
        try:
            new_backlinks_data = new_backlinks_response.json() if new_backlinks_response.status_code == 200 else None
        except json.JSONDecodeError:
            new_backlinks_data = None

        # 7. Backlinks de Baja Calidad
        poor_backlinks_response = requests.get(f"{api_base}/poorbacklinks.php",
            headers=headers, params={"domain": domain})
        print_analysis_results("Backlinks", poor_backlinks_response)
        try:
            poor_backlinks_data = poor_backlinks_response.json() if poor_backlinks_response.status_code == 200 else None
        except json.JSONDecodeError:
            poor_backlinks_data = None

        # 8. Dominios de Referencia
        referral_domains_response = requests.get(f"{api_base}/referraldomains.php",
            headers=headers, params={"domain": domain})
        print_analysis_results("Backlinks", referral_domains_response)
        try:
            referral_domains_data = referral_domains_response.json() if referral_domains_response.status_code == 200 else None
        except json.JSONDecodeError:
            referral_domains_data = None

        # 9. Palabras Clave
        keywords_response = requests.get(f"{api_base}/topsearchkeywords.php",
            headers=headers, params={"domain": domain})
        print_analysis_results("Keywords", keywords_response)
        try:
            keywords_data = keywords_response.json() if keywords_response.status_code == 200 else None
        except json.JSONDecodeError:
            keywords_data = None

        # Combinar todos los resultados
        return jsonify({
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
        }), 200

    except requests.exceptions.RequestException as e:
        print(f"Error en la petición: {str(e)}")
        return jsonify({
            'error': 'Error al analizar el sitio web',
            'details': str(e)
        }), 500

@website_analyzer_bp.route('/speed', methods=['GET'])
def analyze_speed():
    """Analiza solo la velocidad del sitio web"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        api_url = f"https://{current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']}/speed.php"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']
        }
        
        logger.info(f"Analizando velocidad para: {url}")
        response = requests.get(api_url, headers=headers, params={"website": url})
        response.raise_for_status()
        
        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        logger.error(f"Error en análisis de velocidad: {str(e)}")
        return jsonify({
            'error': 'Error al analizar velocidad',
            'details': str(e)
        }), 500

@website_analyzer_bp.route('/seo', methods=['GET'])
def analyze_seo():
    """Analiza solo el SEO del sitio web"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL es requerida'}), 400

    try:
        api_url = f"https://{current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']}/onpagepro.php"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": current_app.config['RAPIDAPI_WEBSITE_ANALYZER_HOST']
        }
        
        logger.info(f"Analizando SEO para: {url}")
        response = requests.get(api_url, headers=headers, params={"website": url})
        response.raise_for_status()
        
        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        logger.error(f"Error en análisis SEO: {str(e)}")
        return jsonify({
            'error': 'Error al analizar SEO',
            'details': str(e)
        }), 500 