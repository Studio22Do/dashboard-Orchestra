from datetime import datetime
from api.models import db

class SEOHistory(db.Model):
    __tablename__ = 'seo_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic = db.Column(db.String(255), nullable=False)
    titles = db.Column(db.JSON)
    meta_description = db.Column(db.Text)
    keywords = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con el usuario
    user = db.relationship('User', backref=db.backref('seo_history', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'titles': self.titles,
            'meta_description': self.meta_description,
            'keywords': self.keywords,
            'created_at': self.created_at.isoformat()
        } 