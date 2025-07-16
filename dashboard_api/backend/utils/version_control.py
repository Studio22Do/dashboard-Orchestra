from functools import wraps
from flask import current_app, abort
import os


def require_version(allowed_versions):
    if isinstance(allowed_versions, str):
        allowed_versions = [allowed_versions]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Obtener la versión actual desde config o variable de entorno
            mode = None
            if current_app and hasattr(current_app, 'config'):
                mode = current_app.config.get('MODE')
            if not mode:
                mode = os.getenv('MODE', 'beta_v1')
            if mode not in allowed_versions:
                abort(403, description=f"Este endpoint solo está disponible en: {', '.join(allowed_versions)}")
            return func(*args, **kwargs)
        return wrapper
    return decorator 