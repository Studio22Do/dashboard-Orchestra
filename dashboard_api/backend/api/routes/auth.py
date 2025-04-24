from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from marshmallow import ValidationError

from api import db
from api.models.user import User
from api.utils.schemas import UserSchema, LoginSchema
from api.utils.error_handlers import AuthenticationError, ValidationError as ApiValidationError

# Crear blueprint
auth_bp = Blueprint('auth', __name__)

# Esquemas
user_schema = UserSchema()
login_schema = LoginSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registrar un nuevo usuario"""
    try:
        # Validar datos de entrada
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Deserializar y validar con marshmallow
        user_data = user_schema.load(data)
        
        # Verificar si el correo ya está registrado
        if User.query.filter_by(email=user_data['email']).first():
            raise ApiValidationError("El correo electrónico ya está registrado")
        
        # Crear usuario
        user = User(
            email=user_data['email'],
            password=user_data['password'],
            name=user_data['name'],
            role=user_data.get('role', 'user')
        )
        
        # Guardar en la base de datos
        db.session.add(user)
        db.session.commit()
        
        # Generar tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        # Retornar respuesta
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except ValidationError as e:
        raise ApiValidationError(str(e.messages))
    except Exception as e:
        db.session.rollback()
        raise ApiValidationError(str(e))

@auth_bp.route('/login', methods=['POST'])
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
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        # Retornar respuesta
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except ValidationError as e:
        raise ApiValidationError(str(e.messages))
    except Exception as e:
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
    
    access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'access_token': access_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_info():
    """Obtener información del usuario autenticado"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthenticationError("Usuario no encontrado")
    
    return jsonify(user_schema.dump(user)), 200 