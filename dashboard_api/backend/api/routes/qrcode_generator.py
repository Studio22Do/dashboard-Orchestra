from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import requests
from api.utils.decorators import credits_required
from urllib.parse import urlencode

qrcode_generator_bp = Blueprint('qrcode_generator', __name__)

RAPIDAPI_HOST = "qrcode-smart-generator.p.rapidapi.com"
BASE_URL = f"https://{RAPIDAPI_HOST}"


@qrcode_generator_bp.route('/health', methods=['GET'])
@jwt_required()
def health_check():
    headers = {
        "x-rapidapi-key": current_app.config['RAPIDAPI_KEY'],
        "x-rapidapi-host": RAPIDAPI_HOST
    }
    try:
        response = requests.get(f"{BASE_URL}/health", headers=headers, timeout=15)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": "Error conectando a QRCode API", "details": str(e)}), 502


@qrcode_generator_bp.route('/generate', methods=['POST'])
@jwt_required()
@credits_required(amount=1)
def generate_qr_code():
    data = request.get_json(silent=True) or {}
    qr_type = (data.get('type') or 'text').lower()
    payload = data.get('payload') or {}

    path_by_type = {
        'text': '/qr/text',
        'email': '/qr/email',
        'wifi': '/qr/wifi',
        'sms': '/qr/sms',
        'telephone': '/qr/telephone',
        'contact': '/qr/contact',
        'crypto': '/qr/crypto',
        'geolocation': '/qr/geolocation',
        'arbitrary': '/qr/arbitrary',
        'auto': '/qr/auto',
        'batch': '/qr/batch',
    }

    if qr_type not in path_by_type:
        return jsonify({
            'error': 'Tipo de QR no soportado',
            'supported_types': list(path_by_type.keys())
        }), 400

    headers = {
        'x-rapidapi-key': current_app.config['RAPIDAPI_KEY'],
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
    }

    def build_text_content(qtype: str, pl: dict) -> str:
        qtype = (qtype or '').lower()
        pl = pl or {}
        if qtype in {'text', 'arbitrary', 'auto'}:
            return str(pl.get('data') or '')
        if qtype == 'email':
            params = {
                'subject': pl.get('subject') or '',
                'body': pl.get('body') or ''
            }
            email_addr = pl.get('email') or pl.get('address') or ''
            query = urlencode({k: v for k, v in params.items() if v})
            return f"mailto:{email_addr}{('?' + query) if query else ''}"
        if qtype == 'wifi':
            ssid = pl.get('ssid') or ''
            password = pl.get('password') or ''
            encryption = (pl.get('encryption') or 'WPA').upper()
            hidden = 'true' if str(pl.get('hidden')).lower() in {'1','true','yes'} else 'false'
            return f"WIFI:T:{encryption};S:{ssid};P:{password};H:{hidden};;"
        if qtype == 'sms':
            number = pl.get('number') or ''
            body = pl.get('body') or ''
            query = urlencode({'body': body}) if body else ''
            return f"sms:{number}{('?' + query) if query else ''}"
        if qtype == 'telephone':
            number = pl.get('number') or ''
            return f"tel:{number}"
        if qtype == 'contact':
            name = pl.get('name') or ''
            phone = pl.get('phone') or ''
            email = pl.get('email') or ''
            address = pl.get('address') or ''
            return f"MECARD:N:{name};TEL:{phone};EMAIL:{email};ADR:{address};;"
        if qtype == 'crypto':
            currency = (pl.get('currency') or 'BTC').lower()
            address = pl.get('address') or ''
            amount = pl.get('amount')
            if currency == 'btc':
                query = urlencode({'amount': amount}) if amount else ''
                return f"bitcoin:{address}{('?' + query) if query else ''}"
            return str(pl.get('data') or address)
        if qtype == 'geolocation':
            lat = pl.get('latitude') or pl.get('lat') or ''
            lon = pl.get('longitude') or pl.get('lng') or ''
            return f"geo:{lat},{lon}"
        return str(pl.get('data') or '')

    try:
        # Fallback inteligente: si el tipo requiere campos específicos pero recibimos sólo "data",
        # redirigimos al endpoint /qr/auto para evitar errores de validación de la API externa.
        needs_structured = {'email', 'wifi', 'sms', 'telephone', 'contact', 'crypto', 'geolocation'}
        if qr_type in needs_structured and isinstance(payload, dict) and 'data' in payload and len(payload.keys()) <= 2:
            qr_type = 'auto'
        url = f"{BASE_URL}{path_by_type[qr_type]}"
        # Asegurar formato por defecto
        if isinstance(payload, dict) and 'output_format' not in payload:
            payload['output_format'] = 'png'
        response = requests.post(url, json=payload, headers=headers, timeout=30)

        # Si la API responde 401/403, intentar fallback con proveedor alterno SVG
        if response.status_code in (401, 403):
            # Intento 1: mismo proveedor pero usando /qr/text con contenido construido compatible con plan BASIC
            try:
                text_payload = {
                    'data': build_text_content(qr_type, payload if isinstance(payload, dict) else {}),
                    'output_format': 'png'
                }
                text_resp = requests.post(f"{BASE_URL}/qr/text", json=text_payload, headers=headers, timeout=30)
                if text_resp.status_code == 200:
                    body = text_resp.json() if text_resp.headers.get('content-type','').startswith('application/json') else {'raw': text_resp.text}
                    body['provider'] = 'qrcode-smart-generator/text'
                    return jsonify(body), 200
            except Exception:
                pass

            alt_url = 'https://smart-qr-code-with-logo.p.rapidapi.com/generate_svg'
            alt_headers = {
                'content-type': 'application/json',
                'x-rapidapi-key': current_app.config['RAPIDAPI_KEY'],
                'x-rapidapi-host': 'smart-qr-code-with-logo.p.rapidapi.com',
            }
            alt_payload = {'text': build_text_content(qr_type, payload if isinstance(payload, dict) else {})}
            alt_resp = requests.post(alt_url, headers=alt_headers, json=alt_payload, timeout=30)
            if alt_resp.status_code == 200:
                try:
                    svg = alt_resp.content.decode('utf-8')
                except Exception:
                    svg = alt_resp.text
                return jsonify({'svg': svg, 'provider': 'smart-qr-code-with-logo'}), 200

        # Respuesta normal
        content_type = (response.headers.get('content-type') or '').lower()
        # Detección robusta del tipo de retorno
        try:
            if content_type.startswith('application/json'):
                body = response.json()
            else:
                # Heurísticas por contenido
                data_bytes = response.content or b''
                starts_png = data_bytes[:4] == b'\x89PNG'
                looks_svg = data_bytes[:300].lstrip().lower().startswith(b'<svg') or b'<svg' in data_bytes[:1000].lower()
                if looks_svg:
                    try:
                        svg_text = data_bytes.decode('utf-8', errors='ignore')
                    except Exception:
                        svg_text = response.text
                    body = { 'svg': svg_text, 'content_type': 'image/svg+xml' }
                else:
                    # Por defecto devolver base64 (muchas APIs devuelven image/png u octet-stream)
                    import base64
                    image_b64 = base64.b64encode(data_bytes).decode('utf-8')
                    inferred = (
                        'image/png' if starts_png else (
                            content_type if content_type.startswith('image/') else 'image/png'
                        )
                    )
                    body = {
                        'image_base64': image_b64,
                        'content_type': inferred
                    }
        except Exception:
            # Último recurso: devolver base64 del cuerpo; evita que llegue binario como texto
            import base64
            body = {
                'image_base64': base64.b64encode(response.content or b'').decode('utf-8'),
                'content_type': content_type or 'image/png'
            }
        # Validaciones finales: si no fue 200 o no hay artefacto utilizable, lanzar excepción para reintegro
        if response.status_code != 200:
            raise Exception(f"QRCode API error {response.status_code}: {response.text[:200]}")
        if not (isinstance(body, dict) and (body.get('image_base64') or body.get('svg') or body.get('image_url') or body.get('file_url'))):
            raise Exception("QRCode API returned no image content")
        return jsonify(body), 200
    except requests.RequestException as e:
        # Forzar excepción para que el decorador reintegre créditos
        raise Exception(f"Network error calling QRCode API: {str(e)}")


