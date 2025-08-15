from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
from api.utils.decorators import credits_required

runwayml_bp = Blueprint('runwayml', __name__)

@runwayml_bp.route('/process', methods=['POST'])
@jwt_required()
@credits_required(amount=3)  # RunwayML cuesta 3 puntos
def process_runwayml():
    data = request.json
    print('DEBUG RUNWAYML PAYLOAD:', data)
    operation = data.get('operation')
    api_key = current_app.config['RAPIDAPI_KEY']
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "runwayml.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    if operation == 'generate_by_text':
        required = ['text_prompt', 'model', 'width', 'height', 'motion', 'seed', 'time']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        payload = {
            "text_prompt": data['text_prompt'],
            "model": data['model'],
            "width": data['width'],
            "height": data['height'],
            "motion": data['motion'],
            "seed": data['seed'],
            "callback_url": data.get('callback_url', ''),
            "time": data['time']
        }
        url = "https://runwayml.p.rapidapi.com/generate/text"
    elif operation == 'generate_by_image':
        required = ['img_prompt', 'model', 'image_as_end_frame', 'flip', 'motion', 'seed', 'time']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        payload = {
            "img_prompt": data['img_prompt'],
            "model": data['model'],
            "image_as_end_frame": data['image_as_end_frame'],
            "flip": data['flip'],
            "motion": data['motion'],
            "seed": data['seed'],
            "callback_url": data.get('callback_url', ''),
            "time": data['time']
        }
        url = "https://runwayml.p.rapidapi.com/generate/image"
    elif operation == 'generate_by_image_and_text':
        required = ['text_prompt', 'img_prompt', 'model', 'image_as_end_frame', 'flip', 'motion', 'seed', 'time']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        payload = {
            "text_prompt": data['text_prompt'],
            "img_prompt": data['img_prompt'],
            "model": data['model'],
            "image_as_end_frame": data['image_as_end_frame'],
            "flip": data['flip'],
            "motion": data['motion'],
            "seed": data['seed'],
            "callback_url": data.get('callback_url', ''),
            "time": data['time']
        }
        url = "https://runwayml.p.rapidapi.com/generate/imageDescription"
    else:
        return jsonify({'error': 'Invalid operation'}), 400

    try:
        response = requests.post(url, json=payload, headers=headers)
        print('RUNWAYML RAW RESPONSE:', response.status_code, response.text)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@runwayml_bp.route('/status/<uuid>', methods=['GET'])
@jwt_required()
@credits_required(amount=0)  # Consultar estado no cuesta puntos
def check_task_status(uuid):
    """Verificar el estado de un task de RunwayML"""
    try:
        api_url = f"https://runwayml.p.rapidapi.com/status"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "runwayml.p.rapidapi.com"
        }
        params = {"uuid": uuid}
        
        response = requests.get(api_url, headers=headers, params=params, timeout=30)
        
        if response.status_code != 200:
            return jsonify({"error": "Error al consultar estado", "details": response.text}), response.status_code
        
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error consultando estado: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@runwayml_bp.route('/result/<uuid>', methods=['GET'])
@jwt_required()
@credits_required(amount=0)  # Obtener resultado no cuesta puntos
def get_task_result(uuid):
    """Obtener el resultado de un task completado de RunwayML"""
    try:
        api_url = f"https://runwayml.p.rapidapi.com/queue/{uuid}/result"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "runwayml.p.rapidapi.com"
        }
        
        response = requests.get(api_url, headers=headers, timeout=30)
        
        if response.status_code != 200:
            return jsonify({"error": "Error al obtener resultado", "details": response.text}), response.status_code
        
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo resultado: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500 