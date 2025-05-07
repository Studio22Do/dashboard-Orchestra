from datetime import datetime
from api import db

class App(db.Model):
    """Modelo para las aplicaciones de la plataforma"""
    __tablename__ = 'apps'
    
    id = db.Column(db.String(50), primary_key=True)  # ID único para la app (usado en rutas)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50), nullable=False, index=True)
    route = db.Column(db.String(100), nullable=False)
    api_name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con los registros de uso de la API
    usage_records = db.relationship('ApiUsage', back_populates='app', lazy='dynamic')
    
    def __init__(self, id, title, description, category, route, api_name, image_url=None):
        self.id = id
        self.title = title
        self.description = description
        self.category = category
        self.route = route
        self.api_name = api_name
        self.image_url = image_url
    
    def to_dict(self):
        """Convertir a diccionario para respuestas JSON"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'imageUrl': self.image_url,
            'category': self.category,
            'route': self.route,
            'apiName': self.api_name,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<App {self.id}: {self.title}>'

class ApiUsage(db.Model):
    """Modelo para registrar el uso de las APIs"""
    __tablename__ = 'api_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    app_id = db.Column(db.String(50), db.ForeignKey('apps.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    endpoint = db.Column(db.String(255), nullable=False)
    status_code = db.Column(db.Integer, nullable=False)
    response_time = db.Column(db.Float, nullable=False)  # tiempo en ms
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    app = db.relationship('App', back_populates='usage_records')
    
    def __init__(self, app_id, endpoint, status_code, response_time, user_id=None):
        self.app_id = app_id
        self.endpoint = endpoint
        self.status_code = status_code
        self.response_time = response_time
        self.user_id = user_id
    
    def to_dict(self):
        """Convertir a diccionario para respuestas JSON"""
        return {
            'id': self.id,
            'appId': self.app_id,
            'userId': self.user_id,
            'endpoint': self.endpoint,
            'statusCode': self.status_code,
            'responseTime': self.response_time,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<ApiUsage {self.id}: {self.app_id} - {self.endpoint}>'

class UserApp(db.Model):
    """Modelo para asociar usuarios con apps compradas y favoritas"""
    __tablename__ = 'user_apps'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    app_id = db.Column(db.String(50), db.ForeignKey('apps.id'), nullable=False)
    is_favorite = db.Column(db.Boolean, default=False)
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    user = db.relationship('User', backref=db.backref('user_apps', lazy='dynamic'))
    app = db.relationship('App', backref=db.backref('user_apps', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'app_id': self.app_id,
            'is_favorite': self.is_favorite,
            'purchased_at': self.purchased_at.isoformat() if self.purchased_at else None
        }

    def __repr__(self):
        return f'<UserApp user_id={self.user_id} app_id={self.app_id} favorite={self.is_favorite}>'

# Función para inicializar aplicaciones de ejemplo
def create_sample_apps():
    """Crea aplicaciones de ejemplo si no existen"""
    from api import db
    
    sample_apps = [
        {
            'id': 'instagram-stats',
            'title': 'Instagram Statistics',
            'description': 'Analiza perfiles de Instagram, obtén estadísticas y monitorea crecimiento',
            'image_url': 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
            'category': 'Social Media',
            'route': '/apps/instagram',
            'api_name': 'Instagram Statistics API'
        },
        {
            'id': 'google-trends',
            'title': 'Google Trends',
            'description': 'Explora tendencias de búsqueda en Google, términos populares y patrones de interés a lo largo del tiempo',
            'image_url': 'https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088004_960_720.png',
            'category': 'Social Media',
            'route': '/apps/trends',
            'api_name': 'Google Trends API'
        },
        {
            'id': 'weather-forecast',
            'title': 'Weather Forecast',
            'description': 'Consulta el pronóstico del tiempo en cualquier ubicación del mundo',
            'image_url': 'https://cdn.pixabay.com/photo/2013/04/01/09/22/clouds-98536_960_720.png',
            'category': 'Weather',
            'route': '/apps/weather',
            'api_name': 'Weather Forecast API'
        },
        {
            'id': 'currency-converter',
            'title': 'Currency Converter',
            'description': 'Convierte divisas con tasas de cambio en tiempo real',
            'image_url': 'https://cdn.pixabay.com/photo/2017/08/23/13/44/currency-exchange-2672531_960_720.png',
            'category': 'Finance',
            'route': '/apps/currency',
            'api_name': 'Currency Exchange API'
        },
        {
            'id': 'stock-tracker',
            'title': 'Stock Market Tracker',
            'description': 'Sigue el rendimiento de acciones y mercados financieros en tiempo real',
            'image_url': 'https://cdn.pixabay.com/photo/2017/11/27/07/02/financial-2980349_960_720.jpg',
            'category': 'Finance',
            'route': '/apps/stocks',
            'api_name': 'Stock Market API'
        },
        {
            'id': 'news-aggregator',
            'title': 'News Aggregator',
            'description': 'Recopila noticias de diferentes fuentes en un solo lugar',
            'image_url': 'https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg',
            'category': 'News',
            'route': '/apps/news',
            'api_name': 'News API'
        },
        {
            'id': 'covid-tracker',
            'title': 'COVID-19 Tracker',
            'description': 'Monitorea estadísticas y tendencias de COVID-19 en todo el mundo',
            'image_url': 'https://cdn.pixabay.com/photo/2020/04/21/00/40/coronavirus-5071045_960_720.jpg',
            'category': 'Health',
            'route': '/apps/covid',
            'api_name': 'COVID-19 Statistics API'
        }
    ]
    
    # Verificar si ya existen aplicaciones
    if App.query.count() == 0:
        for app_data in sample_apps:
            app = App(
                id=app_data['id'],
                title=app_data['title'],
                description=app_data['description'],
                image_url=app_data['image_url'],
                category=app_data['category'],
                route=app_data['route'],
                api_name=app_data['api_name']
            )
            db.session.add(app)
        
        db.session.commit()
        return True
    
    return False 