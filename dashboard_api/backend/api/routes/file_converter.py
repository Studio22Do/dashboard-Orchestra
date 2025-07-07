"""Módulo para conversión de archivos"""
from flask import Blueprint, request, jsonify, current_app
import requests
import logging
import os
from werkzeug.utils import secure_filename
from typing import Dict, Tuple, Optional
from functools import wraps

# Crear blueprint
file_converter_bp = Blueprint('file_converter', __name__)

# ID de aplicación en la base de datos
APP_ID = "file-converter"
logger = logging.getLogger(__name__)

# Constantes
SUPPORTED_IMAGE_FORMATS = {
    'jpg': {'mime': 'image/jpeg', 'ext': 'jpg'},
    'jpeg': {'mime': 'image/jpeg', 'ext': 'jpg'},
    'png': {'mime': 'image/png', 'ext': 'png'},
    'webp': {'mime': 'image/webp', 'ext': 'webp'},
    'gif': {'mime': 'image/gif', 'ext': 'gif'},
    'bmp': {'mime': 'image/bmp', 'ext': 'bmp'},
    'tiff': {'mime': 'image/tiff', 'ext': 'tiff'}
}

SUPPORTED_DOCUMENT_FORMATS = {
    'pdf': {'mime': 'application/pdf', 'ext': 'pdf'},
    'docx': {'mime': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'ext': 'docx'},
    'doc': {'mime': 'application/msword', 'ext': 'doc'}
}

SUPPORTED_ARCHIVE_FORMATS = {
    'rar': {'mime': 'application/x-rar-compressed', 'ext': 'rar'},
    'zip': {'mime': 'application/zip', 'ext': 'zip'}
}

SUPPORTED_AUDIO_FORMATS = {
    'mp3': {'mime': 'audio/mpeg', 'ext': 'mp3'},
    'wav': {'mime': 'audio/wav', 'ext': 'wav'},
    'ogg': {'mime': 'audio/ogg', 'ext': 'ogg'},
    'aac': {'mime': 'audio/aac', 'ext': 'aac'},
    'ac3': {'mime': 'audio/ac3', 'ext': 'ac3'},
    'flac': {'mime': 'audio/flac', 'ext': 'flac'},
    'm4a': {'mime': 'audio/mp4', 'ext': 'm4a'}
}

# Decorador para manejo de errores común
def handle_conversion_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error en la API de conversión: {str(e)}")
            return jsonify({"error": "Error en la comunicación con el servicio de conversión", "details": str(e)}), 502
        except Exception as e:
            logger.error(f"Error inesperado: {str(e)}")
            return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500
    return wrapper

def validate_file_upload() -> Tuple[Optional[str], Optional[Tuple[Dict, int]]]:
    """Valida la subida de archivos y retorna el archivo o un error"""
    if 'file' not in request.files:
        return None, ({"error": "No se envió ningún archivo"}, 400)
    
    file = request.files['file']
    if file.filename == '':
        return None, ({"error": "No se seleccionó ningún archivo"}, 400)
    
    return file, None

def get_file_extension(filename: str) -> str:
    """Obtiene la extensión del archivo normalizada"""
    ext = os.path.splitext(filename)[1][1:].lower()
    return 'jpg' if ext == 'jpeg' else ext

@file_converter_bp.route('/convert', methods=['POST'])
@handle_conversion_errors
def convert_file():
    """
    Endpoint unificado para conversión de archivos.
    Soporta conversión de imágenes, documentos y archivos comprimidos.
    
    Parámetros:
    - file: Archivo a convertir (multipart/form-data)
    - target_format: Formato de destino (form-data)
    - options: Opciones adicionales específicas del formato (JSON, opcional)
    
    Returns:
    - Archivo convertido o error en formato JSON
    """
    # Validar subida de archivo
    file, error = validate_file_upload()
    if error:
        return jsonify(error[0]), error[1]
    
    # Obtener y validar formato destino
    target_format = request.form.get('target_format', '').lower()
    if not target_format:
        return jsonify({"error": "No se especificó el formato de destino"}), 400
    
    # Normalizar formato destino
    target_format = 'jpg' if target_format == 'jpeg' else target_format
    
    # Obtener formato original
    original_format = get_file_extension(file.filename)
    
    # Determinar el tipo de conversión
    if original_format in SUPPORTED_IMAGE_FORMATS and target_format in SUPPORTED_IMAGE_FORMATS:
        return handle_image_conversion(file, original_format, target_format)
    elif original_format in SUPPORTED_DOCUMENT_FORMATS and target_format in SUPPORTED_DOCUMENT_FORMATS:
        return handle_document_conversion(file, original_format, target_format)
    elif original_format in SUPPORTED_ARCHIVE_FORMATS and target_format in SUPPORTED_ARCHIVE_FORMATS:
        return handle_archive_conversion(file, original_format, target_format)
    elif original_format in SUPPORTED_AUDIO_FORMATS and target_format in SUPPORTED_AUDIO_FORMATS:
        return handle_audio_conversion(file, original_format, target_format)
    else:
        return jsonify({
            "error": "Combinación de formatos no soportada",
            "supported_formats": {
                "images": list(SUPPORTED_IMAGE_FORMATS.keys()),
                "documents": list(SUPPORTED_DOCUMENT_FORMATS.keys()),
                "archives": list(SUPPORTED_ARCHIVE_FORMATS.keys()),
                "audio": list(SUPPORTED_AUDIO_FORMATS.keys())
            }
        }), 400

def handle_image_conversion(file, original_format: str, target_format: str):
    """Maneja la conversión de imágenes"""
    # No permitir conversión al mismo formato
    if original_format == target_format:
        return jsonify({"error": "El formato de origen y destino son iguales"}), 400
    
    # Configurar API
    api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{original_format}-to-{target_format}"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
    }
    
    # Preparar archivo
    files = {"file": (file.filename, file.read(), file.content_type)}
    
    # Realizar conversión
    response = requests.post(api_url, files=files, headers=headers)
    response.raise_for_status()
    
    # Preparar respuesta
    content_type = SUPPORTED_IMAGE_FORMATS[target_format]['mime']
    ext = SUPPORTED_IMAGE_FORMATS[target_format]['ext']
    filename = f"{os.path.splitext(secure_filename(file.filename))[0]}.{ext}"
    
    return response.content, 200, {
        'Content-Type': content_type,
        'Content-Disposition': f'attachment; filename={filename}'
    }

def handle_document_conversion(file, original_format: str, target_format: str):
    """Maneja la conversión de documentos"""
    if not file.filename.lower().endswith(f'.{original_format}'):
        return jsonify({"error": f"El archivo debe tener extensión .{original_format}"}), 400
    
    api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{original_format}-to-{target_format}"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
    }
    
    files = {"file": (file.filename, file.read(), file.content_type)}
    response = requests.post(api_url, files=files, headers=headers)
    response.raise_for_status()
    
    content_type = SUPPORTED_DOCUMENT_FORMATS[target_format]['mime']
    ext = SUPPORTED_DOCUMENT_FORMATS[target_format]['ext']
    filename = f"{os.path.splitext(secure_filename(file.filename))[0]}.{ext}"
    
    return response.content, 200, {
        'Content-Type': content_type,
        'Content-Disposition': f'attachment; filename={filename}'
    }

def handle_archive_conversion(file, original_format: str, target_format: str):
    """Maneja la conversión de archivos comprimidos"""
    if not file.filename.lower().endswith(f'.{original_format}'):
        return jsonify({"error": f"El archivo debe tener extensión .{original_format}"}), 400
    
    api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{original_format}-to-{target_format}"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
    }
    
    files = {"file": (file.filename, file.read(), file.content_type)}
    response = requests.post(api_url, files=files, headers=headers)
    response.raise_for_status()
    
    content_type = SUPPORTED_ARCHIVE_FORMATS[target_format]['mime']
    ext = SUPPORTED_ARCHIVE_FORMATS[target_format]['ext']
    filename = f"{os.path.splitext(secure_filename(file.filename))[0]}.{ext}"
    
    return response.content, 200, {
        'Content-Type': content_type,
        'Content-Disposition': f'attachment; filename={filename}'
    }

def handle_audio_conversion(file, original_format: str, target_format: str):
    """Maneja la conversión de archivos de audio"""
    if not file.filename.lower().endswith(f'.{original_format}'):
        return jsonify({"error": f"El archivo debe tener extensión .{original_format}"}), 400
    
    # No permitir conversión al mismo formato
    if original_format == target_format:
        return jsonify({"error": "El formato de origen y destino son iguales"}), 400
    
    api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{original_format}-to-{target_format}"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
    }
    
    files = {"file": (file.filename, file.read(), file.content_type)}
    response = requests.post(api_url, files=files, headers=headers)
    response.raise_for_status()
    
    content_type = SUPPORTED_AUDIO_FORMATS[target_format]['mime']
    ext = SUPPORTED_AUDIO_FORMATS[target_format]['ext']
    filename = f"{os.path.splitext(secure_filename(file.filename))[0]}.{ext}"
    
    return response.content, 200, {
        'Content-Type': content_type,
        'Content-Disposition': f'attachment; filename={filename}'
    }

@file_converter_bp.route('/supported-formats', methods=['GET'])
def supported_formats():
    """Obtiene los formatos soportados para conversión"""
    return jsonify({
        "image_formats": list(SUPPORTED_IMAGE_FORMATS.keys()),
        "document_formats": list(SUPPORTED_DOCUMENT_FORMATS.keys()),
        "archive_formats": list(SUPPORTED_ARCHIVE_FORMATS.keys()),
        "audio_formats": list(SUPPORTED_AUDIO_FORMATS.keys())
    }), 200

@file_converter_bp.route('/ping', methods=['GET'])
def ping():
    """Endpoint de prueba para verificar que el servicio está activo"""
    return jsonify({"status": "ok", "message": "File converter service is running"}), 200 