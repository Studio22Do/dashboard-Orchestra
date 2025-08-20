import os
from datetime import timedelta
from dotenv import load_dotenv

# Cargar variables de entorno desde .env si existe
load_dotenv()

class Config:
    """Configuración base para la aplicación Flask"""
    # Configuración general
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta-predeterminada'
    VERSION = '1.0.0'
    DEBUG = False
    TESTING = False
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # Configuración de versiones beta/v1 y beta/v2
    MODE = os.environ.get('MODE', 'beta_v1')  # beta_v1 o beta_v2
    
    # Configuraciones específicas por versión
    # Para beta_v1 (versión pública)
    BETA_V1_MAX_API_CALLS = int(os.environ.get('BETA_V1_MAX_API_CALLS', 100))
    BETA_V1_RATE_LIMIT_PER_HOUR = int(os.environ.get('BETA_V1_RATE_LIMIT_PER_HOUR', 50))
    BETA_V1_REQUIRE_AUTH = False
    BETA_V1_ENABLE_FAVORITES = False
    BETA_V1_ENABLE_PURCHASES = False
    
    # Para beta_v2 (versión premium)
    BETA_V2_MAX_API_CALLS = int(os.environ.get('BETA_V2_MAX_API_CALLS', 1000))
    BETA_V2_RATE_LIMIT_PER_HOUR = int(os.environ.get('BETA_V2_RATE_LIMIT_PER_HOUR', 200))
    BETA_V2_REQUIRE_AUTH = os.environ.get('BETA_V2_REQUIRE_AUTH', 'true').lower() == 'true'
    BETA_V2_ENABLE_FAVORITES = os.environ.get('BETA_V2_ENABLE_FAVORITES', 'true').lower() == 'true'
    BETA_V2_ENABLE_PURCHASES = os.environ.get('BETA_V2_ENABLE_PURCHASES', 'true').lower() == 'true'
    
    # Configuración de JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_ALGORITHM = 'HS256'  # Usar algoritmo más simple
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # Configuración de SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de RapidAPI
    RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
    RAPIDAPI_HOST = os.environ.get('RAPIDAPI_HOST', 'pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com')
    RAPIDAPI_URL = os.environ.get('RAPIDAPI_URL', 'https://pagepeeker-shortpixel-image-optimiser-v1.p.rapidapi.com/v1/reducer.php')
    RAPIDAPI_PICPULSE_HOST = os.environ.get('RAPIDAPI_PICPULSE_HOST', 'picpulse-automated-image-quality-scoring-with-psychology-ai1.p.rapidapi.com')
    RAPIDAPI_INSTAGRAM_HOST = os.environ.get('RAPIDAPI_INSTAGRAM_HOST', 'instagram-statistics-api.p.rapidapi.com')

    RAPIDAPI_GOOGLE_PAID_SEARCH_HOST = os.environ.get('RAPIDAPI_GOOGLE_PAID_SEARCH_HOST', 'google-paid-search-api.p.rapidapi.com')
    RAPIDAPI_AHREFS_HOST = os.environ.get('RAPIDAPI_AHREFS_HOST', 'domain-metrics-check.p.rapidapi.com')
    RAPIDAPI_WEBSITE_ANALYZER_HOST = os.environ.get('RAPIDAPI_WEBSITE_ANALYZER_HOST', 'website-analyze-and-seo-audit-pro.p.rapidapi.com')
    RAPIDAPI_WEBSITE_ANALYZER_URL = os.environ.get('RAPIDAPI_WEBSITE_ANALYZER_URL')
    
    # Configuración de Google News API
    GOOGLE_NEWS_API_HOST = os.environ.get('GOOGLE_NEWS_API_HOST', 'google-news13.p.rapidapi.com')
    GOOGLE_NEWS_API_BASE_URL = 'https://google-news13.p.rapidapi.com'
    GOOGLE_NEWS_DEFAULT_LANGUAGE = 'en-US'
    GOOGLE_NEWS_CACHE_TIMEOUT = 300  # 5 minutos en segundos
    
    # Instagram API config
    INSTAGRAM_API_BASE_URL = os.environ.get('INSTAGRAM_API_BASE_URL')
    INSTAGRAM_API_KEY = os.environ.get('INSTAGRAM_API_KEY')
    
    @classmethod
    def get_version_config(cls):
        """Obtiene la configuración específica de la versión actual"""
        if cls.MODE == 'beta_v2':
            return {
                'max_api_calls': cls.BETA_V2_MAX_API_CALLS,
                'rate_limit_per_hour': cls.BETA_V2_RATE_LIMIT_PER_HOUR,
                'require_auth': cls.BETA_V2_REQUIRE_AUTH,
                'enable_favorites': cls.BETA_V2_ENABLE_FAVORITES,
                'enable_purchases': cls.BETA_V2_ENABLE_PURCHASES
            }
        else:  # beta_v1 por defecto
            return {
                'max_api_calls': cls.BETA_V1_MAX_API_CALLS,
                'rate_limit_per_hour': cls.BETA_V1_RATE_LIMIT_PER_HOUR,
                'require_auth': cls.BETA_V1_REQUIRE_AUTH,
                'enable_favorites': cls.BETA_V1_ENABLE_FAVORITES,
                'enable_purchases': cls.BETA_V1_ENABLE_PURCHASES
            }

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'DEBUG')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URI', 'sqlite:///dev.db')

class TestingConfig(Config):
    """Configuración para pruebas"""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URI', 'sqlite:///:memory:')

class ProductionConfig(Config):
    """Configuración para producción"""
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'WARNING')
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')
    
    # En producción, se deben establecer valores seguros para las claves secretas
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')

# Mapeo de configuraciones según el entorno
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Configuración activa según la variable de entorno FLASK_DEBUG
def get_config():
    """Determina la configuración a usar basada en FLASK_DEBUG"""
    if os.environ.get('FLASK_DEBUG') == '1':
        return config_by_name['development']
    return config_by_name['default']

# Exportar config para compatibilidad con importaciones existentes
config = config_by_name
