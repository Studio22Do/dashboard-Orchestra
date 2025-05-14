from flask import Blueprint, request, jsonify, current_app
import requests

midjourney_bp = Blueprint('midjourney', __name__)

@midjourney_bp.route('/generate-fast', methods=['POST'])
def generate_fast():
    data = request.json
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    url = "https://midjourney-best-experience.p.rapidapi.com/mj/generate-fast"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "midjourney-best-experience.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    params = {
        "prompt": prompt,
        "hook_url": "https://www.google.com/"
    }
    response = requests.post(url, headers=headers, params=params)
    return jsonify(response.json()), response.status_code 