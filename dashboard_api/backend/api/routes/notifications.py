from flask import Blueprint, jsonify, request
from api.models import db, Notification
from flask_jwt_extended import jwt_required, get_jwt_identity

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Obtener todas las notificaciones del usuario"""
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id)\
        .order_by(Notification.created_at.desc())\
        .all()
    
    return jsonify({
        'notifications': [notif.to_dict() for notif in notifications]
    }), 200

@notifications_bp.route('/notifications/unread', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Obtener el número de notificaciones no leídas"""
    user_id = get_jwt_identity()
    count = Notification.query.filter_by(user_id=user_id, read=False).count()
    
    return jsonify({
        'unread_count': count
    }), 200

@notifications_bp.route('/notifications/mark-read', methods=['POST'])
@jwt_required()
def mark_notifications_read():
    """Marcar notificaciones como leídas"""
    user_id = get_jwt_identity()
    notification_ids = request.json.get('notification_ids', [])
    
    if not notification_ids:  # Si no se especifican IDs, marcar todas como leídas
        notifications = Notification.query.filter_by(user_id=user_id, read=False).all()
    else:
        notifications = Notification.query.filter(
            Notification.id.in_(notification_ids),
            Notification.user_id == user_id
        ).all()
    
    for notification in notifications:
        notification.read = True
    db.session.commit()
    
    return jsonify({
        'message': 'Notificaciones marcadas como leídas',
        'count': len(notifications)
    }), 200

@notifications_bp.route('/notifications/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Eliminar una notificación específica"""
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=user_id
    ).first_or_404()
    
    db.session.delete(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Notificación eliminada'
    }), 200

@notifications_bp.route('/notifications/clear', methods=['DELETE'])
@jwt_required()
def clear_notifications():
    """Eliminar todas las notificaciones del usuario"""
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({
        'message': 'Todas las notificaciones han sido eliminadas'
    }), 200 