import os
import pytest
from backend.app import create_app

@pytest.fixture
def app():
    """Crea una instancia de la aplicación para pruebas."""
    os.environ['FLASK_ENV'] = 'testing'
    app = create_app('testing')
    
    # Proporcionar contexto de aplicación para las pruebas
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    """Cliente de prueba para la API."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Runner de comandos para pruebas CLI."""
    return app.test_cli_runner() 