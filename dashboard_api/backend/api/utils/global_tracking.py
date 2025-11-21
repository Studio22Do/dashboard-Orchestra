"""
Middleware global para tracking automático de todas las APIs
Se aplica automáticamente a todos los endpoints sin necesidad de decoradores
"""

from flask import request, g, current_app, Response
import time
from datetime import datetime

class GlobalAPITracker:
    """Middleware global para tracking automático de APIs"""
    
    def __init__(self, app):
        self.app = app
        self.app.before_request(self.before_request)
        self.app.after_request(self.after_request)
    
    def before_request(self):
        """Ejecutar antes de cada request"""
        # Marcar tiempo de inicio
        g.start_time = time.time()
        
        # Capturar user_id si está autenticado
        try:
            from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
            verify_jwt_in_request()
            g.user_id = get_jwt_identity()
        except Exception:
            g.user_id = None
    
    def after_request(self, response):
        """Ejecutar después de cada request"""
        try:
            # Solo trackear endpoints de API (no archivos estáticos, etc.)
            if self._should_track_request():
                self._track_api_usage(response)
        except Exception as e:
            # Log del error pero no fallar la respuesta
            current_app.logger.error(f"Error en tracking global: {str(e)}")
        
        return response
    
    def _should_track_request(self):
        """Determinar si se debe trackear este request"""
        # Solo trackear endpoints de API
        path = request.path
        
        # Excluir archivos estáticos, favicon, etc.
        excluded_paths = [
            '/static/', '/assets/', '/favicon.ico', '/robots.txt',
            '/manifest.json', '/logo', '/images/', '/fonts/'
        ]
        
        for excluded in excluded_paths:
            if excluded in path:
                return False
        
        # Solo trackear rutas de API
        if not path.startswith('/api/'):
            return False
        
        # Excluir endpoints del sistema (NO son aplicaciones para trackear)
        system_endpoints = [
            '/api/beta_v2/auth/',           # Sistema de autenticación
            '/api/beta_v2/apps/',           # Gestión de aplicaciones
            '/api/beta_v2/stats/',          # Estadísticas del sistema
            '/api/beta_v2/notifications/',  # Notificaciones del sistema
            '/api/beta_v2/credits/',        # Sistema de créditos interno
            '/api/beta_v2/version-info'     # Información de versión
        ]
        
        for excluded in system_endpoints:
            if path.startswith(excluded):
                return False
        
        return True
    
    def _track_api_usage(self, response):
        """Trackear el uso de la API"""
        try:
            # Importar aquí para evitar importación circular
            from api import db
            from api.models.app import ApiUsage
            
            # Calcular tiempo de respuesta
            start_time = getattr(g, 'start_time', time.time())
            response_time = (time.time() - start_time) * 1000  # Convertir a ms
            
            # Obtener información del request
            endpoint = f"{request.method} {request.path}"
            status_code = response.status_code
            user_id = getattr(g, 'user_id', None)
            
            # Inferir app_id del path
            app_id = self._infer_app_id_from_path(request.path)
            
            if app_id:
                # Crear registro de uso
                api_usage = ApiUsage(
                    app_id=app_id,
                    endpoint=endpoint,
                    status_code=status_code,
                    response_time=response_time,
                    user_id=user_id
                )
                
                db.session.add(api_usage)
                db.session.commit()
                
                current_app.logger.debug(
                    f"Global API Usage tracked: {app_id} - {endpoint} - {response_time:.2f}ms - {status_code}"
                )
        
        except Exception as e:
            current_app.logger.error(f"Error en tracking global de API: {str(e)}")
            # Intentar rollback si hay error
            try:
                db.session.rollback()
            except:
                pass
    
    def _infer_app_id_from_path(self, path):
        """
        Infiere el app_id basándose en la ruta del request
        """
        # Mapeo de rutas a app_ids (basado en el análisis del backend)
        path_mapping = {
            '/instagram': 'instagram-stats',
            '/ai-humanizer': 'ai-humanizer',
            '/seo-mastermind': 'seo-mastermind',
            '/seo-analyzer': 'seo-analyzer',
            '/prlabs': 'prlabs',
            '/google-news': 'google-news',
            '/whois-lookup': 'whois-lookup',
            '/pdf-converter': 'pdf-converter',
            '/pagespeed-insights': 'pagespeed-insights',
            '/ssl-checker': 'ssl-checker',
            '/text-extract': 'text-extract',
            '/media-downloader': 'snap-video',
            '/social-media-content': 'social-media-content',
            '/image-manipulation': 'advanced-image-manipulation',
            '/runwayml': 'runwayml',
            '/similarweb': 'similarweb',
            '/keyword-insight': 'google-keyword-insight',

            '/product-description': 'product-description',
            '/website-status': 'website-status',
            '/website-analyzer': 'website-analyzer',
            '/ahrefs-dr': 'ahrefs-dr',
            '/speech-to-text': 'speech-to-text',
            '/picpulse': 'picpulse',
            '/qrcode-generator': 'qrcode-generator',
            '/mediafy': 'mediafy',
            '/perplexity': 'perplexity',
            '/google-paid-search': 'google-paid-search'
        }
        
        # Buscar coincidencias en el path
        for route, app_id in path_mapping.items():
            if route in path:
                return app_id
        
        # Si no hay coincidencia exacta, intentar inferir del blueprint
        blueprint = request.blueprint
        if blueprint:
            # Mapeo de blueprints a app_ids
            blueprint_mapping = {
                'instagram': 'instagram-stats',
                'ai_humanizer': 'ai-humanizer',
                'seo_mastermind': 'seo-mastermind',
                'seo_analyzer': 'seo-analyzer',
                'prlabs': 'prlabs',
                'google_news': 'google-news',
                'whois_lookup': 'whois-lookup',
                'pdf_converter': 'pdf-converter',
                'pagespeed_insights': 'pagespeed-insights',
                'ssl_checker': 'ssl-checker',
                'text_extract': 'text-extract',
                'snap_video': 'snap-video',
                'social_media_content': 'social-media-content',
                'advanced_image_manipulation': 'image-manipulation',
                'runwayml': 'runwayml',
                'similarweb': 'similarweb',
                'google_keyword_insight': 'keyword-insight',

                'product_description': 'product-description',

                'website_analyzer': 'website-analyzer',
                'ahrefs_dr': 'ahrefs-dr',
                'speech_to_text': 'speech-to-text',
                'picpulse': 'picpulse',
                'qrcode_generator': 'qrcode-generator',
                'mediafy': 'mediafy',
                'perplexity': 'perplexity',
                'google_paid_search': 'google-paid-search'
            }
            
            return blueprint_mapping.get(blueprint)
        
        return None

def init_global_tracking(app):
    """Inicializar el tracking global en la aplicación Flask"""
    return GlobalAPITracker(app)
