from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify, current_app

def role_required(*roles):
    """
    Decorador para requerir uno o varios roles en un endpoint.
    Uso: @role_required('admin', 'superadmin')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            # Importar User aquí para evitar circular import
            from api.models.user import User
            user = User.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({'error': 'No autorizado. Se requiere uno de los roles: %s' % ', '.join(roles)}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def credits_required(amount=1):
    """
    Decorador para verificar y descontar créditos antes de ejecutar un endpoint.
    Uso: @credits_required(amount=1)
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Obtener usuario actual
            user_id = get_jwt_identity()
            # Importar User y db aquí para evitar circular import
            from api.models.user import User
            from api import db
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'Usuario no encontrado'}), 404
            
            # Verificar si estamos en modo beta_v2 (donde se requieren créditos)
            mode = current_app.config.get('MODE', 'beta_v1')
            if mode == 'beta_v1':
                # En beta_v1, no se requieren créditos (demo)
                return fn(*args, **kwargs)
            
            # En beta_v2, verificar y descontar créditos
            if not user.has_credits(amount):
                return jsonify({
                    'error': 'Créditos insuficientes',
                    'available_credits': user.credits,
                    'required_credits': amount,
                    'message': f'Necesitas {amount} crédito(s) para usar esta función. Tienes {user.credits} crédito(s) disponibles.'
                }), 402  # 402 Payment Required
            
            # Descontar créditos
            success = user.deduct_credits(amount)
            if not success:
                return jsonify({
                    'error': 'Error al descontar créditos',
                    'available_credits': user.credits
                }), 500
            
            try:
                # Guardar cambios en la base de datos
                db.session.commit()
                
                # Ejecutar la función original
                result = fn(*args, **kwargs)
                
                # Agregar información de créditos a la respuesta
                if isinstance(result, tuple) and len(result) == 2:
                    response_data, status_code = result
                    if isinstance(response_data, dict):
                        response_data['credits_info'] = {
                            'deducted': amount,
                            'remaining': user.credits
                        }
                    return jsonify(response_data), status_code
                else:
                    return result
                    
            except Exception as e:
                # Si hay error, revertir el descuento de créditos
                db.session.rollback()
                user.add_credits(amount)  # Restaurar créditos
                db.session.commit()
                raise e
                
        return wrapper
    return decorator 