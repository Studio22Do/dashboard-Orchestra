from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
import os
import requests
from flask import current_app
import logging

from api import db
from api.models.app import App, ApiUsage, UserApp
from api.models.user import User
from api.utils.schemas import AppSchema, ApiUsageSchema
from api.utils.error_handlers import ResourceNotFoundError, ValidationError as ApiValidationError

# Crear blueprint
apps_bp = Blueprint('apps', __name__)

# Esquemas
app_schema = AppSchema()
apps_schema = AppSchema(many=True)
usage_schema = ApiUsageSchema()
usages_schema = ApiUsageSchema(many=True)

@apps_bp.route('/', methods=['GET'])
@jwt_required()
def get_apps():
    """Obtener todas las aplicaciones disponibles"""
    # Filtrar por categoría si se proporciona en query params
    category = request.args.get('category')
    
    if category and category.lower() != 'all':
        apps = App.query.filter_by(
            is_active=True, 
            category=category
        ).order_by(App.title).all()
    else:
        apps = App.query.filter_by(
            is_active=True
        ).order_by(App.title).all()
    
    # Obtener categorías únicas
    categories_query = db.session.query(App.category).distinct().all()
    categories = ['All'] + [cat[0] for cat in categories_query]
    
    return jsonify({
        'apps': apps_schema.dump(apps),
        'categories': categories
    }), 200

@apps_bp.route('/<string:app_id>', methods=['GET'])
@jwt_required()
def get_app(app_id):
    """Obtener detalles de una aplicación específica, incluyendo si el usuario la tiene comprada y si es favorita"""
    app = App.query.get(app_id)
    if not app or not app.is_active:
        raise ResourceNotFoundError(f"Aplicación {app_id} no encontrada")
    user_id = get_jwt_identity()
    user_app = UserApp.query.filter_by(user_id=user_id, app_id=app_id).first()
    app_data = app.to_dict()
    app_data['is_purchased'] = bool(user_app)
    app_data['is_favorite'] = user_app.is_favorite if user_app else False
    app_data['purchased_at'] = user_app.purchased_at.isoformat() if user_app and user_app.purchased_at else None
    return jsonify(app_data), 200

@apps_bp.route('/', methods=['POST'])
@jwt_required()
def create_app():
    """Crear una nueva aplicación (solo admin)"""
    try:
        # Validar datos de entrada
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Deserializar y validar con marshmallow
        app_data = app_schema.load(data)
        
        # Verificar si ya existe una app con ese ID
        if App.query.get(app_data['id']):
            raise ApiValidationError(f"Ya existe una aplicación con el ID {app_data['id']}")
        
        # Crear aplicación
        app = App(
            id=app_data['id'],
            title=app_data['title'],
            description=app_data['description'],
            category=app_data['category'],
            route=app_data['route'],
            api_name=app_data['api_name'],
            image_url=app_data.get('image_url')
        )
        
        # Guardar en la base de datos
        db.session.add(app)
        db.session.commit()
        
        return jsonify({
            'message': 'Aplicación creada exitosamente',
            'app': app_schema.dump(app)
        }), 201
        
    except ValidationError as e:
        raise ApiValidationError(str(e.messages))
    except Exception as e:
        db.session.rollback()
        if isinstance(e, ApiValidationError):
            raise e
        raise ApiValidationError(str(e))

@apps_bp.route('/<string:app_id>', methods=['PUT'])
@jwt_required()
def update_app(app_id):
    """Actualizar una aplicación existente (solo admin)"""
    try:
        # Buscar la aplicación
        app = App.query.get(app_id)
        if not app:
            raise ResourceNotFoundError(f"Aplicación {app_id} no encontrada")
        
        # Validar datos de entrada
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Actualizar campos de la aplicación
        if 'title' in data:
            app.title = data['title']
        if 'description' in data:
            app.description = data['description']
        if 'category' in data:
            app.category = data['category']
        if 'route' in data:
            app.route = data['route']
        if 'api_name' in data:
            app.api_name = data['api_name']
        if 'image_url' in data:
            app.image_url = data['image_url']
        if 'is_active' in data:
            app.is_active = data['is_active']
        
        # Guardar en la base de datos
        db.session.commit()
        
        return jsonify({
            'message': 'Aplicación actualizada exitosamente',
            'app': app_schema.dump(app)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        if isinstance(e, ResourceNotFoundError) or isinstance(e, ApiValidationError):
            raise e
        raise ApiValidationError(str(e))

@apps_bp.route('/<string:app_id>/usage', methods=['POST'])
@jwt_required()
def record_usage(app_id):
    """Registrar uso de una API"""
    try:
        # Verificar si la aplicación existe
        app = App.query.get(app_id)
        if not app:
            raise ResourceNotFoundError(f"Aplicación {app_id} no encontrada")
        
        # Validar datos de entrada
        data = request.get_json()
        if not data:
            raise ApiValidationError("No se proporcionaron datos")
        
        # Obtener el usuario actual
        current_user_id = get_jwt_identity()
        
        # Crear registro de uso
        usage = ApiUsage(
            app_id=app_id,
            user_id=current_user_id,
            endpoint=data.get('endpoint', 'default'),
            status_code=data.get('status_code', 200),
            response_time=data.get('response_time', 0)
        )
        
        # Guardar en la base de datos
        db.session.add(usage)
        db.session.commit()
        
        return jsonify({
            'message': 'Uso registrado exitosamente',
            'usage': usage_schema.dump(usage)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        if isinstance(e, ResourceNotFoundError) or isinstance(e, ApiValidationError):
            raise e
        raise ApiValidationError(str(e))

@apps_bp.route('/user/apps', methods=['GET'])
@jwt_required()
def get_user_apps():
    """Obtener las apps compradas por el usuario autenticado"""
    user_id = get_jwt_identity()
    user_apps = UserApp.query.filter_by(user_id=user_id).all()
    apps = [ua.app.to_dict() | {'is_favorite': ua.is_favorite, 'purchased_at': ua.purchased_at.isoformat() if ua.purchased_at else None} for ua in user_apps]
    return jsonify({'apps': apps}), 200

@apps_bp.route('/user/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    """Obtener las apps favoritas del usuario autenticado"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
        
    # En beta_v1 mostramos todos los favoritos
    # En beta_v2 solo mostramos favoritos de apps compradas
    if user.version == 'beta_v2':
        user_apps = UserApp.query.filter_by(
            user_id=current_user_id, 
            is_favorite=True
        ).all()
    else:
        # En beta_v1 mostramos todos los favoritos
        user_apps = UserApp.query.filter_by(
            user_id=current_user_id, 
            is_favorite=True
        ).all()
    
    # Incluir información detallada de cada app
    apps = []
    for ua in user_apps:
        app_data = ua.app.to_dict()
        app_data.update({
            'is_favorite': True,
            'purchased_at': ua.purchased_at.isoformat() if ua.purchased_at else None,
            'category': ua.app.category
        })
        apps.append(app_data)
    
    # Agrupar por categoría
    categories = {}
    for app in apps:
        cat = app['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(app)
    
    return jsonify({
        'favorites': apps,
        'by_category': categories,
        'total': len(apps)
    }), 200

@apps_bp.route('/user/apps/<string:app_id>/purchase', methods=['POST'])
@jwt_required()
def purchase_app(app_id):
    """Comprar una app (asociar app al usuario)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    # Definir límites por plan
    PLAN_LIMITS = {
        'basic': 15,
        'pro': 25,
        'premium': 30
    }
    plan = getattr(user, 'plan', 'basic')
    max_apps = PLAN_LIMITS.get(plan, 15)
    # Contar apps compradas
    current_count = UserApp.query.filter_by(user_id=user_id).count()
    if current_count >= max_apps:
        return jsonify({'error': f'Límite de apps alcanzado para tu plan ({plan}). Máximo permitido: {max_apps}'}), 403
    # Verificar si ya la compró
    existing = UserApp.query.filter_by(user_id=user_id, app_id=app_id).first()
    if existing:
        return jsonify({'message': 'Ya tienes esta app', 'app': existing.to_dict()}), 200
    # Verificar que la app exista
    app = App.query.get(app_id)
    if not app:
        raise ResourceNotFoundError(f"Aplicación {app_id} no encontrada")
    user_app = UserApp(user_id=user_id, app_id=app_id)
    db.session.add(user_app)
    db.session.commit()
    return jsonify({'message': 'App comprada exitosamente', 'app': user_app.to_dict()}), 201

@apps_bp.route('/user/apps/<string:app_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite_app(app_id):
    """Marcar o desmarcar una app como favorita"""
    # Obtener el usuario actual según la versión
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # Verificar si la app existe
    app = App.query.get(app_id)
    if not app:
        return jsonify({'error': f'App {app_id} no encontrada'}), 404
    
    # Verificar si el usuario tiene la app
    user_app = UserApp.query.filter_by(user_id=current_user_id, app_id=app_id).first()
    if not user_app:
        # Si estamos en beta_v1, permitir marcar como favorito sin comprar
        if user.version == 'beta_v1':
            user_app = UserApp(user_id=current_user_id, app_id=app_id)
            db.session.add(user_app)
        else:
            return jsonify({'error': 'Debes comprar la app antes de marcarla como favorita'}), 403
    
    # Alternar favorito
    user_app.is_favorite = not user_app.is_favorite
    db.session.commit()
    
    return jsonify({
        'message': 'Estado de favorito actualizado',
        'is_favorite': user_app.is_favorite,
        'app': app.to_dict() | {'is_favorite': user_app.is_favorite}
    }), 200

@apps_bp.route('/generate-qr', methods=['POST'])
def generate_qr():
    """Genera un código QR SVG usando la nueva API y retorna el SVG como string plano"""
    req_data = request.get_json()
    if not req_data or 'data' not in req_data:
        return jsonify({'error': 'Falta el campo data'}), 400
    qr_data = req_data['data']
    rapidapi_key = current_app.config.get('RAPIDAPI_KEY')
    url = 'https://smart-qr-code-with-logo.p.rapidapi.com/generate_svg'
    headers = {
        'content-type': 'application/json',
        'x-rapidapi-key': rapidapi_key,
        'x-rapidapi-host': 'smart-qr-code-with-logo.p.rapidapi.com',
    }
    payload = {
        'text': qr_data
    }
    try:
        logging.info(f"Enviando request a API externa con payload: {payload}")
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        logging.info(f"Response status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
        
        if response.status_code != 200:
            try:
                return jsonify(response.json()), response.status_code
            except Exception:
                return jsonify({'error': 'Error al generar el QR', 'details': response.text}), response.status_code
        
        # La API devuelve SVG como texto plano, manejar encoding correctamente
        try:
            logging.info("Intentando decodificar respuesta como UTF-8")
            svg = response.content.decode('utf-8')
            logging.info(f"SVG decodificado exitosamente, longitud: {len(svg)}")
        except UnicodeDecodeError as e:
            logging.warning(f"Error UTF-8: {e}, intentando latin-1")
            svg = response.content.decode('latin-1')
            logging.info(f"SVG decodificado con latin-1, longitud: {len(svg)}")
        
        if not svg.strip():
            return jsonify({'error': 'SVG vacío recibido de la API externa'}), 500
            
        logging.info(f"Primeros 100 caracteres del SVG: {repr(svg[:100])}")
        
        # Validar que sea SVG (más flexible)
        svg_lower = svg.strip().lower()
        if not ('<svg' in svg_lower):
            return jsonify({'error': 'Respuesta no es SVG válido', 'details': svg[:200]}), 500
        
        logging.info("SVG válido recibido, enviando al frontend")
        return jsonify({'svg': svg}), 200
        
    except Exception as e:
        logging.error(f"Error en generate_qr: {str(e)}", exc_info=True)
        return jsonify({'error': 'Error interno al generar el QR', 'details': str(e), 'type': type(e).__name__}), 500 