"""Registro de blueprints para la aplicación"""
import logging
from flask import Blueprint
from api.routes.instagram import instagram_bp

import sys
import os
from api.routes.auth_google import auth_google_bp

# Añadir el directorio raíz al path de Python para importar correctamente
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.routes.auth import auth_bp
from api.routes.google_paid_search import google_paid_search_bp
from api.routes.apps import apps_bp
from api.routes.text_extract import text_extract_bp
from api.routes.pdf_converter import pdf_converter_bp
from api.routes.snap_video import snap_video_bp
from api.routes.ai_humanizer import ai_humanizer_bp
from api.routes.advanced_image_manipulation import advanced_image_bp

from api.routes.runwayml import runwayml_bp
from api.routes.similarweb import similarweb_bp
from api.routes.google_keyword_insight import keyword_insight_bp

from api.routes.ahrefs_dr import ahrefs_dr_bp
from api.routes.pagespeed_insights import pagespeed_bp
from api.routes.ssl_checker import ssl_checker_bp

from api.routes.seo_mastermind import seo_mastermind_bp
from api.routes.image_optimizer import image_optimizer_bp
from api.routes.prlabs import prlabs_bp

logger = logging.getLogger(__name__)

# Mapeo de blueprints a sus prefijos de URL
BLUEPRINT_MAPPING = {
    instagram_bp: '/api/instagram',

    auth_bp: '/api/auth',
    google_paid_search_bp: '/api/paid-search',
    apps_bp: '/api/apps',
    text_extract_bp: '/api/text-extract',
    pdf_converter_bp: '/api/pdf-converter',
    snap_video_bp: '/api/snap-video',
    ai_humanizer_bp: '/api/ai-humanizer',
    advanced_image_bp: '/api',

    runwayml_bp: '/api/runwayml',
    similarweb_bp: '/api/similarweb',
    keyword_insight_bp: '/api/keyword-insight',

    ahrefs_dr_bp: '/api/beta_v2/ahrefs-dr',
    pagespeed_bp: '/api/pagespeed-insights',
    ssl_checker_bp: '/api/ssl-checker',

    seo_mastermind_bp: '/api/seo-mastermind',
    auth_google_bp: '/api/auth/google',
    prlabs_bp: '/api/prlabs'
}

def register_blueprints(app):
    """Registra todos los blueprints en la aplicación."""
    logger.info("Registrando blueprints...")
    
    for blueprint, url_prefix in BLUEPRINT_MAPPING.items():
        app.register_blueprint(blueprint, url_prefix=url_prefix)
    
    logger.info(f"Registrados {len(BLUEPRINT_MAPPING)} blueprints")
    return app 