"""Módulo para humanización de texto AI"""
from flask import Blueprint, request, jsonify
import requests
import os
import logging

logger = logging.getLogger(__name__)

ai_humanizer_bp = Blueprint('ai_humanizer', __name__)

@ai_humanizer_bp.route('/', methods=['POST'])
def ai_humanizer():
    data = request.json
    text = data.get('text')
    level = data.get('level', 'standard')

    if not text:
        return jsonify({'error': 'El campo "text" es obligatorio.'}), 400

    url = "https://text-humanizer-api.p.rapidapi.com/"
    payload = {
        "text": text,
        "level": level
    }
    headers = {
        "X-RapidAPI-Key": os.environ.get('RAPIDAPI_KEY', ''),
        "X-RapidAPI-Host": "ai-humanizer-api.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        return jsonify(response.json()), response.status_code
    except requests.exceptions.HTTPError as errh:
        logger.error(f"Error HTTP en AI Humanizer: {str(errh)}")
        return jsonify({'error': str(errh), 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        logger.error(f"Error de conexión en AI Humanizer: {str(err)}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502 