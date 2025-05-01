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
    
    # Configuración de JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Configuración de SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de RapidAPI
    RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', '')
    RAPIDAPI_INSTAGRAM_HOST = os.environ.get('RAPIDAPI_INSTAGRAM_HOST', 'instagram-statistics-api.p.rapidapi.com')
    RAPIDAPI_INSTAGRAM_REALTIME_HOST = os.environ.get('RAPIDAPI_INSTAGRAM_REALTIME_HOST', 'instagram-realtimeapi.p.rapidapi.com')
    RAPIDAPI_GOOGLE_TRENDS_HOST = os.environ.get('RAPIDAPI_GOOGLE_TRENDS_HOST', 'google-trends.p.rapidapi.com')
    RAPIDAPI_GOOGLE_PAID_SEARCH_HOST = os.environ.get('RAPIDAPI_GOOGLE_PAID_SEARCH_HOST', 'google-paid-search-api.p.rapidapi.com')

    # Instagram API config
    INSTAGRAM_API_BASE_URL = os.environ.get('INSTAGRAM_API_BASE_URL')
    INSTAGRAM_API_KEY = os.environ.get('INSTAGRAM_API_KEY')

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

# Configuración activa según la variable de entorno FLASK_ENV
def get_config():
    env = os.environ.get('FLASK_ENV', 'default')
    return config_by_name[env]

# Exportar config para compatibilidad con importaciones existentes
config = config_by_name
