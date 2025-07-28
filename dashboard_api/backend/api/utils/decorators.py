from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from api.models.user import User

def role_required(*roles):
    """
    Decorador para requerir uno o varios roles en un endpoint.
    Uso: @role_required('admin', 'superadmin')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({'error': 'No autorizado. Se requiere uno de los roles: %s' % ', '.join(roles)}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator 