from flask import current_app
from api import db
from api.models.user import User, create_test_user
from api.models.app import App, create_sample_apps

def init_db():
    """Inicializa la base de datos con datos de ejemplo para desarrollo"""
    # Crear tablas
    db.create_all()
    
    # Crear usuario de prueba
    test_user = create_test_user()
    if test_user:
        current_app.logger.info(f"Usuario de prueba creado: {test_user.email}")
    
    # Crear aplicaciones de ejemplo
    apps_created = create_sample_apps()
    if apps_created:
        current_app.logger.info("Aplicaciones de ejemplo creadas")
    
    return {
        'test_user': test_user is not None,
        'sample_apps': apps_created
    } 