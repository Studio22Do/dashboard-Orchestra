from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from marshmallow import ValidationError
import secrets
import datetime
import os
import requests
from urllib.parse import urlencode

from api import db
from api.models.user import User
from api.utils.schemas import UserSchema, LoginSchema, ChangePasswordSchema
from api.utils.error_handlers import AuthenticationError, ValidationError as ApiValidationError
from utils.version_control import require_version

# Crear blueprint
auth_bp = Blueprint('auth', __name__)

# Variables de Google OAuth
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5000/api/beta_v2/auth/google/callback')

# Esquemas
user_schema = UserSchema()
login_schema = LoginSchema()
change_password_schema = ChangePasswordSchema()

# Diccionarios para almacenar tokens temporalmente (solo para desarrollo)
verification_tokens = {}  # {token: user_id}
reset_password_tokens = {}  # {token: {user_id: id, expires: datetime}}

@auth_bp.route('/google/url', methods=['GET'])
@require_version('beta_v2')
def google_auth_url():
    """Generar URL de autorización de Google"""
    if not GOOGLE_CLIENT_ID:
        raise ApiValidationError("Google OAuth no está configurado")
    
    # Parámetros para la URL de autorización
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'scope': 'email profile',
        'response_type': 'code',
        'access_type': 'offline'
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    return jsonify({
        'auth_url': auth_url
    }), 200

@auth_bp.route('/google/callback', methods=['GET'])
@require_version('beta_v2')
def google_auth_callback():
    """Callback de Google OAuth"""
    try:
        # Obtener el código de autorización
        code = request.args.get('code')
        if not code:
            raise ApiValidationError("Código de autorización no recibido")
        
        # Intercambiar código por tokens
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': GOOGLE_REDIRECT_URI
        }
        
        response = requests.post(token_url, data=token_data)
        if response.status_code != 200:
            raise ApiValidationError("Error al obtener tokens de Google")
        
        tokens = response.json()
        access_token = tokens.get('access_token')
        
        # Obtener información del usuario
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_info_url, headers=headers)
        
        if user_response.status_code != 200:
            raise ApiValidationError("Error al obtener información del usuario")
        
        google_user = user_response.json()
        
        # Buscar o crear usuario
        user = User.query.filter_by(email=google_user['email']).first()
        
        if not user:
            # Crear nuevo usuario
            user = User(
                email=google_user['email'],
                name=google_user.get('name', 'Usuario Google'),
                role='user',
                is_active=True,
                is_verified=True
            )
            # Generar contraseña aleatoria (no se usará)
            user.password = secrets.token_urlsafe(32)
            db.session.add(user)
            db.session.commit()
        
        # Generar tokens JWT
        access_token_jwt = create_access_token(identity=str(user.id))
        refresh_token_jwt = create_refresh_token(identity=str(user.id))
        
        # Redirigir al frontend con tokens
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        redirect_url = f"{frontend_url}/auth/callback?access_token={access_token_jwt}&refresh_token={refresh_token_jwt}"
        
        return redirect(redirect_url)
        
    except Exception as e:
        print(f'[GOOGLE AUTH ERROR] {str(e)}')
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        error_url = f"{frontend_url}/auth/error?message={str(e)}"
        return redirect(error_url)

@auth_bp.route('/register', methods=['POST'])
@require_version('beta_v2')
def register():
    print('--- INICIO /register ---')
    try:
        # Validar datos de entrada
        data = request.get_json()
        print('Datos recibidos:', data)
        if not data:
            print('No se proporcionaron datos')
            raise ApiValidationError("No se proporcionaron datos")
        
        # Deserializar y validar con marshmallow
        user_data = user_schema.load(data)
        print('Datos validados:', user_data)
        
        # Verificar si el correo ya está registrado
        if User.query.filter_by(email=user_data['email']).first():
            print('El correo ya está registrado:', user_data['email'])
            raise ApiValidationError("El correo electrónico ya está registrado")
        
        # Crear usuario (activo por defecto para desarrollo)
        user = User(
            email=user_data['email'],
            password=user_data['password'],
            name=user_data['name'],
            role=user_data.get('role', 'user')
        )
        print('Usuario a crear:', user)
        
        # En desarrollo, el usuario se crea activo
        user.is_active = True
        
        # Guardar en la base de datos
        db.session.add(user)
        db.session.commit()
        print('Usuario creado y guardado en la base de datos')
        
        # Generar tokens de acceso inmediatamente
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        print('Tokens generados')
        
        # Retornar respuesta con tokens
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except ValidationError as e:
        print('ValidationError:', str(e))
        raise ApiValidationError(str(e.messages))
    except Exception as e:
        db.session.rollback()
        print('Exception general:', str(e))
        raise ApiValidationError(str(e))

@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    """Verificar email del usuario"""
    token = request.args.get('token')
    if not token or token not in verification_tokens:
        raise AuthenticationError("Token de verificación inválido o expirado")
    
    user_id = verification_tokens.pop(token)
    user = User.query.get(user_id)
    
    if not user:
        raise AuthenticationError("Usuario no encontrado")
    
    user.is_active = True
    db.session.commit()
    
    # Generar tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Email verificado exitosamente',
        'user': user_schema.dump(user),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
@require_version('beta_v2')
def forgot_password():
    """Iniciar proceso de recuperación de contraseña"""
    data = request.get_json()
    if not data or 'email' not in data:
        raise ApiValidationError("Se requiere el email")
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        # Por seguridad, no revelamos si el email existe o no
        return jsonify({
            'message': 'Si el email existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña'
        }), 200
    
    # Generar token de reset con expiración (24 horas)
    reset_token = secrets.token_urlsafe(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    reset_password_tokens[reset_token] = {'user_id': user.id, 'expires': expires}
    
    # Simular envío de email (print para desarrollo)
    reset_url = f"/reset-password?token={reset_token}"
    print("\n=== EMAIL DE RECUPERACIÓN DE CONTRASEÑA ===")
    print(f"Para: {user.email}")
    print(f"Asunto: Recupera tu contraseña en Dashboard Orchestra")
    print("\nContenido:")
    print(f"Hola {user.name},")
    print("Has solicitado restablecer tu contraseña. Usa el siguiente enlace para crear una nueva contraseña:")
    print(f"URL de recuperación: {reset_url}")
    print("Este enlace expirará en 24 horas.")
    print("Si no solicitaste este cambio, ignora este mensaje.")
    print("=====================================\n")
    
    return jsonify({
        'message': 'Si el email existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña'
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
@require_version('beta_v2')
def reset_password():
    """Restablecer contraseña con token"""
    data = request.get_json()
    if not data or 'token' not in data or 'new_password' not in data:
        raise ApiValidationError("Se requieren token y nueva contraseña")
    
    token = data['token']
    if token not in reset_password_tokens:
        raise AuthenticationError("Token inválido o expirado")
    
    token_data = reset_password_tokens[token]
    if datetime.datetime.utcnow() > token_data['expires']:
        reset_password_tokens.pop(token)
        raise AuthenticationError("Token expirado")
    
    user = User.query.get(token_data['user_id'])
    if not user:
        raise AuthenticationError("Usuario no encontrado")
    
    # Actualizar contraseña
    user.password = data['new_password']
    db.session.commit()
    
    # Eliminar token usado
    reset_password_tokens.pop(token)
    
    return jsonify({
        'message': 'Contraseña actualizada exitosamente'
    }), 200

@auth_bp.route('/login', methods=['POST'])
@require_version('beta_v2')
def login():
    """Iniciar sesión"""
    try:
        # Validar datos de entrada
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Deserializar y validar con marshmallow
        login_data = login_schema.load(data)
        
        # Buscar usuario por email
        user = User.query.filter_by(email=login_data['email']).first()
        
        # Verificar credenciales
        if not user or not user.verify_password(login_data['password']):
            raise AuthenticationError("Credenciales incorrectas")
        
        # Verificar si el usuario está activo
        if not user.is_active:
            raise AuthenticationError("Cuenta desactivada")
        
        # Generar tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        # Retornar respuesta
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except ValidationError as e:
        print(f'[LOGIN ERROR] ValidationError: {str(e)}')
        raise ApiValidationError(str(e.messages))
    except Exception as e:
        print(f'[LOGIN ERROR] Exception: {str(e)}')
        print(f'[LOGIN ERROR] Type: {type(e)}')
        if isinstance(e, AuthenticationError) or isinstance(e, ApiValidationError):
            raise e
        raise ApiValidationError(str(e))

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refrescar token de acceso"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_active:
        raise AuthenticationError("Usuario no encontrado o inactivo")
    
    access_token = create_access_token(identity=str(current_user_id))
    
    return jsonify({
        'access_token': access_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
@require_version('beta_v2')
def get_user_info():
    """Obtener información del usuario autenticado"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthenticationError("Usuario no encontrado")
    
    return jsonify(user_schema.dump(user)), 200 

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
@require_version('beta_v2')
def change_password():
    """Cambiar la contraseña del usuario autenticado"""
    try:
        # Obtener y validar datos
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Validar datos con el esquema
        password_data = change_password_schema.load(data)
        
        # Obtener usuario actual
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        # Verificar contraseña actual
        if not user.verify_password(password_data['current_password']):
            raise AuthenticationError("Contraseña actual incorrecta")
        
        # Actualizar contraseña
        user.password = password_data['new_password']
        db.session.commit()
        
        return jsonify({
            'message': 'Contraseña actualizada exitosamente'
        }), 200
        
    except ValidationError as e:
        raise ApiValidationError(str(e.messages))
    except Exception as e:
        db.session.rollback()
        if isinstance(e, (AuthenticationError, ApiValidationError)):
            raise e
        raise ApiValidationError(str(e)) 