import os
from api import create_app, db
from config import get_config
from api.utils.database import init_db
from api.models.app import App

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
