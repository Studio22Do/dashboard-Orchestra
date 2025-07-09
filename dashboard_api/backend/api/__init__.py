from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

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
    
    # Registrar blueprints
    from api.routes.auth import auth_bp
    from api.routes.apps import apps_bp
    from api.routes.stats import stats_bp
    from api.routes.instagram import instagram_bp
    from api.routes.google_trends import google_trends_bp
    from api.routes.google_paid_search import google_paid_search_bp
    from api.routes.instagram_realtime import instagram_realtime_bp
    from api.routes.youtube_media import youtube_media_bp
    from api.routes.file_converter import file_converter_bp
    from api.routes.tiktok_api import tiktok_api_bp
    from api.routes.ai_humanizer import ai_humanizer_bp
    from api.routes.seo_mastermind import seo_mastermind_bp
    from api.routes.prlabs import prlabs_bp
    from api.routes.openai_tts import openai_tts_bp
    from api.routes.google_news import google_news_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(apps_bp, url_prefix='/api/apps')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
    app.register_blueprint(google_trends_bp, url_prefix='/api/trends')
    app.register_blueprint(google_paid_search_bp, url_prefix='/api/paid-search')
    app.register_blueprint(instagram_realtime_bp, url_prefix='/api/instagram-realtime')
    app.register_blueprint(youtube_media_bp, url_prefix='/api/youtube-media')
    app.register_blueprint(file_converter_bp, url_prefix='/api/file-converter')
    app.register_blueprint(tiktok_api_bp, url_prefix='/api/tiktok')
    app.register_blueprint(ai_humanizer_bp, url_prefix='/api/ai-humanizer')
    app.register_blueprint(seo_mastermind_bp, url_prefix='/api/seo-mastermind')
    app.register_blueprint(prlabs_bp, url_prefix='/api/prlabs')
    app.register_blueprint(openai_tts_bp, url_prefix='/api/openai-tts')
    app.register_blueprint(google_news_bp, url_prefix='/api/google-news')
    
    # Configurar manejadores de errores
    from api.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    return app 