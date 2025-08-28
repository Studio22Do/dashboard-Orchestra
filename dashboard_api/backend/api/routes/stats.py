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
    """Calcular rendimiento real de las APIs basado en ApiUsage"""
    apps = App.query.filter_by(is_active=True).all()
    result = []
    
    for app in apps:
        # Obtener todas las llamadas para esta app
        api_usage = ApiUsage.query.filter_by(app_id=app.id).all()
        
        if not api_usage:
            # Sin datos de uso
            result.append({
                "api": app.title,
                "status": "Sin datos",
                "responseTime": 0,
                "uptime": 0.0,
                "lastCheck": "-"
            })
            continue
        
        # Calcular métricas reales
        total_calls = len(api_usage)
        successful_calls = len([call for call in api_usage if call.status_code < 400])
        failed_calls = total_calls - successful_calls
        
        # Calcular uptime real (porcentaje de llamadas exitosas)
        uptime = (successful_calls / total_calls * 100) if total_calls > 0 else 0.0
        
        # Calcular tiempo de respuesta promedio
        response_times = [call.response_time for call in api_usage if call.response_time is not None]
        avg_response = sum(response_times) / len(response_times) if response_times else 0
        
        # Obtener última verificación (última llamada)
        last_call = max(api_usage, key=lambda x: x.created_at) if api_usage else None
        last_check = last_call.created_at.strftime('%Y-%m-%d %H:%M') if last_call else "-"
        
        # Determinar estado basado en uptime
        if uptime >= 95:
            status = "Operativo"
        elif uptime >= 80:
            status = "Advertencia"
        elif uptime >= 50:
            status = "Crítico"
        else:
            status = "Fuera de servicio"
        
        result.append({
            "api": app.title,
            "status": status,
            "responseTime": int(avg_response),
            "uptime": round(uptime, 1),
            "lastCheck": last_check
        })
    
    return result

def get_user_metrics(user=None):
    """Calcular métricas REALES de usuario basadas en datos de la base de datos"""
    if user and user.role not in ['admin', 'superadmin']:
        # Métricas personales del usuario específico
        user_id = user.id
        
        # Calcular llamadas totales del usuario
        total_user_calls = ApiUsage.query.filter_by(user_id=user_id).count()
        
        # Calcular tiempo promedio de respuesta del usuario
        user_response_times = (
            db.session.query(db.func.avg(ApiUsage.response_time))
            .filter_by(user_id=user_id)
            .scalar()
        )
        avg_response_time = int(user_response_times) if user_response_times else 0
        
        # Calcular herramientas únicas usadas por el usuario
        unique_tools_used = (
            db.session.query(db.func.count(db.func.distinct(ApiUsage.app_id)))
            .filter_by(user_id=user_id)
            .scalar()
        )
        
        # Calcular tasa de éxito del usuario
        successful_calls = (
            db.session.query(db.func.count(ApiUsage.id))
            .filter_by(user_id=user_id)
            .filter(ApiUsage.status_code < 400)
            .scalar()
        )
        success_rate = int((successful_calls / total_user_calls * 100)) if total_user_calls > 0 else 0
        
        return [
            {
                "title": "Mis Llamadas",
                "value": total_user_calls,
                "change": f"+{total_user_calls}",
                "period": "total de llamadas",
                "icon": "GroupAdd",
                "color": "#837cf2"
            },
            {
                "title": "Tiempo Promedio",
                "value": f"{avg_response_time}ms",
                "change": "+0%" if avg_response_time > 0 else "0%",
                "period": "tiempo de respuesta",
                "icon": "AccessTime",
                "color": "#2196F3"
            },
            {
                "title": "Tasa de Éxito",
                "value": f"{success_rate}%",
                "change": "+0%" if success_rate > 0 else "0%",
                "period": "llamadas exitosas",
                "icon": "RepeatOne",
                "color": "#FF9800"
            },
            {
                "title": "Herramientas Usadas",
                "value": unique_tools_used,
                "change": f"+{unique_tools_used}",
                "period": "herramientas diferentes",
                "icon": "TrendingUp",
                "color": "#E91E63"
            }
        ]
    else:
        # Métricas globales del sistema para admin/superadmin
        total_users = User.query.filter_by(is_active=True).count()
        total_calls = ApiUsage.query.count()
        
        # Calcular tiempo promedio global de respuesta
        global_response_times = (
            db.session.query(db.func.avg(ApiUsage.response_time))
            .scalar()
        )
        global_avg_response = int(global_response_times) if global_response_times else 0
        
        # Calcular tasa de éxito global
        global_successful_calls = (
            db.session.query(db.func.count(ApiUsage.id))
            .filter(ApiUsage.status_code < 400)
            .scalar()
        )
        global_success_rate = int((global_successful_calls / total_calls * 100)) if total_calls > 0 else 0
        
        # Calcular herramientas únicas usadas en el sistema
        unique_tools_global = (
            db.session.query(db.func.count(db.func.distinct(ApiUsage.app_id)))
            .scalar()
        )
        
        return [
            {
                "title": "Usuarios Activos",
                "value": total_users,
                "change": f"+{total_users}",
                "period": "usuarios registrados",
                "icon": "GroupAdd",
                "color": "#837cf2"
            },
            {
                "title": "Tiempo Promedio",
                "value": f"{global_avg_response}ms",
                "change": "+0%" if global_avg_response > 0 else "0%",
                "period": "tiempo de respuesta global",
                "icon": "AccessTime",
                "color": "#2196F3"
            },
            {
                "title": "Tasa de Éxito",
                "value": f"{global_success_rate}%",
                "change": "+0%" if global_success_rate > 0 else "0%",
                "period": "éxito global del sistema",
                "icon": "RepeatOne",
                "color": "#FF9800"
            },
            {
                "title": "Herramientas Activas",
                "value": unique_tools_global,
                "change": f"+{unique_tools_global}",
                "period": "herramientas utilizadas",
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



@stats_bp.route('/performance/<string:app_id>', methods=['GET'])
@jwt_required()
@role_required('admin', 'superadmin')
def get_api_performance_details(app_id):
    """Obtener estadísticas detalladas de rendimiento de una API específica"""
    app = App.query.get(app_id)
    
    if not app:
        return jsonify({
            'error': f'Aplicación {app_id} no encontrada',
            'status_code': 404
        }), 404
    
    # Obtener todas las llamadas para esta app
    api_usage = ApiUsage.query.filter_by(app_id=app.id).order_by(ApiUsage.created_at.desc()).all()
    
    if not api_usage:
        return jsonify({
            'app': {'id': app.id, 'title': app.title},
            'message': 'No hay datos de uso para esta aplicación',
            'status_code': 404
        }), 404
    
    # Calcular métricas detalladas
    total_calls = len(api_usage)
    successful_calls = len([call for call in api_usage if call.status_code < 400])
    failed_calls = total_calls - successful_calls
    
    # Calcular uptime
    uptime = (successful_calls / total_calls * 100) if total_calls > 0 else 0.0
    
    # Calcular tiempos de respuesta
    response_times = [call.response_time for call in api_usage if call.response_time is not None]
    avg_response = sum(response_times) / len(response_times) if response_times else 0
    min_response = min(response_times) if response_times else 0
    max_response = max(response_times) if response_times else 0
    
    # Obtener última verificación
    last_call = api_usage[0] if api_usage else None
    last_check = last_call.created_at.strftime('%Y-%m-%d %H:%M') if last_call else "-"
    
    # Determinar estado
    if uptime >= 95:
        status = "Operativo"
        status_color = "success"
    elif uptime >= 80:
        status = "Advertencia"
        status_color = "warning"
    elif uptime >= 50:
        status = "Crítico"
        status_color = "error"
    else:
        status = "Fuera de servicio"
        status_color = "error"
    
    # Estadísticas por código de estado
    status_codes = {}
    for call in api_usage:
        status_code = call.status_code
        if status_code not in status_codes:
            status_codes[status_code] = 0
        status_codes[status_code] += 1
    
    return jsonify({
        'app': {
            'id': app.id,
            'title': app.title
        },
        'performance': {
            'uptime': round(uptime, 1),
            'status': status,
            'statusColor': status_color,
            'totalCalls': total_calls,
            'successfulCalls': successful_calls,
            'failedCalls': failed_calls,
            'successRate': round((successful_calls / total_calls * 100), 1) if total_calls > 0 else 0
        },
        'responseTime': {
            'average': round(avg_response, 2),
            'minimum': round(min_response, 2),
            'maximum': round(max_response, 2),
            'unit': 'ms'
        },
        'lastCheck': last_check,
        'statusCodes': status_codes,
        'lastUpdated': datetime.utcnow().isoformat()
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