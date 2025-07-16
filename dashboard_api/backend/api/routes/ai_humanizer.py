"""Módulo para humanización de texto AI"""
from flask import Blueprint, request, jsonify
import requests
import os
import logging

logger = logging.getLogger(__name__)

ai_humanizer_bp = Blueprint('ai_humanizer', __name__)

@ai_humanizer_bp.route('/test', methods=['POST'])
def ai_humanizer_test():
    """Endpoint de prueba para verificar la funcionalidad del frontend"""
    try:
        data = request.json
        text = data.get('text', 'Texto de prueba')
        
        # Simulamos una respuesta exitosa
        result = {
            "contenido_generado": f"Texto humanizado de prueba: {text} - Este es un ejemplo de cómo se vería el contenido procesado por la API de AI Humanizer.",
            "metadatos": {
                "tipo": "texto",
                "idioma": "es",
                "tono": "profesional",
                "longitud": "media"
            }
        }
        
        logger.info("Endpoint de prueba de AI Humanizer ejecutado exitosamente")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error en endpoint de prueba de AI Humanizer: {str(e)}")
        return jsonify({
            'error': 'Error en el endpoint de prueba',
            'details': str(e)
        }), 500

@ai_humanizer_bp.route('/', methods=['POST'])
def ai_humanizer():
    try:
        data = request.json
        text = data.get('text')
        
        logger.debug(f"Datos recibidos del frontend: {data}")

        if not text:
            return jsonify({'error': 'El campo "text" es obligatorio.'}), 400

        # Validar longitud del texto (máximo 1980 palabras)
        word_count = len(text.split())
        if word_count > 1980:
            return jsonify({'error': f'El texto excede el límite de 1980 palabras. Actual: {word_count} palabras.'}), 400

        # Mapear parámetros del frontend
        level = data.get('level', 7)  # Default medio
        tone = data.get('tone', 'general')
        content_type = data.get('type', 'text')
        
        # Configurar opciones según el tipo de contenido
        skip_code = content_type == 'code'
        skip_markdown = content_type in ['code', 'article']
        
        url = "https://humanizer-apis.p.rapidapi.com/humanizer/language"
        
        payload = {
            "text": text,
            "level": level,
            "model": "humanizer",
            "options": {
                "tone": tone,
                "skipCode": skip_code,
                "skipMarkdown": skip_markdown,
                "skipQuotation": False
            }
        }
        
        headers = {
            "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
            "x-rapidapi-host": "humanizer-apis.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        logger.debug(f"Enviando solicitud a: {url}")
        logger.debug(f"Payload: {payload}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
        
        # Log de la respuesta raw
        logger.debug(f"Respuesta raw de la API: {response.text}")
        
        # La API devuelve {"humanized_text": "..."}
        response_data = response.json()
        humanized_text = response_data.get("humanized_text", text)
        logger.debug(f"Texto humanizado: {humanized_text}")
        
        # Devolvemos el texto humanizado y los metadatos
        result = {
            "contenido_generado": humanized_text,
            "metadatos": {
                "tipo": content_type,
                "idioma": "auto",
                "tono": tone,
                "longitud": f"nivel_{level}",
                "palabras_originales": word_count,
                "palabras_humanizadas": len(humanized_text.split())
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
        
        # Mensajes más específicos según el tipo de error
        if 'timeout' in str(err).lower():
            error_message = 'La API externa está tardando demasiado en responder. Por favor, intenta nuevamente en unos momentos.'
        elif 'connection' in str(err).lower():
            error_message = 'No se pudo conectar con la API externa. Verifica tu conexión a internet.'
        else:
            error_message = 'Error de conexión con la API externa. Por favor, intenta nuevamente.'
        
        return jsonify({
            'error': error_message,
            'details': str(err)
        }), 502

    except Exception as e:
        logger.error(f"Error inesperado en AI Humanizer: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500

@ai_humanizer_bp.route('/basic', methods=['POST'])
def ai_humanizer_basic():
    """Endpoint para modo Basic que devuelve alternativas con scores"""
    try:
        data = request.json
        text = data.get('text')
        
        logger.debug(f"Datos recibidos del frontend (Basic): {data}")

        if not text:
            return jsonify({'error': 'El campo "text" es obligatorio.'}), 400

        # Validar longitud del texto
        word_count = len(text.split())
        if word_count > 1980:
            return jsonify({'error': f'El texto excede el límite de 1980 palabras. Actual: {word_count} palabras.'}), 400

        # Mapear parámetros
        level = data.get('level', 7)
        tone = data.get('tone', 'general')
        content_type = data.get('type', 'text')
        
        skip_code = content_type == 'code'
        skip_markdown = content_type in ['code', 'article']
        
        url = "https://humanizer-apis.p.rapidapi.com/humanizer/basic"
        
        payload = {
            "text": text,
            "level": level,
            "model": "humanizer",
            "options": {
                "tone": tone,
                "skipCode": skip_code,
                "skipMarkdown": skip_markdown,
                "skipQuotation": False
            }
        }
        
        headers = {
            "x-rapidapi-key": os.environ.get('RAPIDAPI_KEY', ''),
            "x-rapidapi-host": "humanizer-apis.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        logger.debug(f"Enviando solicitud Basic a: {url}")
        logger.debug(f"Payload: {payload}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
        
        response_data = response.json()
        logger.debug(f"Respuesta Basic: {response_data}")
        
        # Procesar alternativas
        alternatives = []
        if isinstance(response_data, list):
            for sentence_data in response_data:
                if 'alternatives' in sentence_data:
                    for alt in sentence_data['alternatives']:
                        alternatives.append({
                            'texto': alt.get('sentence', ''),
                            'probabilidad_ai': alt.get('ai_probability', 0),
                            'origen': sentence_data.get('original', '')
                        })
        
        # Obtener la mejor alternativa (menor probabilidad AI)
        best_alternative = min(alternatives, key=lambda x: x['probabilidad_ai']) if alternatives else None
        
        result = {
            "contenido_generado": best_alternative['texto'] if best_alternative else text,
            "alternativas": alternatives,
            "metadatos": {
                "tipo": content_type,
                "idioma": "auto",
                "tono": tone,
                "longitud": f"nivel_{level}",
                "palabras_originales": word_count,
                "mejor_probabilidad_ai": best_alternative['probabilidad_ai'] if best_alternative else 0,
                "total_alternativas": len(alternatives)
            }
        }
        
        logger.debug(f"Resultado Basic: {result}")
        return jsonify(result), 200

    except requests.exceptions.HTTPError as errh:
        logger.error(f"Error HTTP en AI Humanizer Basic: {str(errh)}")
        error_response = {
            'error': str(errh),
            'details': response.text if 'response' in locals() else 'No response available'
        }
        return jsonify(error_response), response.status_code if 'response' in locals() else 500

    except requests.exceptions.RequestException as err:
        logger.error(f"Error de conexión en AI Humanizer Basic: {str(err)}")
        
        if 'timeout' in str(err).lower():
            error_message = 'La API externa está tardando demasiado en responder. Por favor, intenta nuevamente en unos momentos.'
        elif 'connection' in str(err).lower():
            error_message = 'No se pudo conectar con la API externa. Verifica tu conexión a internet.'
        else:
            error_message = 'Error de conexión con la API externa. Por favor, intenta nuevamente.'
        
        return jsonify({
            'error': error_message,
            'details': str(err)
        }), 502

    except Exception as e:
        logger.error(f"Error inesperado en AI Humanizer Basic: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor',
            'details': str(e)
        }), 500 