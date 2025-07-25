from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import random

from api import db
from api.models.app import App, ApiUsage, UserApp
from api.models.user import User
from api.utils.decorators import role_required

# Crear blueprint
stats_bp = Blueprint('stats', __name__)

# --- Helpers ---
def get_metrics(user=None):
    if user and user.role not in ['admin', 'superadmin']:
        # Solo métricas personales
        total_calls = ApiUsage.query.filter_by(user_id=user.id).count()
        total_apps = UserApp.query.filter_by(user_id=user.id).count()
        # Puedes calcular cambios reales si tienes histórico
        return {
            "apiCalls": {"value": total_calls, "change": "+0%"},
            "activeUsers": {"value": 1, "change": "0"},
            "totalApps": {"value": total_apps, "change": "+0"},
            "successRate": {"value": "98.5%", "change": "+0%"}
        }
    else:
        # Métricas globales
        total_calls = ApiUsage.query.count()
        total_users = User.query.filter_by(is_active=True).count()
        total_apps = App.query.filter_by(is_active=True).count()
        return {
            "apiCalls": {"value": total_calls, "change": "+0%"},
            "activeUsers": {"value": total_users, "change": "+0%"},
            "totalApps": {"value": total_apps, "change": "+0"},
            "successRate": {"value": "99.8%", "change": "+0%"}
        }

def get_usage(user=None):
    if user and user.role not in ['admin', 'superadmin']:
        # Uso por usuario
        usage_counts = (
            db.session.query(App.title, db.func.count(ApiUsage.id))
            .join(ApiUsage, App.id == ApiUsage.app_id)
            .filter(ApiUsage.user_id == user.id)
            .group_by(App.title)
            .all()
        )
    else:
        # Uso global
        usage_counts = (
            db.session.query(App.title, db.func.count(ApiUsage.id))
            .join(ApiUsage, App.id == ApiUsage.app_id)
            .group_by(App.title)
            .all()
        )
    total = sum(count for _, count in usage_counts) or 1
    return [
        {"tool": title, "percent": int((count / total) * 100)}
        for title, count in usage_counts
    ]

def get_api_performance():
    # Ejemplo simple: para cada app, calcula cantidad de llamadas y tiempo promedio
    apps = App.query.filter_by(is_active=True).all()
    result = []
    for app in apps:
        calls = ApiUsage.query.filter_by(app_id=app.id).count()
        avg_response = db.session.query(db.func.avg(ApiUsage.response_time)).filter_by(app_id=app.id).scalar() or 0
        result.append({
            "api": app.title,
            "status": "Operativo" if calls > 0 else "Sin datos",
            "responseTime": int(avg_response),
            "uptime": 99.9,  # Placeholder, puedes calcularlo si tienes lógica
            "lastCheck": "-"
        })
    return result

def get_user_metrics(user=None):
    # Métricas personales o globales
    if user and user.role not in ['admin', 'superadmin']:
        return [
            {
                "title": "Usuarios Activos",
                "value": 1,
                "change": "+0%",
                "period": "vs mes anterior",
                "icon": "GroupAdd",
                "color": "#837cf2"
            },
            {
                "title": "Tiempo Promedio",
                "value": "12m",
                "change": "+0%",
                "period": "por sesión",
                "icon": "AccessTime",
                "color": "#2196F3"
            },
            {
                "title": "Tasa de Retorno",
                "value": "50%",
                "change": "+0%",
                "period": "usuarios recurrentes",
                "icon": "RepeatOne",
                "color": "#FF9800"
            },
            {
                "title": "Crecimiento",
                "value": "10%",
                "change": "+0%",
                "period": "nuevos usuarios",
                "icon": "TrendingUp",
                "color": "#E91E63"
            }
        ]
    else:
        total_users = User.query.filter_by(is_active=True).count()
        return [
            {
                "title": "Usuarios Activos",
                "value": total_users,
                "change": "+0%",
                "period": "vs mes anterior",
                "icon": "GroupAdd",
                "color": "#837cf2"
            },
            {
                "title": "Tiempo Promedio",
                "value": "24m",
                "change": "+0%",
                "period": "por sesión",
                "icon": "AccessTime",
                "color": "#2196F3"
            },
            {
                "title": "Tasa de Retorno",
                "value": "68%",
                "change": "+0%",
                "period": "usuarios recurrentes",
                "icon": "RepeatOne",
                "color": "#FF9800"
            },
            {
                "title": "Crecimiento",
                "value": "32%",
                "change": "+0%",
                "period": "nuevos usuarios",
                "icon": "TrendingUp",
                "color": "#E91E63"
            }
        ]

# --- Endpoint principal ---
@stats_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = {
        'metrics': get_metrics(user),
        'usage': get_usage(user),
        'userMetrics': get_user_metrics(user) or []
    }
    if user.role in ['admin', 'superadmin']:
        data['apiPerformance'] = get_api_performance() or []
    return jsonify(data), 200

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