from flask import Blueprint, request, jsonify, current_app
import requests

pdf_converter_bp = Blueprint('pdf_converter', __name__)

@pdf_converter_bp.route('/to-text', methods=['POST'])
def pdf_to_text():
    # Verificar si es una subida de archivo o una URL
    if 'pdfFile' in request.files:
        # Caso: Archivo subido
        file = request.files['pdfFile']
        if not file:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        start_page = request.form.get('startPage', '0')
        end_page = request.form.get('endPage', '0')
        
        api_url = "https://pdf-converter-api.p.rapidapi.com/PdfToText"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "pdf-converter-api.p.rapidapi.com"
        }
        params = {
            "startPage": start_page,
            "endPage": end_page
        }
        files = {"pdfFile": (file.filename, file.stream, file.mimetype)}
        response = requests.post(api_url, headers=headers, params=params, files=files)
        
    else:
        # Caso: URL de PDF
        data = request.json
        pdf_url = data.get('pdfUrl')
        start_page = data.get('startPage', 0)
        end_page = data.get('endPage', 0)
        if not pdf_url:
            return jsonify({'error': 'pdfUrl is required'}), 400

        api_url = "https://pdf-converter-api.p.rapidapi.com/PdfToText"
        headers = {
            "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
            "x-rapidapi-host": "pdf-converter-api.p.rapidapi.com"
        }
        params = {
            "pdfUrl": pdf_url,
            "startPage": start_page,
            "endPage": end_page
        }
        response = requests.get(api_url, headers=headers, params=params)
    
    try:
        return jsonify(response.json()), response.status_code
    except Exception:
        return response.text, response.status_code

@pdf_converter_bp.route('/to-image', methods=['POST'])
def pdf_to_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No PDF file provided'}), 400
    file = request.files['file']
    img_format = request.form.get('imgFormat', 'tifflzw')
    start_page = request.form.get('startPage', '0')
    end_page = request.form.get('endPage', '0')

    api_url = "https://pdf-converter-api.p.rapidapi.com/PdfToImage"
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": "pdf-converter-api.p.rapidapi.com"
    }
    params = {
        "imgFormat": img_format,
        "startPage": start_page,
        "endPage": end_page
    }
    files = {"pdfFile": (file.filename, file.stream, file.mimetype)}
    response = requests.post(api_url, headers=headers, params=params, files=files)
    # Si la respuesta es una imagen, devolverla como archivo
    if response.status_code == 200 and response.headers.get('Content-Type', '').startswith('image'):
        return response.content, 200, {
            'Content-Type': response.headers['Content-Type'],
            'Content-Disposition': f'attachment; filename={file.filename}.{img_format}'
        }
    # Si es JSON, devolver el error
    try:
        return jsonify(response.json()), response.status_code
    except Exception:
        return response.text, response.status_code 