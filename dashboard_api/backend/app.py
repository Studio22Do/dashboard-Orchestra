"""Módulo principal de la aplicación Flask"""
import os
import logging
from flask import Flask
from flask_cors import CORS
from api import create_app, db
from api.models.app import App
from api.models.user import User
from api.utils.database import init_db
from api.utils.logging_config import setup_logging
from config import get_config

# Configurar logging
setup_logging()
logger = logging.getLogger(__name__)

# Crear y configurar la aplicación
app = create_app(get_config())

# Habilitar CORS
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
