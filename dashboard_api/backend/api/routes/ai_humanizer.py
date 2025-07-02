"""Módulo para humanización de texto AI"""
from flask import Blueprint, request, jsonify
import requests
import os
import logging

logger = logging.getLogger(__name__)

ai_humanizer_bp = Blueprint('ai_humanizer', __name__)

@ai_humanizer_bp.route('/', methods=['POST'])
def ai_humanizer():
    try:
        data = request.json
        text = data.get('text')
        
        logger.debug(f"Datos recibidos del frontend: {data}")

        if not text:
            return jsonify({'error': 'El campo "text" es obligatorio.'}), 400

        url = "https://humanizer-apis.p.rapidapi.com/humanizer/language"
        
        payload = {
            "text": text
        }
        
        headers = {
            "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
            "x-rapidapi-host": "humanizer-apis.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        logger.debug(f"Enviando solicitud a: {url}")
        logger.debug(f"Payload: {payload}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Log de la respuesta raw
        logger.debug(f"Respuesta raw de la API: {response.text}")
        
        # La API devuelve un array con múltiples versiones del texto
        humanized_versions = response.json()
        logger.debug(f"Versiones humanizadas: {humanized_versions}")
        
        # Devolvemos todas las versiones y los metadatos originales
        result = {
            "contenido_generado": humanized_versions[0] if isinstance(humanized_versions, list) and humanized_versions else text,
            "metadatos": {
                "tipo": data.get('tipo', 'texto'),
                "idioma": data.get('idioma', 'es'),
                "tono": data.get('tono', 'profesional'),
                "longitud": data.get('longitud', 'media')
            }
        }
        
        logger.debug(f"Respuesta final: {result}")
        return jsonify(result), 200

    except requests.exceptions.HTTPError as errh:
        logger.error(f"Error HTTP en AI Humanizer: {str(errh)}")
        error_response = {
            'error': str(errh),
            'details': response.text if 'response' in locals() else 'No response available'
        }
        return jsonify(error_response), response.status_code if 'response' in locals() else 500

    except requests.exceptions.RequestException as err:
        logger.error(f"Error de conexión en AI Humanizer: {str(err)}")
        return jsonify({
            'error': 'Error de conexión con la API externa',
            'details': str(err)
        }), 502

    except Exception as e:
        logger.error(f"Error inesperado en AI Humanizer: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500 