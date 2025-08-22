import logging
import requests
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required
from api.utils.decorators import credits_required

logger = logging.getLogger(__name__)

pdf_converter_bp = Blueprint('pdf_converter', __name__)

def get_headers():
    """Obtiene los headers necesarios para la API de PDF Converter"""
    return {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "pdf-converter-api.p.rapidapi.com"
    }

@pdf_converter_bp.route('/to-text', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def pdf_to_text():
    """Convierte PDF subido a texto"""
    try:
        # Verificar que se haya enviado un archivo
        if 'pdfFile' not in request.files:
            return jsonify({'error': 'No se envió ningún archivo PDF'}), 400
        
        pdf_file = request.files['pdfFile']
        if pdf_file.filename == '':
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        # Verificar que sea un PDF
        if not pdf_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Solo se aceptan archivos PDF'}), 400
        
        # Obtener parámetros opcionales
        start_page = request.form.get('startPage', '0')
        end_page = request.form.get('endPage', '0')
        
        # Preparar archivo para la API
        files = {'pdfFile': (pdf_file.filename, pdf_file.read(), 'application/pdf')}
        params = {
            'startPage': start_page,
            'endPage': end_page
        }
        
        # Llamar a la API de PDF Converter
        url = "https://pdf-converter-api.p.rapidapi.com/PdfToText"
        headers = get_headers()
        
        response = requests.post(url, headers=headers, params=params, files=files)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API PDF Converter: {str(e)}")
        return jsonify({'error': 'Error al convertir el PDF'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@pdf_converter_bp.route('/to-text-url', methods=['GET'])
@jwt_required()
@credits_required(amount=1)
def pdf_to_text_url():
    """Convierte PDF desde URL a texto"""
    try:
        pdf_url = request.args.get('pdfUrl')
        if not pdf_url:
            return jsonify({'error': 'Se requiere pdfUrl'}), 400
        
        # Obtener parámetros opcionales
        start_page = request.args.get('startPage', '0')
        end_page = request.args.get('endPage', '0')
        
        # Llamar a la API de PDF Converter
        url = "https://pdf-converter-api.p.rapidapi.com/PdfToText"
        headers = get_headers()
        params = {
            'pdfUrl': pdf_url,
            'startPage': start_page,
            'endPage': end_page
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return jsonify(result), 200
        
    except requests.RequestException as e:
        logger.error(f"Error en API PDF Converter URL: {str(e)}")
        return jsonify({'error': 'Error al convertir el PDF desde URL'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@pdf_converter_bp.route('/to-image', methods=['POST'])
@jwt_required()
@credits_required(amount=2)
def pdf_to_image():
    """Convierte PDF subido a imagen"""
    try:
        logger.info("=== INICIO PDF TO IMAGE ===")
        logger.info(f"Request content type: {request.content_type}")
        logger.info(f"Request files: {list(request.files.keys())}")
        
        # Verificar que se haya enviado un archivo
        if 'pdfFile' not in request.files:
            logger.error("No se encontró 'pdfFile' en request.files")
            logger.error(f"Archivos disponibles: {list(request.files.keys())}")
            logger.error(f"Request content type: {request.content_type}")
            return jsonify({'error': 'No se envió ningún archivo PDF'}), 400
        
        pdf_file = request.files['pdfFile']
        logger.info(f"Archivo recibido: {pdf_file.filename}")
        
        if pdf_file.filename == '':
            logger.error("Nombre de archivo vacío")
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        # Verificar que sea un PDF
        if not pdf_file.filename.lower().endswith('.pdf'):
            logger.error(f"Archivo no es PDF: {pdf_file.filename}")
            return jsonify({'error': 'Solo se aceptan archivos PDF'}), 400
        
        # Obtener parámetros opcionales
        img_format = request.form.get('imgFormat', 'tifflzw')
        start_page = request.form.get('startPage', '0')
        end_page = request.form.get('endPage', '0')
        
        logger.info(f"Parámetros: imgFormat={img_format}, startPage={start_page}, endPage={end_page}")
        
        # Preparar archivo para la API
        files = {'pdfFile': (pdf_file.filename, pdf_file.read(), 'application/pdf')}
        params = {
            'imgFormat': img_format,
            'startPage': start_page,
            'endPage': end_page
        }
        
        logger.info("Llamando a API externa...")
        
        # Llamar a la API de PDF Converter
        url = "https://pdf-converter-api.p.rapidapi.com/PdfToImage"
        headers = get_headers()
        
        response = requests.post(url, headers=headers, params=params, files=files)
        response.raise_for_status()
        
        logger.info("API externa respondió exitosamente")
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        logger.info(f"Response content length: {len(response.content)}")
        logger.info(f"Response content type: {response.headers.get('content-type', 'N/A')}")
        
        # Debug: ver los primeros bytes de la respuesta
        first_bytes = response.content[:20]
        logger.info(f"Primeros 20 bytes: {first_bytes.hex()}")
        
        # Verificar si la respuesta es JSON (error de la API)
        try:
            json_response = response.json()
            logger.error(f"API externa devolvió JSON en lugar de imagen: {json_response}")
            return jsonify({'error': f'Error de API externa: {json_response.get("message", "Error desconocido")}'}), 500
        except:
            # No es JSON, probablemente es imagen
            logger.info("Respuesta no es JSON, asumiendo que es imagen")
        
        # Verificar que la respuesta contenga datos válidos
        if not response.content or len(response.content) < 100:
            logger.error("Respuesta de API externa vacía o muy pequeña")
            return jsonify({'error': 'La API externa devolvió datos inválidos'}), 500
        
        # Para imágenes, devolver el contenido binario con headers apropiados
        content_type = 'image/tiff' if img_format == 'tifflzw' else 'image/jpeg'
        filename = f"{pdf_file.filename.replace('.pdf', '')}.{img_format}"
        
        # Crear respuesta con headers correctos
        from flask import Response
        return Response(
            response.content,
            status=200,
            headers={
                'Content-Type': content_type,
                'Content-Disposition': f'attachment; filename="{filename}"',
                'Content-Length': str(len(response.content))
            }
        )
        
    except requests.RequestException as e:
        logger.error(f"Error en API PDF Converter Image: {str(e)}")
        return jsonify({'error': 'Error al convertir el PDF a imagen'}), 500
    except Exception as e:
        logger.error(f"Error inesperado en pdf_to_image: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@pdf_converter_bp.route('/to-image-url', methods=['GET'])
@jwt_required()
@credits_required(amount=2)
def pdf_to_image_url():
    """Convierte PDF desde URL a imagen"""
    try:
        pdf_url = request.args.get('pdfUrl')
        if not pdf_url:
            return jsonify({'error': 'Se requiere pdfUrl'}), 400
        
        # Obtener parámetros opcionales
        img_format = request.args.get('imgFormat', 'tifflzw')
        start_page = request.args.get('startPage', '0')
        end_page = request.args.get('endPage', '0')
        
        # Llamar a la API de PDF Converter
        url = "https://pdf-converter-api.p.rapidapi.com/PdfToImage"
        headers = get_headers()
        params = {
            'pdfUrl': pdf_url,
            'imgFormat': img_format,
            'startPage': start_page,
            'endPage': end_page
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        # Para imágenes, devolver el contenido binario con headers apropiados
        content_type = 'image/tiff' if img_format == 'tifflzw' else 'image/jpeg'
        filename = f"converted_pdf.{img_format}"
        
        return response.content, 200, {
            'Content-Type': content_type,
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
        
    except requests.RequestException as e:
        logger.error(f"Error en API PDF Converter Image URL: {str(e)}")
        return jsonify({'error': 'Error al convertir el PDF desde URL a imagen'}), 500
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Handlers para CORS preflight
@pdf_converter_bp.route('', methods=['OPTIONS'])
@pdf_converter_bp.route('/', methods=['OPTIONS'])
def handle_options():
    return '', 200 