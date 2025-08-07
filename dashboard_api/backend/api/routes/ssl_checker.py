from flask import Blueprint, request, jsonify, current_app
import requests
from api.utils.decorators import credits_required
from flask_jwt_extended import jwt_required, get_jwt_identity

# Crear blueprint
ssl_checker_bp = Blueprint('ssl_checker', __name__)

@ssl_checker_bp.route('/check', methods=['POST'])
@jwt_required()  # Descomentado
@credits_required(amount=1)
def check_ssl():
    print(f"[SSLChecker] === INICIO DE VERIFICACIÓN SSL ===")
    print(f"[SSLChecker] Modo actual: {current_app.config.get('MODE', 'beta_v1')}")
    print(f"[SSLChecker] JWT Identity: {get_jwt_identity()}")
    
    data = request.json
    domain = data.get('domain')
    if not domain:
        return {'error': 'El campo "domain" es obligatorio.'}, 400

    api_url = "https://ssl-checker2.p.rapidapi.com/"
    params = {"domain": domain}
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "ssl-checker2.p.rapidapi.com"
    }
    print(f"[SSLChecker] Llamando a RapidAPI con: {params}")
    try:
        response = requests.get(api_url, headers=headers, params=params, timeout=20)
        print(f"[SSLChecker] Status: {response.status_code}")
        print(f"[SSLChecker] Response: {response.text}")
        response.raise_for_status()
        
        # Procesar la respuesta para el frontend
        ssl_data = response.json()
        if ssl_data.get('status') == 'success' and ssl_data.get('result'):
            result = ssl_data['result']
            return {
                'status': 'success',
                'data': {
                    'issuer': result.get('issuer', '-'),
                    'validFrom': result.get('validFromDate', '-'),
                    'validUntil': result.get('expiry', '-'),
                    'daysLeft': result.get('daysLeft', '-'),
                    'lifespan': result.get('lifespanInDays', '-'),
                    'domain': result.get('final_url', domain),
                    'port': result.get('port', '-'),
                    'isValid': result.get('isvalidCertificate', False),
                    'isExpired': result.get('isExpired', False),
                    'message': result.get('message', '')
                }
            }, 200
        else:
            return {'error': 'Error en la respuesta de la API externa'}, 500
            
    except requests.exceptions.HTTPError as errh:
        print(f"[SSLChecker] HTTP Error: {errh}")
        print(f"[SSLChecker] Response: {response.text}")
        return {'error': str(errh), 'details': response.text}, response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[SSLChecker] Request Error: {err}")
        return {'error': 'Error de conexión con la API externa', 'details': str(err)}, 502 