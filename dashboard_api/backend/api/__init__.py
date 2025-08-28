from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import get_config
from api.routes.seo_analyzer import seo_analyzer_bp
from api.routes.picpulse import picpulse_bp

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
    migrate.init_app(app)
    jwt.init_app(app)
    
    # Configurar JWT específicamente para evitar problemas de OpenSSL
    app.config.setdefault('JWT_ALGORITHM', 'HS256')
    app.config.setdefault('JWT_TOKEN_LOCATION', ['headers'])
    app.config.setdefault('JWT_HEADER_NAME', 'Authorization')
    app.config.setdefault('JWT_HEADER_TYPE', 'Bearer')
    
    # Inicializar rate limiter
    with app.app_context():
        from utils.rate_limiter import init_redis
        init_redis()
    
    # Registrar blueprints
    from api.routes.auth import auth_bp
    from api.routes.apps import apps_bp
    from api.routes.stats import stats_bp
    from api.routes.notifications import notifications_bp
    from api.routes.instagram import instagram_bp
    from api.routes.google_paid_search import google_paid_search_bp

    from api.routes.ai_humanizer import ai_humanizer_bp
    from api.routes.seo_mastermind import seo_mastermind_bp
    from api.routes.seo_analyzer import seo_analyzer_bp
    from api.routes.prlabs import prlabs_bp
    from api.routes.google_news import google_news_bp
    from api.routes.whois_lookup import whois_lookup_bp
    from api.routes.pdf_converter import pdf_converter_bp
    from api.routes.pagespeed_insights import pagespeed_bp
    from api.routes.ssl_checker import ssl_checker_bp
    from api.routes.text_extract import text_extract_bp
    from api.routes.snap_video import media_downloader_bp
    from api.routes.social_media_content import social_media_content_bp
    from api.routes.advanced_image_manipulation import advanced_image_bp
    from api.routes.runwayml import runwayml_bp
    from api.routes.similarweb import similarweb_bp
    from api.routes.google_keyword_insight import keyword_insight_bp
    from api.routes.domain_metrics import domain_metrics_bp
    from api.routes.product_description import product_description_bp
    from api.routes.website_status import website_status_bp
    from api.routes.website_analyzer import website_analyzer_pro_bp
    from api.routes.ahrefs_dr import ahrefs_dr_bp
    from api.routes.speech_to_text import speech_to_text_bp
    from api.routes.picpulse import picpulse_bp
    from api.routes.credits import credits_bp
    from api.routes.qrcode_generator import qrcode_generator_bp
    from api.routes.mediafy import mediafy_bp
    from api.routes.perplexity import perplexity_bp

    # Registrar blueprints con prefijos de versión
    version_prefix = f"/api/{app.config.get('MODE', 'beta_v1')}"
    
    app.register_blueprint(auth_bp, url_prefix=f'{version_prefix}/auth')
    app.register_blueprint(apps_bp, url_prefix=f'{version_prefix}/apps')
    app.register_blueprint(stats_bp, url_prefix=f'{version_prefix}/stats')
    app.register_blueprint(notifications_bp, url_prefix=f'{version_prefix}')
    app.register_blueprint(instagram_bp, url_prefix=f'{version_prefix}/instagram')
    app.register_blueprint(google_paid_search_bp, url_prefix=f'{version_prefix}/paid-search')

    app.register_blueprint(ai_humanizer_bp, url_prefix=f'{version_prefix}/ai-humanizer')
    app.register_blueprint(seo_mastermind_bp, url_prefix=f'{version_prefix}/seo-mastermind')
    app.register_blueprint(seo_analyzer_bp, url_prefix=f'{version_prefix}/seo-analyzer')
    app.register_blueprint(prlabs_bp, url_prefix=f'{version_prefix}/prlabs')
    app.register_blueprint(google_news_bp, url_prefix=f'{version_prefix}/google-news')
    app.register_blueprint(whois_lookup_bp, url_prefix=f'{version_prefix}/whois-lookup')
    app.register_blueprint(pdf_converter_bp, url_prefix=f'{version_prefix}/pdf-converter')
    app.register_blueprint(pagespeed_bp, url_prefix=f'{version_prefix}/pagespeed-insights')
    app.register_blueprint(ssl_checker_bp, url_prefix=f'{version_prefix}/ssl-checker')
    app.register_blueprint(text_extract_bp, url_prefix=f'{version_prefix}/text-extract')
    app.register_blueprint(media_downloader_bp, url_prefix=f'{version_prefix}/media-downloader')
    app.register_blueprint(social_media_content_bp, url_prefix=f'{version_prefix}/social-media-content')
    app.register_blueprint(advanced_image_bp, url_prefix=f'{version_prefix}/image-manipulation')
    app.register_blueprint(runwayml_bp, url_prefix=f'{version_prefix}/runwayml')
    app.register_blueprint(similarweb_bp, url_prefix=f'{version_prefix}/similarweb')
    app.register_blueprint(keyword_insight_bp, url_prefix=f'{version_prefix}/keyword-insight')
    app.register_blueprint(domain_metrics_bp, url_prefix=f'{version_prefix}/domain-metrics')
    app.register_blueprint(product_description_bp, url_prefix=f'{version_prefix}/product-description')
    app.register_blueprint(website_status_bp, url_prefix=f'{version_prefix}/website-status')
    app.register_blueprint(website_analyzer_pro_bp, url_prefix=f'{version_prefix}/website-analyzer')
    app.register_blueprint(ahrefs_dr_bp, url_prefix=f'{version_prefix}/ahrefs-dr')
    app.register_blueprint(speech_to_text_bp, url_prefix=f'{version_prefix}/speech-to-text')
    app.register_blueprint(picpulse_bp, url_prefix=f'{version_prefix}/picpulse')
    app.register_blueprint(credits_bp, url_prefix=f'{version_prefix}/credits')
    app.register_blueprint(qrcode_generator_bp, url_prefix=f'{version_prefix}/qrcode-generator')
    app.register_blueprint(mediafy_bp, url_prefix=f'{version_prefix}/mediafy')
    app.register_blueprint(perplexity_bp, url_prefix=f'{version_prefix}/perplexity')
    
    # Inicializar tracking global automático para todas las APIs
    from api.utils.global_tracking import init_global_tracking
    init_global_tracking(app)
    
    # Configurar manejadores de errores
    from api.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Agregar endpoint para información de versión
    @app.route(f'{version_prefix}/version-info')
    def version_info():
        """Endpoint para obtener información de la versión actual"""
        return {
            'version': app.config.get('MODE', 'beta_v1'),
            'features': {
                'authentication_required': True,
                'favorites_enabled': True,
                'purchases_enabled': False
            }
        }
    
    return app 