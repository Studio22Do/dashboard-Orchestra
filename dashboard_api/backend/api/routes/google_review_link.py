from flask import Blueprint, request, jsonify, current_app
import requests
from api.utils.error_handlers import ValidationError

# Crear blueprint
google_review_link_bp = Blueprint('google_review_link', __name__)

# ID de aplicación en la base de datos
APP_ID = "google-review-link"

@google_review_link_bp.route('/generate', methods=['POST'])
def generate_review_link():
    """Generar enlace de reseñas de Google a partir de un place_id"""
    try:
        data = request.get_json()
        place_id = data.get('place_id')

        if not place_id:
            raise ValidationError("Se requiere el place_id del negocio")

        url = "https://google-review-link-generator.p.rapidapi.com/convert-place-id-to-review-link"
        
        headers = {
            "Content-Type": "application/json",
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "google-review-link-generator.p.rapidapi.com"
        }

        payload = {"place_id": place_id}

        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()

        return jsonify(response.json()), 200

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except requests.exceptions.RequestException as e:
        current_app.logger.error(f"Error en la API externa: {str(e)}")
        return jsonify({"error": "Error al generar el enlace de reseñas"}), 502

@google_review_link_bp.route('/search-place', methods=['GET'])
def search_place():
    """Buscar un lugar por nombre y obtener su place_id"""
    try:
        query = request.args.get('query')
        
        if not query:
            raise ValidationError("Se requiere un término de búsqueda")

        # Aquí podríamos integrar la búsqueda de Places de Google
        # Por ahora retornamos un mensaje informativo
        return jsonify({
            "message": "Funcionalidad de búsqueda en desarrollo",
            "places": []
        }), 200

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error inesperado: {str(e)}")
        return jsonify({"error": "Error al buscar el lugar"}), 500 