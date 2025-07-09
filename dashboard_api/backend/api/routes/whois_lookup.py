from flask import Blueprint, request, jsonify, current_app
import requests

whois_lookup_bp = Blueprint('whois_lookup', __name__)

@whois_lookup_bp.route('', methods=['OPTIONS'])
@whois_lookup_bp.route('/', methods=['OPTIONS'])
def handle_options():
    """Manejar peticiones OPTIONS para CORS"""
    return '', 200

@whois_lookup_bp.route('/domain', methods=['POST'])
def get_domain_whois():
    """Obtener información WHOIS de un dominio"""
    data = request.json
    url_param = data.get('url')
    
    if not url_param:
        return jsonify({'error': 'El campo "url" es obligatorio'}), 400

    # Limpiar la URL (quitar http(s):// si existe)
    domain = url_param.replace('https://', '').replace('http://', '').split('/')[0]
    
    api_url = "https://whois-lookup-service.p.rapidapi.com/v1/getwhois"
    params = {"url": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "whois-lookup-service.p.rapidapi.com"
    }

    try:
        print(f"[WhoisLookup] Consultando dominio: {domain}")
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[WhoisLookup] Status: {response.status_code}")
        print(f"[WhoisLookup] Response: {response.text}")
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API de WHOIS',
                'details': response.text
            }), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[WhoisLookup] Error: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con el servicio WHOIS',
            'details': str(e)
        }), 500

@whois_lookup_bp.route('/asn', methods=['POST'])
def get_asn_whois():
    """Obtener información WHOIS de un ASN"""
    data = request.json
    asn = data.get('asn')
    
    if not asn:
        return jsonify({'error': 'El campo "asn" es obligatorio'}), 400

    # Asegurar formato ASN correcto
    if not asn.startswith('AS'):
        asn = f"AS{asn}"
    
    api_url = "https://whois-lookup-service.p.rapidapi.com/v1/getwhoisasn"
    params = {"asn": asn}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "whois-lookup-service.p.rapidapi.com"
    }

    try:
        print(f"[WhoisLookup] Consultando ASN: {asn}")
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[WhoisLookup] Status: {response.status_code}")
        print(f"[WhoisLookup] Response: {response.text}")
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API de WHOIS ASN',
                'details': response.text
            }), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[WhoisLookup] Error: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con el servicio WHOIS ASN',
            'details': str(e)
        }), 500

@whois_lookup_bp.route('/ip', methods=['POST'])
def get_ip_whois():
    """Obtener información WHOIS de una IP"""
    data = request.json
    ip = data.get('ip')
    
    if not ip:
        return jsonify({'error': 'El campo "ip" es obligatorio'}), 400
    
    api_url = "https://whois-lookup-service.p.rapidapi.com/v1/getwhoisip"
    params = {"ip": ip}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "whois-lookup-service.p.rapidapi.com"
    }

    try:
        print(f"[WhoisLookup] Consultando IP: {ip}")
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[WhoisLookup] Status: {response.status_code}")
        print(f"[WhoisLookup] Response: {response.text}")
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Error en la API de WHOIS IP',
                'details': response.text
            }), response.status_code

        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        print(f"[WhoisLookup] Error: {str(e)}")
        return jsonify({
            'error': 'Error al conectar con el servicio WHOIS IP',
            'details': str(e)
        }), 500 