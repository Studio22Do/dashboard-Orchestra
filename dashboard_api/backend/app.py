import os
from api import create_app, db
from config import get_config
from api.utils.database import init_db

# Crear instancia de la aplicación
app = create_app(get_config())

@app.route('/api/health')
def health_check():
    """Endpoint para verificar el estado de la API"""
    return {'status': 'healthy', 'version': '1.0.0'}

@app.cli.command("init-db")
def init_db_command():
    """Comando de Flask CLI para inicializar la base de datos"""
    with app.app_context():
        result = init_db()
        print(f"Base de datos inicializada: {result}")

# Inicializar base de datos si estamos en entorno de desarrollo
if os.environ.get('FLASK_ENV') == 'development' or not os.environ.get('FLASK_ENV'):
    with app.app_context():
        try:
            init_db()
            app.logger.info("Base de datos inicializada automáticamente")
        except Exception as e:
            app.logger.error(f"Error inicializando la base de datos: {str(e)}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
