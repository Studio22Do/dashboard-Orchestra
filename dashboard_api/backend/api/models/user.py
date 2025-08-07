from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from api import db

class User(db.Model):
    """Modelo de usuario para autenticación y gestión de permisos"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='user')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    plan = db.Column(db.String(20), default='basic')  # Plan del usuario: basic, pro, premium
    version = db.Column(db.String(20), default='beta_v1')  # Versión: beta_v1 o beta_v2
    credits = db.Column(db.Integer, default=250)  # Créditos iniciales por defecto
    
    def __init__(self, email, password, name, role='user', version='beta_v1', credits=250):
        self.email = email
        self.password = password  # Utiliza el setter para hashear automáticamente
        self.name = name
        self.role = role
        self.version = version
        self.credits = credits
    
    @property
    def password(self):
        """Prevenir acceso directo a la contraseña"""
        raise AttributeError('La contraseña no es un atributo legible')
    
    @password.setter
    def password(self, password):
        """Establecer contraseña hasheada"""
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        """Verificar contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convertir a diccionario para respuestas JSON"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'plan': self.plan,
            'version': self.version,
            'credits': self.credits,  # Agregar esta línea
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<User {self.email}>'

    def has_credits(self, amount=1):
        """Verificar si el usuario tiene suficientes créditos"""
        return self.credits >= amount

    def deduct_credits(self, amount=1):
        """Descontar créditos del usuario"""
        if self.has_credits(amount):
            self.credits -= amount
            return True
        return False

    def add_credits(self, amount):
        """Agregar créditos al usuario"""
        self.credits += amount
        return self.credits

# Crear usuario de prueba para desarrollo
def create_test_user():
    """Crea un usuario de prueba si no existe"""
    from api import db
    
    test_email = 'test@example.com'
    if not User.query.filter_by(email=test_email).first():
        user = User(
            email=test_email,
            password='test123',
            name='Usuario de Prueba',
            role='admin'
        )
        db.session.add(user)
        db.session.commit()
        return user
    return None 