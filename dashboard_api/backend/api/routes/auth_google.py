from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

auth_google_bp = Blueprint('auth_google', __name__)

@auth_google_bp.route('/api/auth/google', methods=['POST'])
def google_login():
    data = request.json
    token = data.get('credential')
    if not token:
        return jsonify({'error': 'No se recibió el token de Google'}), 400

    try:
        # Reemplaza esto con tu CLIENT_ID de Google OAuth
        CLIENT_ID = "TU_CLIENT_ID_DE_GOOGLE"
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        # Aquí normalmente buscarías/crearías el usuario en la base de datos
        # Por ahora, solo simula el login
        user_email = idinfo.get('email')
        user_name = idinfo.get('name')
        picture = idinfo.get('picture')

        # Simula un JWT propio (en producción, genera un JWT real)
        fake_jwt = "jwt_simulado_para_" + user_email

        return jsonify({
            'message': 'Login con Google exitoso',
            'user': {
                'email': user_email,
                'name': user_name,
                'picture': picture
            },
            'token': fake_jwt
        }), 200

    except ValueError as e:
        return jsonify({'error': 'Token de Google inválido', 'details': str(e)}), 401 