from flask import Blueprint, request, jsonify, current_app
import requests

runwayml_bp = Blueprint('runwayml', __name__)

@runwayml_bp.route('/process', methods=['POST'])
def process_runwayml():
    data = request.json
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
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500 