from datetime import datetime
from api.models import db

class Notification(db.Model):
    """Modelo para las notificaciones de usuario"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'info', 'warning', 'error', 'success'
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False)  # 'system', 'usage', 'update'
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    link = db.Column(db.String(255), nullable=True)  # Link opcional para navegación
    
    # Relación con el usuario
    user = db.relationship('User', backref=db.backref('notifications', lazy='dynamic'))
    
    def to_dict(self):
        """Convertir a diccionario para respuestas JSON"""
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'category': self.category,
            'read': self.read,
            'created_at': self.created_at.isoformat(),
            'link': self.link
        } 