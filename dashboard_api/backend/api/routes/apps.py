from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from api import db
from api.models.app import App, ApiUsage
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
    """Obtener detalles de una aplicación específica"""
    app = App.query.get(app_id)
    
    if not app or not app.is_active:
        raise ResourceNotFoundError(f"Aplicación {app_id} no encontrada")
    
    return jsonify(app_schema.dump(app)), 200

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