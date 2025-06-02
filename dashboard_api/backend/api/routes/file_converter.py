from flask import Blueprint, request, jsonify, current_app
import requests
import logging
import os
from werkzeug.utils import secure_filename

# Crear blueprint
file_converter_bp = Blueprint('file_converter', __name__)

# ID de aplicación en la base de datos
APP_ID = "file-converter"
logger = logging.getLogger(__name__)

# Registro de carga del módulo
print("===============================================")
print("CARGANDO MÓDULO file_converter.py")
print("===============================================")
logger.info("Módulo file_converter.py cargado")

@file_converter_bp.route('/rar-to-zip', methods=['POST'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def rar_to_zip():
    """Convertir archivo RAR a ZIP"""
    logger.info("Endpoint rar-to-zip llamado")
    print("Endpoint rar-to-zip llamado")
    try:
        # Verificar si se subió un archivo
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        
        file = request.files['file']
        
        # Verificar si el nombre del archivo está vacío
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        
        # Verificar la extensión del archivo
        if not file.filename.lower().endswith('.rar'):
            return jsonify({"error": "El archivo debe tener extensión .rar"}), 400
        
        # Configurar API
        api_url = "https://all-in-one-file-converter.p.rapidapi.com/api/rar-to-zip"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
        }
        
        # Preparar el archivo para enviar
        files = {"file": (file.filename, file.read(), file.content_type)}
        
        # Hacer solicitud a la API
        response = requests.post(api_url, files=files, headers=headers)
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            logger.error(f"Error en la API de conversión: {error_detail}")
            return jsonify({"error": "Error en la API de conversión", "details": error_detail}), response.status_code
        
        # Devolver el archivo convertido
        return response.content, 200, {
            'Content-Type': 'application/zip',
            'Content-Disposition': f'attachment; filename={os.path.splitext(secure_filename(file.filename))[0]}.zip'
        }
        
    except Exception as e:
        logger.error(f"Error al convertir RAR a ZIP: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500 

# Rutas para conversión de imágenes - Uno para cada combinación soportada
@file_converter_bp.route('/image-convert', methods=['POST'])
# @jwt_required()  # Comentado temporalmente para desarrollo
def image_convert():
    """Convertir imagen entre formatos (JPG, PNG, WEBP, etc.)"""
    logger.info("Endpoint image-convert llamado")
    print("Endpoint image-convert llamado")
    try:
        # Verificar si se subió un archivo
        if 'file' not in request.files:
            logger.error("No se envió ningún archivo")
            return jsonify({"error": "No se envió ningún archivo"}), 400
        
        file = request.files['file']
        logger.info(f"Archivo recibido: {file.filename}")
        
        # Verificar si el nombre del archivo está vacío
        if file.filename == '':
            logger.error("Nombre de archivo vacío")
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        
        # Verificar si se especificó el formato de destino
        if 'target_format' not in request.form:
            logger.error("No se especificó formato destino")
            return jsonify({"error": "No se especificó el formato de destino"}), 400
        
        target_format = request.form['target_format'].lower()
        logger.info(f"Formato destino: {target_format}")
        
        # Verificar formatos soportados
        supported_formats = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'tiff']
        if target_format not in supported_formats:
            logger.error(f"Formato destino no soportado: {target_format}")
            return jsonify({"error": f"Formato no soportado. Formatos soportados: {', '.join(supported_formats)}"}), 400
        
        # Obtener el formato original del archivo
        original_ext = os.path.splitext(file.filename)[1][1:].lower()
        logger.info(f"Formato original: {original_ext}")
        
        if original_ext not in supported_formats:
            logger.error(f"Formato original no soportado: {original_ext}")
            return jsonify({"error": f"Formato original no soportado. Formatos soportados: {', '.join(supported_formats)}"}), 400
        
        # No permitir convertir al mismo formato
        if original_ext == target_format or (original_ext == 'jpg' and target_format == 'jpeg') or (original_ext == 'jpeg' and target_format == 'jpg'):
            logger.error("Formatos origen y destino son iguales")
            return jsonify({"error": "El formato de origen y destino son iguales"}), 400
        
        # Normalizar jpg/jpeg para la URL de la API
        if original_ext == 'jpg':
            original_ext = 'jpeg'
        if target_format == 'jpg':
            target_format = 'jpeg'
            
        # Configurar API - Usamos la endpoint específica para cada conversión
        api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{original_ext}-to-{target_format}"
        logger.info(f"URL de API a usar: {api_url}")
        print(f"URL de API: {api_url}")
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
        }
        
        # Preparar el archivo para enviar (sin data adicional)
        files = {"file": (file.filename, file.read(), file.content_type)}
        
        # Hacer solicitud a la API
        logger.info("Enviando solicitud a RapidAPI...")
        response = requests.post(api_url, files=files, headers=headers)
        logger.info(f"Respuesta recibida: Status {response.status_code}")
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            logger.error(f"Error en la API de conversión de imagen: {error_detail}")
            return jsonify({"error": "Error en la API de conversión", "details": error_detail}), response.status_code
        
        # Determinar el tipo MIME correspondiente al formato de destino
        content_type_map = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'bmp': 'image/bmp',
            'gif': 'image/gif',
            'tiff': 'image/tiff'
        }
        
        # Ajustar el formato de destino para el nombre del archivo
        if target_format == 'jpeg':
            target_format = 'jpg'
            
        content_type = content_type_map.get(target_format, 'application/octet-stream')
        
        # Obtener el nombre base del archivo y añadir la nueva extensión
        filename_base = os.path.splitext(secure_filename(file.filename))[0]
        new_filename = f"{filename_base}.{target_format}"
        
        logger.info(f"Enviando respuesta al cliente: {new_filename}, Content-Type: {content_type}")
        
        # Devolver el archivo convertido
        return response.content, 200, {
            'Content-Type': content_type,
            'Content-Disposition': f'attachment; filename={new_filename}'
        }
        
    except Exception as e:
        logger.error(f"Error al convertir imagen: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

# Rutas específicas para cada tipo de conversión de imagen
def create_image_conversion_route(from_format, to_format):
    """Crear una ruta específica para un tipo de conversión de imagen"""
    @file_converter_bp.route(f'/{from_format}-to-{to_format}', methods=['POST'])
    def convert_image():
        try:
            # Verificar si se subió un archivo
            if 'file' not in request.files:
                return jsonify({"error": "No se envió ningún archivo"}), 400
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No se seleccionó ningún archivo"}), 400

            # Configurar API (usar endpoint general)
            api_url = "https://all-in-one-file-converter.p.rapidapi.com/api/image-convert"
            headers = {
                "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
                "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
            }
            files = {"file": (file.filename, file.read(), file.content_type)}
            data = {"toFormat": to_format}

            response = requests.post(api_url, files=files, data=data, headers=headers)

            if response.status_code != 200:
                error_detail = {
                    "status_code": response.status_code,
                    "message": response.text
                }
                logger.error(f"Error en la API de conversión de imagen: {error_detail}")
                return jsonify({"error": "Error en la API de conversión", "details": error_detail}), response.status_code

            # Determinar el tipo MIME correspondiente al formato de destino
            content_type_map = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'webp': 'image/webp',
                'bmp': 'image/bmp',
                'gif': 'image/gif',
                'tiff': 'image/tiff'
            }
            display_to_format = to_format
            if to_format == 'jpeg':
                display_to_format = 'jpg'
            content_type = content_type_map.get(to_format, 'application/octet-stream')
            filename_base = os.path.splitext(secure_filename(file.filename))[0]
            new_filename = f"{filename_base}.{display_to_format}"
            return response.content, 200, {
                'Content-Type': content_type,
                'Content-Disposition': f'attachment; filename={new_filename}'
            }
        except Exception as e:
            logger.error(f"Error al convertir imagen: {str(e)}")
            return jsonify({"error": f"Error: {str(e)}"}), 500
    convert_image.__name__ = f"convert_{from_format}_to_{to_format}"
    return convert_image

# Crear rutas específicas para las conversiones más comunes
# JPG/JPEG a otros formatos
create_image_conversion_route('jpeg', 'png')
create_image_conversion_route('jpeg', 'webp')
create_image_conversion_route('jpeg', 'gif')
create_image_conversion_route('jpeg', 'bmp')
create_image_conversion_route('jpeg', 'tiff')

# PNG a otros formatos
create_image_conversion_route('png', 'jpeg')
create_image_conversion_route('png', 'webp')
create_image_conversion_route('png', 'gif')
create_image_conversion_route('png', 'bmp')
create_image_conversion_route('png', 'tiff')

# WEBP a otros formatos
create_image_conversion_route('webp', 'jpeg')
create_image_conversion_route('webp', 'png')
create_image_conversion_route('webp', 'gif')
create_image_conversion_route('webp', 'bmp')
create_image_conversion_route('webp', 'tiff')

# GIF a otros formatos
create_image_conversion_route('gif', 'jpeg')
create_image_conversion_route('gif', 'png')
create_image_conversion_route('gif', 'webp')
create_image_conversion_route('gif', 'bmp')
create_image_conversion_route('gif', 'tiff')

# BMP a otros formatos
create_image_conversion_route('bmp', 'jpeg')
create_image_conversion_route('bmp', 'png')
create_image_conversion_route('bmp', 'webp')
create_image_conversion_route('bmp', 'gif')
create_image_conversion_route('bmp', 'tiff')

# TIFF a otros formatos
create_image_conversion_route('tiff', 'jpeg')
create_image_conversion_route('tiff', 'png')
create_image_conversion_route('tiff', 'webp')
create_image_conversion_route('tiff', 'gif')
create_image_conversion_route('tiff', 'bmp')

# Endpoint para obtener formatos soportados para un tipo de archivo
@file_converter_bp.route('/supported-formats', methods=['GET'])
def supported_formats():
    """Obtener formatos soportados para un tipo de archivo"""
    logger.info("Endpoint supported-formats llamado")
    print("Endpoint supported-formats llamado")
    try:
        input_format = request.args.get('input')
        
        if not input_format:
            return jsonify({"error": "No se especificó el formato de entrada"}), 400
            
        # Configurar API
        api_url = "https://all-in-one-file-converter.p.rapidapi.com/api/supported-file"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
        }
        
        # Hacer solicitud a la API
        response = requests.get(
            api_url,
            headers=headers,
            params={"input": input_format}
        )
        
        # Verificar respuesta
        if response.status_code != 200:
            error_detail = {
                "status_code": response.status_code,
                "message": response.text
            }
            logger.error(f"Error al obtener formatos soportados: {error_detail}")
            return jsonify({"error": "Error al obtener formatos soportados", "details": error_detail}), response.status_code
            
        # Devolver la respuesta
        return jsonify(response.json()), 200
        
    except Exception as e:
        logger.error(f"Error al obtener formatos soportados: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500

# Ruta adicional para pruebas
@file_converter_bp.route('/ping', methods=['GET'])
def ping():
    """Endpoint de prueba para verificar que el blueprint está registrado correctamente"""
    logger.info("Endpoint ping llamado")
    print("Endpoint ping llamado")
    return jsonify({"message": "Ping exitoso en file_converter_bp"}), 200 

@file_converter_bp.route('/pdf-to-word', methods=['POST'])
def pdf_to_word():
    """Convertir PDF a Word"""
    print("Endpoint PDF to Word llamado")
    
    try:
        # Verificar si se subió un archivo
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        
        file = request.files['file']
        print(f"Archivo recibido: {file.filename}")
        
        # Verificar si el nombre del archivo está vacío
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        
        # Verificar la extensión del archivo
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "El archivo debe tener extensión .pdf"}), 400
        
        # Configurar API
        api_url = "https://all-in-one-file-converter.p.rapidapi.com/api/pdf-to-word"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
        }
        
        # Preparar el archivo para enviar
        files = {"file": (file.filename, file.read(), file.content_type)}
        
        print(f"Enviando solicitud a: {api_url}")
        print(f"Headers: {headers}")
        
        # Hacer solicitud a la API
        response = requests.post(api_url, files=files, headers=headers)
        
        print(f"Respuesta recibida. Status: {response.status_code}")
        
        # Verificar respuesta
        if response.status_code != 200:
            print(f"Error en la API: {response.text}")
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        
        # Devolver el archivo convertido
        return response.content, 200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': f'attachment; filename={os.path.splitext(secure_filename(file.filename))[0]}.docx'
        }
        
    except Exception as e:
        print(f"Error en PDF to Word: {str(e)}")
        return jsonify({"error": f"Error: {str(e)}"}), 500 

# Ejemplo para PNG a WEBP
@file_converter_bp.route('/png-to-webp', methods=['POST'])
def png_to_webp():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        api_url = "https://all-in-one-image-converter.p.rapidapi.com/api/png-to-webp"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-image-converter.p.rapidapi.com"
        }
        files = {"file": (file.filename, file.read(), file.content_type)}
        response = requests.post(api_url, files=files, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        return response.content, 200, {
            'Content-Type': 'image/webp',
            'Content-Disposition': f'attachment; filename={file.filename.rsplit(".", 1)[0]}.webp'
        }
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@file_converter_bp.route('/jpg-to-webp', methods=['POST'])
def jpg_to_webp():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        api_url = "https://all-in-one-image-converter.p.rapidapi.com/api/jpg-to-webp"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-image-converter.p.rapidapi.com"
        }
        files = {"file": (file.filename, file.read(), file.content_type)}
        response = requests.post(api_url, files=files, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        return response.content, 200, {
            'Content-Type': 'image/webp',
            'Content-Disposition': f'attachment; filename={file.filename.rsplit(".", 1)[0]}.webp'
        }
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@file_converter_bp.route('/jpg-to-png', methods=['POST'])
def jpg_to_png():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        api_url = "https://all-in-one-image-converter.p.rapidapi.com/api/jpg-to-png"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-image-converter.p.rapidapi.com"
        }
        files = {"file": (file.filename, file.read(), file.content_type)}
        response = requests.post(api_url, files=files, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        return response.content, 200, {
            'Content-Type': 'image/png',
            'Content-Disposition': f'attachment; filename={file.filename.rsplit(".", 1)[0]}.png'
        }
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@file_converter_bp.route('/png-to-jpg', methods=['POST'])
def png_to_jpg():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        api_url = "https://all-in-one-image-converter.p.rapidapi.com/api/png-to-jpg"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-image-converter.p.rapidapi.com"
        }
        files = {"file": (file.filename, file.read(), file.content_type)}
        response = requests.post(api_url, files=files, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        return response.content, 200, {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': f'attachment; filename={file.filename.rsplit(".", 1)[0]}.jpg'
        }
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@file_converter_bp.route('/gif-to-mp4', methods=['POST'])
def gif_to_mp4():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        api_url = "https://all-in-one-image-converter.p.rapidapi.com/api/gif-to-mp4"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "all-in-one-image-converter.p.rapidapi.com"
        }
        files = {"file": (file.filename, file.read(), file.content_type)}
        response = requests.post(api_url, files=files, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Error en la API de conversión", "details": response.text}), response.status_code
        return response.content, 200, {
            'Content-Type': 'video/mp4',
            'Content-Disposition': f'attachment; filename={file.filename.rsplit(".", 1)[0]}.mp4'
        }
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500 