from flask import Blueprint, request, jsonify, current_app
import requests
from flask_jwt_extended import jwt_required

prlabs_bp = Blueprint('prlabs', __name__)

@prlabs_bp.route('/chat', methods=['POST'])
# @jwt_required()
def chat():
    """Endpoint para el chat con diferentes modelos de IA"""
    try:
        print("DEBUG PRLABS/CHAT PAYLOAD:", request.json)
        data = request.json
        model = data.get('model', 'gpt-4')
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({'error': 'El prompt es requerido'}), 400

        url = "https://chatgpt-42.p.rapidapi.com/chat"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": current_app.config['RAPIDAPI_KEY'],
            "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com"
        }
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}]
        }

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500

@prlabs_bp.route('/image', methods=['POST'])
# @jwt_required()
def generate_image():
    """Endpoint para generar imágenes con IA usando chatgpt-42.p.rapidapi.com/texttoimage o texttoimage3"""
    try:
        data = request.json
        print("[PRLABS/IMAGE] Payload recibido:", data)
        text = data.get('text') or data.get('prompt')
        width = data.get('width', 512)
        height = data.get('height', 512)
        steps = data.get('steps')

        if not text:
            print("[PRLABS/IMAGE] FALTA EL PROMPT/TEXT")
            return jsonify({'error': 'El texto (prompt) es requerido'}), 400

        api_key = current_app.config['RAPIDAPI_KEY']
        headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        # Seleccionar endpoint según si se envía steps
        if steps is not None:
            url = "https://chatgpt-42.p.rapidapi.com/texttoimage3"
            payload = {
                "text": text,
                "width": width,
                "height": height,
                "steps": steps
            }
        else:
            url = "https://chatgpt-42.p.rapidapi.com/texttoimage"
            payload = {
                "text": text,
                "width": width,
                "height": height
            }
        print(f"[PRLABS/IMAGE] URL: {url}")
        print(f"[PRLABS/IMAGE] Headers: {headers}")
        print(f"[PRLABS/IMAGE] Payload enviado a RapidAPI: {payload}")

        response = requests.post(url, json=payload, headers=headers)
        print(f"[PRLABS/IMAGE] Status RapidAPI: {response.status_code}")
        print(f"[PRLABS/IMAGE] Respuesta RapidAPI: {response.text}")
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        print(f"[PRLABS/IMAGE] HTTPError: {errh}")
        print(f"[PRLABS/IMAGE] Respuesta RapidAPI: {response.text}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        print(f"[PRLABS/IMAGE] Exception: {err}")
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500

@prlabs_bp.route('/voice', methods=['POST'])
# @jwt_required()
def text_to_speech():
    """Endpoint para convertir texto a voz usando OpenAI TTS"""
    try:
        print("DEBUG PRLABS/VOICE PAYLOAD:", request.json)
        data = request.json
        text = data.get('text')
        voice = data.get('voice', 'alloy')
        model = data.get('model', 'tts-1')
        instructions = data.get('instructions', 'Speak in a natural tone.')

        if not text:
            return jsonify({'error': 'El texto es requerido'}), 400

        url = "https://open-ai-text-to-speech1.p.rapidapi.com/"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": current_app.config['RAPIDAPI_KEY'],
            "X-RapidAPI-Host": "open-ai-text-to-speech1.p.rapidapi.com"
        }
        
        payload = {
            "model": model,
            "input": text,
            "voice": voice,
            "instructions": instructions
        }

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500

@prlabs_bp.route('/text', methods=['POST'])
# @jwt_required()
def text_generation():
    """Endpoint para generar texto con diferentes modelos"""
    try:
        print("DEBUG PRLABS/TEXT PAYLOAD:", request.json)
        data = request.json
        prompt = data.get('prompt')
        model = data.get('model', 'gpt-4')

        if not prompt:
            return jsonify({'error': 'El prompt es requerido'}), 400

        url = "https://prlabs-text-generation.p.rapidapi.com/generate"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": current_app.config['RAPIDAPI_KEY'],
            "X-RapidAPI-Host": "prlabs-text-generation.p.rapidapi.com"
        }
        payload = {
            "prompt": prompt,
            "model": model
        }

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500
