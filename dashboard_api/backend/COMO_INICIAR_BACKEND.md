# Cómo Iniciar el Backend - Guía Paso a Paso

## Requisitos Previos
- Python 3.11+ instalado en el sistema
- PowerShell como terminal
- Estar en el directorio del proyecto

## Instrucciones de Inicio

### 1. Navegar al Directorio del Backend

Primero, asegúrate de estar en el directorio correcto del backend:

```powershell
cd C:\Proyectos\dashboard-Orchestra\dashboard_api\backend
```

### 2. Verificar Python

Verifica que Python esté disponible en tu sistema:

```powershell
python3 --version
```

Deberías ver algo como: `Python 3.11.9`

### 3. Instalar Dependencias

Instala todas las dependencias necesarias del proyecto:

```powershell
python3 -m pip install -r requirements.txt
```

### 4. Instalar Dependencias de Google OAuth

El proyecto requiere dependencias adicionales de Google que no están en requirements.txt:

```powershell
python3 -m pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### 5. Ejecutar el Backend

Una vez instaladas todas las dependencias, ejecuta el servidor:

```powershell
python3 run.py
```

## Estado del Servidor

Cuando el backend esté corriendo exitosamente, verás mensajes como:

```
2025-06-03 12:10:32,031 INFO: Iniciando servidor en: http://0.0.0.0:5000
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.100.196:5000
```

## URLs Disponibles

- **Local**: http://127.0.0.1:5000
- **Red Local**: http://192.168.100.196:5000
- **API Base**: http://localhost:5000/api

## Endpoints Principales

- `GET /api/apps` - Lista de aplicaciones
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

## Problemas Comunes y Soluciones

### Error: "No module named 'google'"
**Solución**: Instalar las dependencias de Google OAuth
```powershell
python3 -m pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### Error: "No Python at..."
**Solución**: Usar `python3` en lugar de `python`
```powershell
python3 run.py
```

### Error: Entorno Virtual Corrupto
**Solución**: No usar el entorno virtual corrupto, usar Python del sistema directamente
```powershell
deactivate  # Si estás en un venv problemático
python3 run.py
```

### Error CORS
**Síntoma**: Frontend no puede conectar con el backend
**Solución**: Verificar que Flask-Cors esté instalado y configurado

## Verificación del Estado

Para verificar que el backend esté corriendo:

```powershell
# Verificar puerto 5000 está en uso
netstat -an | findstr :5000

# Hacer petición de prueba (opcional)
Invoke-WebRequest -Uri "http://localhost:5000/api/apps" -Method GET
```

## Notas Importantes

1. **No usar entorno virtual corrupto**: Si hay problemas con el venv, usar Python del sistema
2. **Dependencias adicionales**: Google OAuth no está en requirements.txt, instalar por separado
3. **Modo desarrollo**: El servidor corre en modo debug automáticamente
4. **Puerto**: El backend usa el puerto 5000 por defecto

## Para Detener el Servidor

Presiona `Ctrl + C` en la terminal donde está corriendo el backend.

## Próximos Pasos

Una vez que el backend esté corriendo, el frontend debería poder conectarse en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

**Última actualización**: Junio 2025
**Estado**: Probado y funcionando ✅ 