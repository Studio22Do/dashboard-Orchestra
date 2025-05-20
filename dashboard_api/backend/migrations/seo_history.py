"""Migración para crear la tabla seo_history"""

from api.models import db

def upgrade():
    # Crear la tabla seo_history
    db.create_table('seo_history',
        db.Column('id', db.Integer, primary_key=True),
        db.Column('user_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
        db.Column('topic', db.String(255), nullable=False),
        db.Column('titles', db.JSON),
        db.Column('meta_description', db.Text),
        db.Column('keywords', db.JSON),
        db.Column('created_at', db.DateTime, default=db.func.now())
    )

def downgrade():
    # Eliminar la tabla seo_history
    db.drop_table('seo_history') 