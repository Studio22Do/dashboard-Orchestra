"""Rutas para la API"""
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Configuración de logging
logger.setLevel(logging.INFO)

def import_blueprints():
    """Importa los blueprints de manera silenciosa"""
    try:
        # Importar blueprints directamente desde el módulo blueprints
        from ..blueprints import (
            instagram_bp, instagram_realtime_bp, auth_bp, google_trends_bp,
            google_paid_search_bp, apps_bp, tiktok_api_bp, file_converter_bp,
            midjourney_bp, text_extract_bp, pdf_converter_bp, snap_video_bp,
            ai_humanizer_bp, advanced_image_bp, whisper_url_bp, runwayml_bp,
            similarweb_bp, keyword_insight_bp, domain_metrics_bp, ahrefs_dr_bp,
            pagespeed_bp, ssl_checker_bp, website_status_bp, seo_mastermind_bp,
            image_optimizer_bp, youtube_media_bp, prlabs_bp
        )
        return True
    except ImportError as e:
        logger.error(f"Error importando blueprints: {str(e)}")
        return False

# Importar blueprints
success = import_blueprints()
if success:
    logger.info("Blueprints importados exitosamente")
else:
    logger.error("Error al importar blueprints") 