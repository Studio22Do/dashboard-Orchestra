from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Inicializar extensiones
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_object):
    """Fábrica de aplicación Flask"""
    app = Flask(__name__)
    app.config.from_object(config_object)
    
    # Inicializar extensiones con la aplicación
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configurar CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Registrar blueprints
    from api.routes.auth import auth_bp
    from api.routes.apps import apps_bp
    from api.routes.stats import stats_bp
    from api.routes.instagram import instagram_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(apps_bp, url_prefix='/api/apps')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
    
    # Configurar manejadores de errores
    from api.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    return app 