"""Aplicación principal de Flask"""
import os
from flask import Flask
from flask_cors import CORS
from config import config
from blueprints import register_blueprints
from utils.error_handlers import register_error_handlers
from utils.logging_config import configure_logging
import logging
from api.utils.database import init_db
from api.models.app import App
from api import db
from flask_jwt_extended import JWTManager

logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """Función factoría de aplicación Flask."""
    # Determinar la configuración a usar
    if config_name is None:
        config_name = 'development' if os.environ.get('FLASK_DEBUG') == '1' else 'default'
    
    # Inicializar aplicación
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configurar extensiones
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    jwt = JWTManager(app)
    configure_logging(app)
    register_error_handlers(app)
    
    # Registrar blueprints
    register_blueprints(app)
    
    # Inicializar base de datos
    db.init_app(app)
    
    # Ruta de estado para verificación de salud
    @app.route('/health')
    def health_check():
        return {
            'status': 'online',
            'version': app.config['VERSION']
        }
    
    logger.info(f"Aplicación inicializada en modo: {config_name}")
    return app

# Crear la aplicación
app = create_app()

@app.cli.command("init-db")
def init_db_command():
    """Comando de Flask CLI para inicializar la base de datos"""
    with app.app_context():
        result = init_db()
        logger.info(f"Base de datos inicializada: {result}")

@app.cli.command("update-apps")
def update_apps_command():
    """Comando de Flask CLI para actualizar aplicaciones en la base de datos"""
    with app.app_context():
        # Añadir o actualizar Google Trends
        google_trends_app = App.query.filter_by(id='google-trends').first()
        
        if not google_trends_app:
            # Crear si no existe
            google_trends_app = App(
                id='google-trends',
                title='Google Trends',
                description='Explora tendencias de búsqueda en Google, términos populares y patrones de interés a lo largo del tiempo',
                image_url='https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088004_960_720.png',
                category='Social Media',
                route='/apps/trends',
                api_name='Google Trends API'
            )
            db.session.add(google_trends_app)
            db.session.commit()
            print("Aplicación Google Trends añadida correctamente")
        else:
            # Actualizar si ya existe
            google_trends_app.title = 'Google Trends'
            google_trends_app.description = 'Explora tendencias de búsqueda en Google, términos populares y patrones de interés a lo largo del tiempo'
            google_trends_app.category = 'Social Media'
            google_trends_app.route = '/apps/trends'
            google_trends_app.api_name = 'Google Trends API'
            db.session.commit()
            print("Aplicación Google Trends actualizada correctamente")

        # Añadir o actualizar SimilarWeb
        similarweb_app = App.query.filter_by(id='similar-web').first()
        
        if not similarweb_app:
            # Crear si no existe
            similarweb_app = App(
                id='similar-web',
                title='Similar Web Insights',
                description='Obtén insights detallados sobre el tráfico web y la competencia',
                image_url='https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
                category='Web & SEO',
                route='/apps/similar-web',
                api_name='Similar Web API'
            )
            db.session.add(similarweb_app)
            db.session.commit()
            print("Aplicación SimilarWeb añadida correctamente")
        else:
            # Actualizar si ya existe
            similarweb_app.title = 'Similar Web Insights'
            similarweb_app.description = 'Obtén insights detallados sobre el tráfico web y la competencia'
            similarweb_app.category = 'Web & SEO'
            similarweb_app.route = '/apps/similar-web'
            similarweb_app.api_name = 'Similar Web API'
            db.session.commit()
            print("Aplicación SimilarWeb actualizada correctamente")

# Inicializar base de datos si estamos en entorno de desarrollo (deshabilitado temporalmente)
"""
if os.environ.get('FLASK_ENV') == 'development' or not os.environ.get('FLASK_ENV'):
    with app.app_context():
        try:
            init_db()
            app.logger.info("Base de datos inicializada automáticamente")
        except Exception as e:
            app.logger.error(f"Error inicializando la base de datos: {str(e)}")
"""

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Iniciando servidor en: http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
