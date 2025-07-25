from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta
import random

from api import db
from api.models.app import App, ApiUsage
from api.models.user import User
from api.utils.decorators import role_required

# Crear blueprint
stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required('admin', 'superadmin')
def get_dashboard_stats():
    """Obtener estadísticas para el dashboard"""
    try:
        now = datetime.utcnow()
        
        # Para desarrollo, generamos estadísticas aleatorias
        # En producción, se obtendrían de la base de datos
        is_development = True
        
        if not is_development:
            # Estadísticas reales basadas en los datos de la base de datos
            return get_real_stats(now)
        else:
            # Estadísticas simuladas para desarrollo
            return get_mock_stats(now)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status_code': 500
        }), 500

def get_real_stats(now):
    """Obtener estadísticas reales de la base de datos"""
    # Obtener período de tiempo (última semana y semana anterior)
    this_week_start = now - timedelta(days=7)
    last_week_start = this_week_start - timedelta(days=7)
    
    # Contar total de apps
    total_apps = App.query.filter_by(is_active=True).count()
    
    # Obtener usuarios activos en las últimas 24 horas
    active_users = db.session.query(ApiUsage.user_id)\
        .filter(ApiUsage.created_at >= now - timedelta(hours=24))\
        .distinct().count()
    
    # Contar llamadas a API esta semana
    api_calls_this_week = ApiUsage.query\
        .filter(ApiUsage.created_at >= this_week_start)\
        .count()
    
    # Contar llamadas a API la semana pasada
    api_calls_last_week = ApiUsage.query\
        .filter(ApiUsage.created_at >= last_week_start, ApiUsage.created_at < this_week_start)\
        .count()
    
    # Calcular cambio porcentual
    percent_change = 0
    if api_calls_last_week > 0:
        percent_change = round(((api_calls_this_week - api_calls_last_week) / api_calls_last_week) * 100)
    
    # Obtener uso por app
    app_usage_data = db.session.query(
        App.id, App.title, db.func.count(ApiUsage.id).label('count')
    ).join(ApiUsage, App.id == ApiUsage.app_id)\
     .group_by(App.id)\
     .order_by(db.func.count(ApiUsage.id).desc())\
     .limit(4).all()
    
    app_usage = []
    colors = ['#E1306C', '#4A90E2', '#5CB85C', '#F7A35C']
    
    for i, (app_id, app_name, count) in enumerate(app_usage_data):
        app_usage.append({
            'id': app_id,
            'name': app_name,
            'count': count,
            'color': colors[i % len(colors)]
        })
    
    # Contar total de consultas
    total_queries = ApiUsage.query.count()
    
    return jsonify({
        'appUsage': app_usage,
        'totalApps': total_apps,
        'totalQueries': total_queries,
        'apiCalls': {
            'thisWeek': api_calls_this_week,
            'lastWeek': api_calls_last_week,
            'percentChange': percent_change
        },
        'activeUsers': active_users,
        'lastUpdated': now.isoformat()
    }), 200

def get_mock_stats(now):
    """Generar estadísticas simuladas para desarrollo"""
    # Obtener aplicaciones existentes
    apps = App.query.all()
    
    # Generar datos aleatorios pero realistas
    app_usage = []
    colors = ['#E1306C', '#4A90E2', '#5CB85C', '#F7A35C']
    
    # Seleccionar hasta 4 aplicaciones aleatoriamente si hay más de 4
    selected_apps = apps[:4] if len(apps) <= 4 else random.sample(apps, 4)
    
    for i, app in enumerate(selected_apps):
        app_usage.append({
            'id': app.id,
            'name': app.title,
            'count': random.randint(50, 300),
            'color': colors[i % len(colors)]
        })
    
    # Ordenar por conteo
    app_usage.sort(key=lambda x: x['count'], reverse=True)
    
    # Generar otros datos aleatorios
    total_apps = len(apps)
    total_queries = sum(item['count'] for item in app_usage)
    api_calls_this_week = random.randint(300, 500)
    api_calls_last_week = random.randint(250, api_calls_this_week)
    
    # Calcular cambio porcentual
    percent_change = round(((api_calls_this_week - api_calls_last_week) / api_calls_last_week) * 100)
    
    return jsonify({
        'appUsage': app_usage,
        'totalApps': total_apps,
        'totalQueries': total_queries,
        'apiCalls': {
            'thisWeek': api_calls_this_week,
            'lastWeek': api_calls_last_week,
            'percentChange': percent_change
        },
        'activeUsers': random.randint(10, 30),
        'lastUpdated': now.isoformat()
    }), 200

@stats_bp.route('/apps/<string:app_id>', methods=['GET'])
@jwt_required()
@role_required('admin', 'superadmin')
def get_app_stats(app_id):
    """Obtener estadísticas específicas de una aplicación"""
    app = App.query.get(app_id)
    
    if not app:
        return jsonify({
            'error': f'Aplicación {app_id} no encontrada',
            'status_code': 404
        }), 404
    
    # En desarrollo, devolver datos simulados
    now = datetime.utcnow()
    last_30_days = now - timedelta(days=30)
    
    # Generar datos simulados para los últimos 30 días
    daily_stats = []
    
    for i in range(30):
        day = last_30_days + timedelta(days=i)
        daily_stats.append({
            'date': day.strftime('%Y-%m-%d'),
            'calls': random.randint(10, 100),
            'response_time': round(random.uniform(50, 200), 2)  # ms
        })
    
    return jsonify({
        'app': {
            'id': app.id,
            'title': app.title
        },
        'totalCalls': sum(day['calls'] for day in daily_stats),
        'avgResponseTime': round(sum(day['response_time'] for day in daily_stats) / len(daily_stats), 2),
        'dailyStats': daily_stats,
        'lastUpdated': now.isoformat()
    }), 200 