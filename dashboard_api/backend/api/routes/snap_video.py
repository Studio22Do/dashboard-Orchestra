from flask import Blueprint, request, jsonify, current_app
import requests
import logging

media_downloader_bp = Blueprint('media_downloader', __name__)
logger = logging.getLogger(__name__)

@media_downloader_bp.route('/download', methods=['POST'])
def download_media():
    """Descargar videos y audio de múltiples plataformas"""
    data = request.json
    media_url = data.get('url')
    if not media_url:
        return jsonify({'error': 'url is required'}), 400

    api_url = "https://snap-video3.p.rapidapi.com/download"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "snap-video3.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {"url": media_url}
    
    try:
        logger.info(f"Llamando a Media Downloader API con URL: {media_url}")
        logger.info(f"Headers: {headers}")
        logger.info(f"Payload: {payload}")
        
        response = requests.post(api_url, data=payload, headers=headers, timeout=30)
        
        logger.info(f"Status code de RapidAPI: {response.status_code}")
        logger.info(f"Headers de respuesta: {dict(response.headers)}")
        logger.info(f"Respuesta completa de RapidAPI: {response.text}")
        
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text,
                "headers": dict(response.headers)
            }
            logger.error(f"Error en la API de Media Downloader: {error_detail}")
            return jsonify({"error": "Error en la API de Media Downloader", "details": error_detail}), response.status_code
        
        # Intentar parsear la respuesta JSON
        try:
            response_data = response.json()
            logger.info(f"Datos parseados exitosamente: {response_data}")
            
            # Verificar si la respuesta tiene la estructura esperada
            if not response_data:
                logger.warning("Respuesta vacía de la API")
                return jsonify({"error": "Respuesta vacía de la API externa"}), 500
                
            # Log de la estructura de la respuesta
            logger.info(f"Estructura de la respuesta: {list(response_data.keys()) if isinstance(response_data, dict) else 'No es un diccionario'}")
            
            return jsonify(response_data), 200
            
        except Exception as e:
            logger.error(f"Error al parsear JSON: {str(e)}")
            logger.error(f"Respuesta raw: {response.text}")
            return jsonify({
                "error": "Respuesta inválida de la API", 
                "raw_response": response.text,
                "content_type": response.headers.get('content-type', 'unknown')
            }), 500
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error de conexión: {str(e)}")
        return jsonify({"error": "Error de conexión con la API externa", "details": str(e)}), 502
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@media_downloader_bp.route('/test', methods=['POST'])
def test_download():
    """Endpoint de prueba que simula una respuesta exitosa"""
    data = request.json
    media_url = data.get('url', 'test-url')
    
    # Simular una respuesta exitosa
    mock_response = {
        "title": "Video de prueba",
        "duration": "00:30",
        "thumbnail": "https://via.placeholder.com/480x360/FF6B6B/FFFFFF?text=Video+Thumbnail",
        "source": "YouTube",
        "medias": [
            {
                "url": "https://example.com/video1.mp4",
                "quality": "HD",
                "extension": "mp4"
            },
            {
                "url": "https://example.com/video2.mp4", 
                "quality": "SD",
                "extension": "mp4"
            }
        ]
    }
    
    logger.info(f"Endpoint de prueba llamado con URL: {media_url}")
    logger.info(f"Devolviendo respuesta simulada: {mock_response}")
    
    return jsonify(mock_response), 200 