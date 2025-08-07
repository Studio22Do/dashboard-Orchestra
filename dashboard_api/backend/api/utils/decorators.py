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
            print(f"[CREDITS_DEBUG] === INICIO DECORADOR CREDITS ===")
            print(f"[CREDITS_DEBUG] Cantidad requerida: {amount}")
            
            # Verificar si estamos en modo beta_v1 (donde no se requieren créditos)
            mode = current_app.config.get('MODE', 'beta_v1')
            print(f"[CREDITS_DEBUG] Modo actual: {mode}")
            
            if mode == 'beta_v1':
                # En beta_v1, no se requieren créditos (demo)
                print(f"[CREDITS_DEBUG] Modo beta_v1 - no se descuentan créditos")
                return fn(*args, **kwargs)
            
            # En beta_v2, verificar y descontar créditos
            print(f"[CREDITS_DEBUG] Modo beta_v2 - verificando créditos")
            try:
                # Obtener usuario actual
                user_id = get_jwt_identity()
                print(f"[CREDITS_DEBUG] User ID: {user_id}")
                
                # Importar User y db aquí para evitar circular import
                from api.models.user import User
                from api import db
                user = User.query.get(user_id)
                print(f"[CREDITS_DEBUG] Usuario encontrado: {user is not None}")
                
                if not user:
                    print(f"[CREDITS_DEBUG] Usuario no encontrado")
                    return jsonify({'error': 'Usuario no encontrado'}), 404
                
                print(f"[CREDITS_DEBUG] Créditos actuales: {user.credits}")
                print(f"[CREDITS_DEBUG] Tiene suficientes créditos: {user.has_credits(amount)}")
                
                if not user.has_credits(amount):
                    print(f"[CREDITS_DEBUG] Créditos insuficientes")
                    return jsonify({
                        'error': 'Créditos insuficientes',
                        'available_credits': user.credits,
                        'required_credits': amount,
                        'message': f'Necesitas {amount} crédito(s) para usar esta función. Tienes {user.credits} crédito(s) disponibles.'
                    }), 402  # 402 Payment Required
                
                # Descontar créditos
                print(f"[CREDITS_DEBUG] Descontando {amount} créditos")
                success = user.deduct_credits(amount)
                print(f"[CREDITS_DEBUG] Descuento exitoso: {success}")
                
                if not success:
                    print(f"[CREDITS_DEBUG] Error al descontar créditos")
                    return jsonify({
                        'error': 'Error al descontar créditos',
                        'available_credits': user.credits
                    }), 500
                
                try:
                    # Guardar cambios en la base de datos
                    print(f"[CREDITS_DEBUG] Guardando cambios en DB")
                    db.session.commit()
                    print(f"[CREDITS_DEBUG] Créditos restantes: {user.credits}")
                    
                    # Ejecutar la función original
                    print(f"[CREDITS_DEBUG] Ejecutando función original")
                    result = fn(*args, **kwargs)
                    
                    # Agregar información de créditos a la respuesta
                    print(f"[CREDITS_DEBUG] Agregando info de créditos a respuesta")
                    if isinstance(result, tuple) and len(result) == 2:
                        response_data, status_code = result
                        if isinstance(response_data, dict):
                            response_data['credits_info'] = {
                                'deducted': amount,
                                'remaining': user.credits
                            }
                            print(f"[CREDITS_DEBUG] Credits info agregado: {response_data['credits_info']}")
                        return jsonify(response_data), status_code
                    elif hasattr(result, 'json') and callable(getattr(result, 'json', None)):
                        # Es un Response object de Flask
                        print(f"[CREDITS_DEBUG] Es un Response object, extrayendo datos")
                        try:
                            response_data = result.json
                            if isinstance(response_data, dict):
                                response_data['credits_info'] = {
                                    'deducted': amount,
                                    'remaining': user.credits
                                }
                                print(f"[CREDITS_DEBUG] Credits info agregado a Response: {response_data['credits_info']}")
                            return result
                        except Exception as e:
                            print(f"[CREDITS_DEBUG] Error extrayendo datos del Response: {e}")
                            return result
                    else:
                        # Si no es una tupla, convertir a JSON y agregar credits_info
                        print(f"[CREDITS_DEBUG] Resultado no es tupla, convirtiendo a JSON")
                        if isinstance(result, dict):
                            result['credits_info'] = {
                                'deducted': amount,
                                'remaining': user.credits
                            }
                            print(f"[CREDITS_DEBUG] Credits info agregado: {result['credits_info']}")
                        return jsonify(result)
                        
                except Exception as e:
                    # Si hay error, revertir el descuento de créditos
                    print(f"[CREDITS_DEBUG] Error en función - revirtiendo créditos")
                    db.session.rollback()
                    user.add_credits(amount)  # Restaurar créditos
                    db.session.commit()
                    raise e
                    
            except Exception as e:
                # Si no hay JWT o hay error, ejecutar sin descuento de créditos
                print(f"[CREDITS_DEBUG] Error en decorador: {e}")
                return fn(*args, **kwargs)
                
        return wrapper
    return decorator 