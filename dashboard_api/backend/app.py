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
        # Usar FLASK_DEBUG para determinar el entorno (compatible con Flask 2.3+)
        if os.environ.get('FLASK_DEBUG') == '1':
            config_name = 'development'
        elif os.environ.get('FLASK_ENV'):
            # Mantener compatibilidad con FLASK_ENV para versiones anteriores
            config_name = os.environ.get('FLASK_ENV')
        else:
            config_name = 'default'
    
    print(f"Inicializando aplicación Flask con configuración: {config_name}")
    
    # Inicializar aplicación
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Habilitar CORS para todas las rutas con soporte para credenciales
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    print("CORS configurado para todas las rutas /api/*")
    
    # Inicializar JWT para autenticación
    jwt = JWTManager(app)
    print("JWT inicializado")
    
    # Configurar logging
    configure_logging(app)
    print("Logging configurado")
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    print("Manejadores de errores registrados")
    
    # Registrar blueprints
    register_blueprints(app)
    print("Blueprints registrados desde blueprints/__init__.py")
    
    # Inicializar base de datos
    db.init_app(app)
    print("Base de datos inicializada")
    
    # Ruta de estado para verificación de salud
    @app.route('/health')
    def health_check():
        print("Accediendo a ruta /health")
        return {
            'status': 'online',
            'version': app.config['VERSION']
        }    
    # Listar todas las rutas registradas
    print("Rutas registradas en la aplicación:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule.endpoint} -> {rule.rule} [{', '.join(rule.methods)}]")
    
    logger.info(f"Aplicación inicializada en modo: {config_name}")
    print(f"Aplicación Flask inicializada completamente en modo: {config_name}")
    
    return app

# Crear la aplicación para poder usarla con los comandos CLI y al ejecutar directamente
app = create_app()

@app.cli.command("init-db")
def init_db_command():
    """Comando de Flask CLI para inicializar la base de datos"""
    with app.app_context():
        result = init_db()
        print(f"Base de datos inicializada: {result}")

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
    print(f"Iniciando servidor en: http://0.0.0.0:{os.environ.get('PORT', 5000)}")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=app.config['DEBUG'])
