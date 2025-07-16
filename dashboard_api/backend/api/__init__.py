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
    
    # Inicializar rate limiter
    with app.app_context():
        from utils.rate_limiter import init_redis
        init_redis()
    
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
    from api.routes.google_review_link import google_review_link_bp
    from api.routes.whois_lookup import whois_lookup_bp
    from api.routes.pdf_converter import pdf_converter_bp
    from api.routes.pagespeed_insights import pagespeed_bp
    
    # Registrar blueprints con prefijos de versión
    version_prefix = f"/api/{app.config.get('MODE', 'beta_v1')}"
    
    app.register_blueprint(auth_bp, url_prefix=f'{version_prefix}/auth')
    app.register_blueprint(apps_bp, url_prefix=f'{version_prefix}/apps')
    app.register_blueprint(stats_bp, url_prefix=f'{version_prefix}/stats')
    app.register_blueprint(instagram_bp, url_prefix=f'{version_prefix}/instagram')
    app.register_blueprint(google_trends_bp, url_prefix=f'{version_prefix}/trends')
    app.register_blueprint(google_paid_search_bp, url_prefix=f'{version_prefix}/paid-search')
    app.register_blueprint(instagram_realtime_bp, url_prefix=f'{version_prefix}/instagram-realtime')
    app.register_blueprint(youtube_media_bp, url_prefix=f'{version_prefix}/youtube-media')
    app.register_blueprint(file_converter_bp, url_prefix=f'{version_prefix}/file-converter')
    app.register_blueprint(tiktok_api_bp, url_prefix=f'{version_prefix}/tiktok')
    app.register_blueprint(ai_humanizer_bp, url_prefix=f'{version_prefix}/ai-humanizer')
    app.register_blueprint(seo_mastermind_bp, url_prefix=f'{version_prefix}/seo-mastermind')
    app.register_blueprint(prlabs_bp, url_prefix=f'{version_prefix}/prlabs')
    app.register_blueprint(openai_tts_bp, url_prefix=f'{version_prefix}/openai-tts')
    app.register_blueprint(google_news_bp, url_prefix=f'{version_prefix}/google-news')
    app.register_blueprint(google_review_link_bp, url_prefix=f'{version_prefix}/google-review-link')
    app.register_blueprint(whois_lookup_bp, url_prefix=f'{version_prefix}/whois-lookup')
    app.register_blueprint(pdf_converter_bp, url_prefix=f'{version_prefix}/pdf-converter')
    app.register_blueprint(pagespeed_bp, url_prefix=f'{version_prefix}/pagespeed-insights')
    
    # Configurar manejadores de errores
    from api.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Agregar endpoint para información de versión
    @app.route(f'{version_prefix}/version-info')
    def version_info():
        """Endpoint para obtener información de la versión actual"""
        version_config = app.config.get_version_config()
        return {
            'version': app.config.get('MODE', 'beta_v1'),
            'config': version_config,
            'features': {
                'authentication_required': version_config['require_auth'],
                'favorites_enabled': version_config['enable_favorites'],
                'purchases_enabled': version_config['enable_purchases']
            }
        }
    
    return app 