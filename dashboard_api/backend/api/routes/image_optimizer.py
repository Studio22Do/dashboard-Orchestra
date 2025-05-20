import requests
from flask import Blueprint, request, jsonify

image_optimizer_bp = Blueprint('image_optimizer', __name__, url_prefix='/api/image-optimize')

@image_optimizer_bp.route('', methods=['POST'])
def image_optimize():
    data = request.get_json()
    image_url = data.get('url')
    lossy = data.get('lossy', 0)
    wait = data.get('wait', 0)

    if not image_url:
        return jsonify({"error": "Missing image URL"}), 400

    api_url = "https://pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com/v1/reducer.php"
    headers = {
        "x-rapidapi-key": "9dc7412cabmsh04d2de9d55522bap1643f6jsn6e3113942f4a",  # <-- pon tu API key aquí
        "x-rapidapi-host": "pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com"
    }
    params = {
        "lossy": str(lossy),
        "wait": str(wait),
        "url": image_url
    }
    try:
        resp = requests.get(api_url, headers=headers, params=params, timeout=20)
        resp.raise_for_status()
        return jsonify(resp.json()), resp.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500 