from flask import Blueprint, request, jsonify, current_app
import requests
from flask_jwt_extended import jwt_required

prlabs_bp = Blueprint('prlabs', __name__)

@prlabs_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Endpoint para el chat con diferentes modelos de IA"""
    try:
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
@jwt_required()
def generate_image():
    """Endpoint para generar imágenes con IA"""
    try:
        data = request.json
        prompt = data.get('prompt')
        model = data.get('model', 'dall-e-3')
        size = data.get('size', '1024x1024')
        quality = data.get('quality', 'standard')
        style = data.get('style', 'vivid')

        if not prompt:
            return jsonify({'error': 'El prompt es requerido'}), 400

        url = "https://prlabs-image-generation.p.rapidapi.com/generate"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": current_app.config['RAPIDAPI_KEY'],
            "X-RapidAPI-Host": "prlabs-image-generation.p.rapidapi.com"
        }
        payload = {
            "prompt": prompt,
            "model": model,
            "size": size,
            "quality": quality,
            "style": style
        }

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except Exception as err:
        return jsonify({'error': 'Error al procesar la solicitud', 'details': str(err)}), 500

@prlabs_bp.route('/voice', methods=['POST'])
@jwt_required()
def text_to_speech():
    """Endpoint para convertir texto a voz usando OpenAI TTS"""
    try:
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
@jwt_required()
def text_generation():
    """Endpoint para generar texto con diferentes modelos"""
    try:
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