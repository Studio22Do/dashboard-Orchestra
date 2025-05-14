from flask import Blueprint, request, jsonify, current_app
import requests

snap_video_bp = Blueprint('snap_video', __name__)

@snap_video_bp.route('/download', methods=['POST'])
def download_video():
    data = request.json
    video_url = data.get('url')
    if not video_url:
        return jsonify({'error': 'url is required'}), 400

    api_url = "https://snap-video3.p.rapidapi.com/download"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "snap-video3.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {"url": video_url}
    response = requests.post(api_url, data=payload, headers=headers)
    return jsonify(response.json()), response.status_code 