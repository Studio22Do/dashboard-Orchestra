"""Modelos de datos para la API""" 

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .seo_history import SEOHistory
from .notification import Notification

__all__ = ['db', 'User', 'SEOHistory', 'Notification'] 