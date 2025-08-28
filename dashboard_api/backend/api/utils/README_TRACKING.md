# Sistema de Tracking Global Automático + Uptime en Tiempo Real

## 🎯 Descripción

Sistema de tracking **completamente automático** que registra el uso de todas las APIs y calcula **uptime real en tiempo real** basado en el rendimiento real de las aplicaciones.

## 🚀 Características

- ✅ **100% Automático** - No requiere configuración manual
- ✅ **Cobertura Total** - Trackea todas las APIs automáticamente
- ✅ **Sin Decoradores** - No hay que agregar `@track_api_usage`
- ✅ **Middleware Global** - Se aplica a nivel de aplicación Flask
- ✅ **Inteligente** - Detecta automáticamente qué API se está usando
- ✅ **Uptime Real** - Calcula porcentaje de éxito basado en llamadas reales
- ✅ **Estado Automático** - Determina estado según uptime (Operativo, Advertencia, Crítico)
- ✅ **Última Verificación** - Muestra fecha/hora real de la última llamada

## 📁 Estructura de Archivos

```
api/utils/
├── __init__.py              # Solo exporta init_global_tracking
├── global_tracking.py       # Sistema principal de tracking
└── README_TRACKING.md       # Esta documentación

api/routes/
└── stats.py                 # Sistema de uptime y rendimiento real
```

## 🔧 Cómo Funciona

### 1. **Middleware Flask**
- `before_request`: Captura tiempo de inicio y user_id
- `after_request`: Calcula tiempo de respuesta y registra en base de datos

### 2. **Detección Automática**
- Analiza la ruta del request (`/api/beta_v2/instagram/profile`)
- Mapea automáticamente a `app_id` (`instagram-stats`)
- No requiere configuración manual

### 3. **Filtros Inteligentes**
- Solo trackea endpoints de API (`/api/`)
- Excluye archivos estáticos, favicon, etc.
- **Excluye endpoints del sistema** para evitar loops:
  - `/auth/` - Sistema de autenticación
  - `/apps/` - Gestión de aplicaciones
  - `/stats/` - Estadísticas del sistema
  - `/notifications/` - Notificaciones del sistema
  - `/credits/` - Sistema de créditos interno
  - `/version-info` - Información de versión

## 📊 Datos Registrados

Cada llamada a la API genera un registro en la tabla `ApiUsage`:

```python
{
    'app_id': 'instagram-stats',           # Detectado automáticamente
    'endpoint': 'GET /api/beta_v2/instagram/profile',
    'status_code': 200,                    # Código de respuesta HTTP
    'response_time': 150.25,               # Tiempo en milisegundos
    'user_id': 123,                        # ID del usuario autenticado
    'created_at': '2025-01-28 10:30:00'   # Timestamp automático
}
```

## 🎯 Mapeo Automático de APIs

El sistema mapea automáticamente las rutas a `app_id`:

| Ruta | App ID |
|------|--------|
| `/instagram` | `instagram-stats` |
| `/ai-humanizer` | `ai-humanizer` |
| `/seo-analyzer` | `seo-analyzer` |
| `/seo-mastermind` | `seo-mastermind` |
| `/prlabs` | `prlabs` |
| `/google-news` | `google-news` |
| `/whois-lookup` | `whois-lookup` |
| `/pdf-converter` | `pdf-converter` |
| `/pagespeed-insights` | `pagespeed-insights` |
| `/ssl-checker` | `ssl-checker` |
| `/text-extract` | `text-extract` |
| `/media-downloader` | `snap-video` |
| `/social-media-content` | `social-media-content` |
| `/image-manipulation` | `advanced-image-manipulation` |
| `/runwayml` | `runwayml` |
| `/similarweb` | `similarweb` |
| `/keyword-insight` | `google-keyword-insight` |
| `/domain-metrics` | `domain-metrics` |
| `/product-description` | `product-description` |
| `/website-status` | `website-status` |
| `/website-analyzer` | `website-analyzer` |
| `/ahrefs-dr` | `ahrefs-dr` |
| `/speech-to-text` | `speech-to-text` |
| `/picpulse` | `picpulse` |
| `/qrcode-generator` | `qrcode-generator` |
| `/mediafy` | `mediafy` |
| `/perplexity` | `perplexity` |
| `/google-paid-search` | `google-paid-search` |

## 🆕 Sistema de Uptime en Tiempo Real

### **Cálculo Automático de Uptime**
```python
# Uptime = (Llamadas Exitosas / Total Llamadas) × 100
uptime = (successful_calls / total_calls * 100)

# Estado automático según uptime:
if uptime >= 95:      status = "Operativo"
elif uptime >= 80:    status = "Advertencia"  
elif uptime >= 50:    status = "Crítico"
else:                  status = "Fuera de servicio"
```

### **Métricas Reales Calculadas**
- **Uptime**: Porcentaje real de llamadas exitosas
- **Estado**: Determinado automáticamente por uptime
- **Tiempo de Respuesta**: Promedio real de todas las llamadas
- **Última Verificación**: Fecha/hora real de la última llamada
- **Llamadas Totales**: Número real de llamadas a la API
- **Llamadas Exitosas**: Llamadas con status_code < 400
- **Llamadas Fallidas**: Llamadas con status_code >= 400

## 🚀 Uso

### 1. **Inicialización Automática**
El tracking se inicializa automáticamente en `api/__init__.py`:

```python
# Inicializar tracking global automático para todas las APIs
from api.utils.global_tracking import init_global_tracking
init_global_tracking(app)
```

### 2. **Sin Configuración Manual**
**NO** necesitas agregar decoradores a tus endpoints:

```python
# ❌ ANTES (obsoleto)
@track_api_usage('instagram-stats')
def mi_endpoint():
    pass

# ✅ AHORA (automático)
def mi_endpoint():  # Se trackea automáticamente
    pass
```

### 3. **Funciona con Todas las APIs**
- Instagram, SEO, Google News, PDF, SSL, etc.
- APIs existentes y **nuevas APIs** se trackean automáticamente
- Sin necesidad de modificar código existente

## 🧪 Pruebas

### **Verificación del Dashboard**
```bash
# Obtener estadísticas con uptime real
GET /api/beta_v2/stats/dashboard

# Respuesta incluye uptime real:
{
  "apiPerformance": [
    {
      "api": "Instagram Statistics",
      "status": "Operativo",           # ✅ Estado automático
      "uptime": 100.0,                 # ✅ Uptime real (no placeholder)
      "responseTime": 150,              # ✅ Tiempo real promedio
      "lastCheck": "2025-08-28 19:32"  # ✅ Fecha/hora real
    }
  ]
}
```

### **Verificación del Tracking Global**
```bash
# Hacer llamadas a cualquier API
POST /api/beta_v2/instagram/profile
POST /api/beta_v2/prlabs/chat
GET /api/beta_v2/seo-analyzer/analyze

# Verificar que aparecen en el dashboard
# Confirmar que uptime se calcula automáticamente
```

## 🔍 Monitoreo

### **Logs del Sistema**
```python
# En los logs verás:
"Global API Usage tracked: instagram-stats - GET /api/beta_v2/instagram/profile - 150.25ms - 200"
```

### **Dashboard en Tiempo Real**
- **Métricas automáticas** de todas las APIs
- **Uptime real** basado en rendimiento real
- **Tiempos de respuesta reales** (no simulados)
- **Estado automático** según rendimiento
- **Última verificación** con timestamp real
- **Sin datos simulados** - Todo es información real del sistema

## 🎉 Beneficios

1. **Cero Configuración** - Funciona desde el primer momento
2. **Cobertura Total** - Todas las APIs incluidas automáticamente
3. **Mantenimiento Cero** - No hay que agregar decoradores
4. **Escalabilidad** - Nuevas APIs se trackean automáticamente
5. **Consistencia** - Mismo formato para todas las APIs
6. **Datos Reales** - Dashboard con información real del sistema
7. **Uptime Real** - Porcentaje de éxito basado en datos reales
8. **Estado Automático** - Clasificación automática según rendimiento
9. **Monitoreo Inteligente** - Detección automática de problemas
10. **Transparencia** - Visibilidad completa del rendimiento del sistema

## 🚫 Lo que NO Necesitas

- ❌ Decoradores `@track_api_usage`
- ❌ Configuración manual por endpoint
- ❌ Modificar código existente
- ❌ Agregar tracking a nuevas APIs
- ❌ Scripts de generación de datos
- ❌ Placeholders de uptime (99.9%)
- ❌ Estados hardcodeados
- ❌ Fechas simuladas de verificación

## ✨ Resultado Final

**Dashboard completamente funcional con:**
- ✅ **Tracking automático** de todas las APIs
- ✅ **Uptime real** calculado en tiempo real
- ✅ **Estados automáticos** según rendimiento
- ✅ **Métricas reales** sin datos simulados
- ✅ **Última verificación** con timestamps reales
- ✅ **Tiempos de respuesta** promedios reales
- ✅ **Cobertura total** sin intervención manual

## 🔧 Endpoints Disponibles

### **Dashboard Principal**
- `GET /api/beta_v2/stats/dashboard` - Estadísticas generales con uptime real

### **Rendimiento Detallado**
- `GET /api/beta_v2/stats/performance/<app_id>` - Métricas detalladas de una API específica

### **Estadísticas de Aplicación**
- `GET /api/beta_v2/stats/apps/<app_id>` - Estadísticas históricas de una aplicación

## 📈 Ejemplo de Datos Reales

```json
{
  "apiPerformance": [
    {
      "api": "Instagram Statistics",
      "status": "Operativo",
      "responseTime": 150,
      "uptime": 100.0,
      "lastCheck": "2025-08-28 19:32"
    },
    {
      "api": "PRLabs",
      "status": "Operativo", 
      "responseTime": 200,
      "uptime": 95.2,
      "lastCheck": "2025-08-28 19:30"
    },
    {
      "api": "SEO Analyzer",
      "status": "Sin datos",
      "responseTime": 0,
      "uptime": 0.0,
      "lastCheck": "-"
    }
  ]
}
```

---

*Sistema implementado y funcionando - Tracking global automático + Uptime real para todas las APIs* 🎯

**Estado**: ✅ **COMPLETAMENTE FUNCIONAL**
- Tracking global automático funcionando
- Sistema de uptime real implementado
- Dashboard con datos reales
- Sin placeholders ni datos simulados
