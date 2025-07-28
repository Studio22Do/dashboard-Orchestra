from flask import Blueprint, request, jsonify, current_app
import requests
import os

picpulse_bp = Blueprint('picpulse', __name__)

@picpulse_bp.route('/analyze', methods=['POST'])
def analyze_image():
    """Endpoint para análisis básico de imagen con PicPulse"""
    try:
        print(f"[PICPULSE] Request files: {request.files}")
        print(f"[PICPULSE] Request form: {request.form}")
        
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            print("[PICPULSE] ERROR: No se encontró archivo 'image' en request.files")
            return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
            
        image_file = request.files['image']
        print(f"[PICPULSE] Image file: {image_file.filename}")
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            print("[PICPULSE] ERROR: Nombre de archivo vacío")
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
            
        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            print(f"[PICPULSE] ERROR: Tipo de archivo no permitido: {image_file.filename}")
            return jsonify({'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG'}), 400
        
        gender = request.form.get('gender', 'Male')
        age_group = request.form.get('age_group', '25-34')
        print(f"[PICPULSE] Gender: {gender}, Age Group: {age_group}")
        
        url = "https://picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com/analyze_image/"
        
        querystring = {
            "gender": gender,
            "age_group": age_group
        }
        
        # Preparar archivo para envío - usar el nombre correcto que espera la API
        # Resetear el stream para poder leerlo
        image_file.seek(0)
        files = {'image': (image_file.filename, image_file.read(), image_file.content_type)}
        
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com"
        }
        
        print(f"[PICPULSE] URL: {url}")
        print(f"[PICPULSE] Files: {files}")
        print(f"[PICPULSE] Headers: {headers}")
        print(f"[PICPULSE] Params: {querystring}")
        
        response = requests.post(url, files=files, headers=headers, params=querystring, timeout=30)
        print(f"[PICPULSE] Response status: {response.status_code}")
        print(f"[PICPULSE] Response text: {response.text}")
        
        response.raise_for_status()
        
        return jsonify(response.json()), 200
        
    except requests.exceptions.HTTPError as errh:
        print(f"[PICPULSE] HTTP Error: {errh}")
        return jsonify({'error': f'Error HTTP: {errh}', 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[PICPULSE] Request Exception: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502
    except Exception as e:
        print(f"[PICPULSE] General Exception: {e}")
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500

@picpulse_bp.route('/analyze-detailed', methods=['POST'])
def analyze_image_detailed():
    """Endpoint para análisis detallado de imagen con PicPulse"""
    try:
        print(f"[PICPULSE DETAILED] Request files: {request.files}")
        print(f"[PICPULSE DETAILED] Request form: {request.form}")
        
        # Verificar si se envió un archivo
        if 'image' not in request.files:
            print("[PICPULSE DETAILED] ERROR: No se encontró archivo 'image' en request.files")
            return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
            
        image_file = request.files['image']
        print(f"[PICPULSE DETAILED] Image file: {image_file.filename}")
        
        # Verificar si el archivo está vacío
        if image_file.filename == '':
            print("[PICPULSE DETAILED] ERROR: Nombre de archivo vacío")
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
            
        # Verificar el tipo de archivo
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not '.' in image_file.filename or \
           image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            print(f"[PICPULSE DETAILED] ERROR: Tipo de archivo no permitido: {image_file.filename}")
            return jsonify({'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG'}), 400
        
        gender = request.form.get('gender', 'Male')
        age_group = request.form.get('age_group', '25-34')
        print(f"[PICPULSE DETAILED] Gender: {gender}, Age Group: {age_group}")
        
        url = "https://picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com/analyze_image_detailed/"
        
        querystring = {
            "gender": gender,
            "age_group": age_group
        }
        
        # Preparar archivo para envío - usar el nombre correcto que espera la API
        # Resetear el stream para poder leerlo
        image_file.seek(0)
        files = {'image': (image_file.filename, image_file.read(), image_file.content_type)}
        
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com"
        }
        
        print(f"[PICPULSE DETAILED] URL: {url}")
        print(f"[PICPULSE DETAILED] Files: {files}")
        print(f"[PICPULSE DETAILED] Headers: {headers}")
        print(f"[PICPULSE DETAILED] Params: {querystring}")
        
        response = requests.post(url, files=files, headers=headers, params=querystring, timeout=30)
        print(f"[PICPULSE DETAILED] Response status: {response.status_code}")
        print(f"[PICPULSE DETAILED] Response text: {response.text}")
        
        response.raise_for_status()
        
        return jsonify(response.json()), 200
        
    except requests.exceptions.HTTPError as errh:
        print(f"[PICPULSE DETAILED] HTTP Error: {errh}")
        return jsonify({'error': f'Error HTTP: {errh}', 'details': response.text}), response.status_code
    except requests.exceptions.RequestException as err:
        print(f"[PICPULSE DETAILED] Request Exception: {err}")
        return jsonify({'error': 'Error de conexión con la API externa', 'details': str(err)}), 502
    except Exception as e:
        print(f"[PICPULSE DETAILED] General Exception: {e}")
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500 