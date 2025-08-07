from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api import db
from api.models.user import User
from api.utils.error_handlers import AuthenticationError, ValidationError as ApiValidationError

# Crear blueprint
credits_bp = Blueprint('credits', __name__)

@credits_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_credits_balance():
    """Obtener el balance de créditos del usuario"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        return jsonify({
            'credits': user.credits,
            'user_id': user.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@credits_bp.route('/deduct', methods=['POST'])
@jwt_required()
def deduct_credits():
    """Descontar créditos del usuario"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        data = request.get_json()
        amount = data.get('amount', 1)
        
        if amount <= 0:
            raise ApiValidationError("La cantidad debe ser mayor a 0")
        
        if not user.has_credits(amount):
            return jsonify({
                'error': 'Créditos insuficientes',
                'available_credits': user.credits,
                'required_credits': amount
            }), 400
        
        # Descontar créditos
        success = user.deduct_credits(amount)
        
        if success:
            db.session.commit()
            return jsonify({
                'message': f'Se descontaron {amount} créditos',
                'remaining_credits': user.credits,
                'deducted_amount': amount
            }), 200
        else:
            return jsonify({
                'error': 'No se pudieron descontar los créditos',
                'available_credits': user.credits
            }), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@credits_bp.route('/add', methods=['POST'])
@jwt_required()
def add_credits():
    """Agregar créditos al usuario (para admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        # Solo admin puede agregar créditos
        if user.role not in ['admin', 'superadmin']:
            raise AuthenticationError("No tienes permisos para realizar esta acción")
        
        data = request.get_json()
        amount = data.get('amount', 0)
        target_user_id = data.get('user_id')
        
        if amount <= 0:
            raise ApiValidationError("La cantidad debe ser mayor a 0")
        
        if target_user_id:
            # Agregar créditos a otro usuario
            target_user = User.query.get(target_user_id)
            if not target_user:
                raise ApiValidationError("Usuario objetivo no encontrado")
            
            new_balance = target_user.add_credits(amount)
            db.session.commit()
            
            return jsonify({
                'message': f'Se agregaron {amount} créditos al usuario {target_user.email}',
                'new_balance': new_balance,
                'user_id': target_user_id
            }), 200
        else:
            # Agregar créditos al usuario actual
            new_balance = user.add_credits(amount)
            db.session.commit()
            
            return jsonify({
                'message': f'Se agregaron {amount} créditos',
                'new_balance': new_balance
            }), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
