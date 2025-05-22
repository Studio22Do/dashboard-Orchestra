import logging
from flask import Blueprint
from api.routes.instagram import instagram_bp
from .instagram_realtime import instagram_blueprint as instagram_realtime_bp
import sys
import os
from api.routes.youtube_media import youtube_media_bp

# Añadir el directorio raíz al path de Python para importar correctamente
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.routes.auth import auth_bp
from api.routes.google_trends import google_trends_bp
from api.routes.google_paid_search import google_paid_search_bp
from api.routes.apps import apps_bp
from api.routes.tiktok_api import tiktok_api_bp
from api.routes.file_converter import file_converter_bp
from api.routes.midjourney import midjourney_bp
from api.routes.text_extract import text_extract_bp
from api.routes.pdf_converter import pdf_converter_bp
from api.routes.snap_video import snap_video_bp
from api.routes.ai_humanizer import ai_humanizer_bp
from api.routes.advanced_image_manipulation import advanced_image_bp
from api.routes.whisper_url import whisper_url_bp
from api.routes.runwayml import runwayml_bp
from api.routes.similarweb import similarweb_bp
from api.routes.google_keyword_insight import keyword_insight_bp
from api.routes.domain_metrics import domain_metrics_bp
from api.routes.ahrefs_dr import ahrefs_dr_bp
from api.routes.pagespeed_insights import pagespeed_bp
from api.routes.ssl_checker import ssl_checker_bp
from api.routes.website_status import website_status_bp
from api.routes.seo_mastermind import seo_mastermind_bp
from api.routes.image_optimizer import image_optimizer_bp

logger = logging.getLogger(__name__)

def register_blueprints(app):
    """Registra todos los blueprints en la aplicación."""
    print("\n=== REGISTRANDO BLUEPRINTS (desde blueprints/__init__.py) ===")
    
    print("Registrando blueprint: instagram_bp en /api/instagram")
    app.register_blueprint(instagram_bp, url_prefix='/api/instagram')
    
    print("Registrando blueprint: instagram_realtime_bp en /api/instagram-realtime")
    app.register_blueprint(instagram_realtime_bp, url_prefix='/api/instagram-realtime')
    
    # Registrar blueprint de autenticación
    print("Registrando blueprint: auth_bp en /api/auth")
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Registrar blueprint de Google Trends
    print("Registrando blueprint: google_trends_bp en /api/trends")
    app.register_blueprint(google_trends_bp, url_prefix='/api/trends')
    
    # Registrar blueprint de Google Paid Search
    print("Registrando blueprint: google_paid_search_bp en /api/paid-search")
    app.register_blueprint(google_paid_search_bp, url_prefix='/api/paid-search')
    
    # Registrar blueprint de Apps
    print("Registrando blueprint: apps_bp en /api/apps")
    app.register_blueprint(apps_bp, url_prefix='/api/apps')
    
    # Registrar blueprint de TikTok
    print("Registrando blueprint: tiktok_api_bp en /api/tiktok")
    app.register_blueprint(tiktok_api_bp, url_prefix='/api/tiktok')
    
    # Registrar blueprint de File Converter
    print("Registrando blueprint: file_converter_bp en /api/file-converter")
    app.register_blueprint(file_converter_bp, url_prefix='/api/file-converter')
    
    # Registrar blueprint de Midjourney
    print("Registrando blueprint: midjourney_bp en /api/midjourney")
    app.register_blueprint(midjourney_bp, url_prefix='/api/midjourney')
    
    # Registrar blueprint de Text Extract
    print("Registrando blueprint: text_extract_bp en /api/text-extract")
    app.register_blueprint(text_extract_bp, url_prefix='/api/text-extract')
    
    # Registrar blueprint de PDF Converter
    print("Registrando blueprint: pdf_converter_bp en /api/pdf-converter")
    app.register_blueprint(pdf_converter_bp, url_prefix='/api/pdf-converter')
    
    # Registrar blueprint de Snap Video
    print("Registrando blueprint: snap_video_bp en /api/snap-video")
    app.register_blueprint(snap_video_bp, url_prefix='/api/snap-video')
    
    # Registrar blueprint de AI Humanizer
    print("Registrando blueprint: ai_humanizer_bp en /api/ai-humanizer")
    app.register_blueprint(ai_humanizer_bp, url_prefix='/api/ai-humanizer')
    
    # Registrar blueprint de Advanced Image Manipulation
    print("Registrando blueprint: advanced_image_bp en /api/image-manipulation")
    app.register_blueprint(advanced_image_bp)
    
    # Registrar blueprint de Whisper URL
    print("Registrando blueprint: whisper_url_bp en /api/whisper-url")
    app.register_blueprint(whisper_url_bp)
    
    # Registrar blueprint de RunwayML
    print("Registrando blueprint: runwayml_bp en /api/runwayml")
    app.register_blueprint(runwayml_bp, url_prefix='/api/runwayml')
    
    # Registrar blueprint de Similarweb
    print("Registrando blueprint: similarweb_bp en /api/similarweb")
    app.register_blueprint(similarweb_bp, url_prefix='/api/similarweb')
    
    # Registrar blueprint de Google Keyword Insight
    print("Registrando blueprint: keyword_insight_bp en /api/keyword-insight")
    app.register_blueprint(keyword_insight_bp, url_prefix='/api/keyword-insight')
    
    # Registrar blueprint de Domain Metrics
    print("Registrando blueprint: domain_metrics_bp en /api/domain-metrics")
    app.register_blueprint(domain_metrics_bp, url_prefix='/api/domain-metrics')
    
    # Registrar blueprint de Ahrefs DR
    print("Registrando blueprint: ahrefs_dr_bp en /api/ahrefs-dr")
    app.register_blueprint(ahrefs_dr_bp, url_prefix='/api/ahrefs-dr')
    
    # Registrar blueprint de PageSpeed Insights
    print("Registrando blueprint: pagespeed_bp en /api/pagespeed-insights")
    app.register_blueprint(pagespeed_bp, url_prefix='/api/pagespeed-insights')
    
    # Registrar blueprint de SSL Checker
    print("Registrando blueprint: ssl_checker_bp en /api/ssl-checker")
    app.register_blueprint(ssl_checker_bp, url_prefix='/api/ssl-checker')
    
    # Registrar blueprint de Website Status
    print("Registrando blueprint: website_status_bp en /api/website-status")
    app.register_blueprint(website_status_bp, url_prefix='/api/website-status')
    
    # Registrar blueprint de SEO Mastermind
    print("Registrando blueprint: seo_mastermind_bp en /api/seo-mastermind")
    app.register_blueprint(seo_mastermind_bp, url_prefix='/api/seo-mastermind')
    
    # Registrar blueprint de Image Optimizer
    print("Registrando blueprint: image_optimizer_bp en /api/image-optimize")
    app.register_blueprint(image_optimizer_bp, url_prefix='/api/image-optimize')
    
    # Registrar blueprint de YouTube Media
    print("Registrando blueprint: youtube_media_bp en /api/youtube")
    app.register_blueprint(youtube_media_bp, url_prefix='/api/youtube')
    
    # Agregar más blueprints aquí
    print("=== FIN DE REGISTRO DE BLUEPRINTS (desde blueprints/__init__.py) ===\n")
    
    return app 