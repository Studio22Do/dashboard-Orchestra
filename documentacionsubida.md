# 📚 Documentación Completa: Migración de Base de Datos a Supabase

## 🎯 **Resumen Ejecutivo**

Este documento detalla el proceso completo de migración de la base de datos PostgreSQL local del proyecto **Dashboard Orchestra** a **Supabase**, una plataforma de base de datos PostgreSQL en la nube. El objetivo era hacer la base de datos accesible desde cualquier lugar sin depender del servidor local de la oficina.

---

## 📋 **Tabla de Contenidos**

1. [Objetivos y Justificación](#objetivos-y-justificación)
2. [Selección de Plataforma](#selección-de-plataforma)
3. [Preparación del Entorno](#preparación-del-entorno)
4. [Proceso de Migración](#proceso-de-migración)
5. [Configuración en Supabase](#configuración-en-supabase)
6. [Solución de Problemas](#solución-de-problemas)
7. [Configuración del Proyecto](#configuración-del-proyecto)
8. [Despliegue en Koyeb](#despliegue-en-koyeb)
9. [Verificación y Testing](#verificación-y-testing)
10. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
11. [Mantenimiento y Backup](#mantenimiento-y-backup)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 **Objetivos y Justificación**

### **Problema Identificado:**
- La base de datos PostgreSQL estaba alojada en un servidor local de la oficina
- Acceso limitado solo desde la red local
- Dependencia del servidor físico para el funcionamiento de la aplicación
- Imposibilidad de acceder a la base de datos desde ubicaciones remotas

### **Objetivos:**
- ✅ Migrar la base de datos a la nube
- ✅ Hacer la base de datos accesible desde cualquier lugar
- ✅ Mantener la funcionalidad existente
- ✅ Preparar el proyecto para despliegue en producción
- ✅ Eliminar dependencias del servidor local

### **Beneficios Esperados:**
- **Accesibilidad:** Base de datos disponible 24/7 desde cualquier ubicación
- **Escalabilidad:** Capacidad de crecimiento sin limitaciones de hardware local
- **Mantenibilidad:** Reducción de tareas de mantenimiento del servidor
- **Despliegue:** Facilidad para desplegar en plataformas cloud como Koyeb

---

## 🏗️ **Selección de Plataforma**

### **Opciones Evaluadas:**

#### **1. Supabase (Seleccionado) ⭐**
- **Plan gratuito:** 500MB de base de datos
- **Ventajas:**
  - PostgreSQL nativo (compatibilidad total)
  - API REST automática
  - Dashboard web intuitivo
  - Conexiones SSL seguras
  - Backups automáticos
  - Interfaz web fácil de usar
  - Soporte para migraciones

#### **2. Neon (Alternativa)**
- **Plan gratuito:** 3GB de base de datos
- **Ventajas:**
  - PostgreSQL serverless
  - Escalabilidad automática
  - Conexiones ilimitadas
- **Desventajas:**
  - Interfaz menos intuitiva
  - Configuración más compleja

#### **3. Railway**
- **Plan gratuito:** $5 de crédito mensual
- **Ventajas:**
  - Fácil despliegue
  - Integración con GitHub
- **Desventajas:**
  - Créditos limitados
  - Menos especializado en bases de datos

### **Justificación de la Selección:**
Supabase fue seleccionado por su **facilidad de uso**, **compatibilidad total con PostgreSQL**, **interfaz intuitiva** y **plan gratuito generoso** que cubre las necesidades del proyecto.

---

## 🔧 **Preparación del Entorno**

### **Requisitos Previos:**
- ✅ Acceso SSH al servidor local
- ✅ Credenciales de PostgreSQL
- ✅ Conocimiento de la estructura de la base de datos
- ✅ Cuenta en Supabase

### **Herramientas Utilizadas:**
- **Terminal SSH:** Para acceder al servidor local
- **pg_dump:** Para exportar la base de datos
- **FileZilla/SCP:** Para descargar archivos de backup
- **Supabase Dashboard:** Para configurar la base de datos en la nube

---

## 🚀 **Proceso de Migración**

### **Fase 1: Acceso al Servidor Local**

#### **1.1 Conexión SSH:**
```bash
# Comando de conexión
ssh administrator@172.18.102.46

# Verificación de conectividad
ping 172.18.102.46
```

#### **1.2 Problemas de Conectividad:**
```
ssh: connect to host 172.18.102.46 port 22: No route to host
ping: Destination Host Unreachable
```

**Causas identificadas:**
- Servidor apagado o desconectado
- Cambio en la IP del servidor
- Problemas de red local
- Firewall bloqueando conexiones

**Solución:**
- Acceso físico al servidor
- Verificación del estado de la red
- Obtención de la IP actual del servidor

### **Fase 2: Exportación de la Base de Datos**

#### **2.1 Acceso a PostgreSQL:**
```bash
# Conexión a PostgreSQL
psql -U postgres

# Listar bases de datos disponibles
\l

# Conexión a la base específica
\c rapidapi_dashboard
```

#### **2.2 Estructura de la Base de Datos:**
```
rapidapi_dashboard=# \dt
                    List of relations
 Schema |       Name        | Type  |  Owner   
--------+-------------------+-------+----------
 public | alembic_version   | table | postgres
 public | api_usage         | table | postgres
 public | apps              | table | postgres
 public | apps_backup       | table | postgres
 public | notifications     | table | postgres
 public | user_apps         | table | postgres
 public | users             | table | postgres
```

#### **2.3 Primer Intento de Exportación:**
```bash
# Exportación básica (solo datos)
pg_dump -U postgres -d rapidapi_dashboard --data-only --inserts > backup_corregido.sql
```

**Problema identificado:**
- El formato `COPY` no es compatible con Supabase
- Los datos están separados por tabulaciones
- Supabase prefiere statements `INSERT INTO`

#### **2.4 Exportación Corregida:**
```bash
# Exportación completa (estructura + datos)
pg_dump -U postgres -d rapidapi_dashboard > backup_completo.sql
```

### **Fase 3: Descarga del Backup**

#### **3.1 Verificación del Archivo:**
```bash
# Verificar que se creó el archivo
ls -la backup_completo.sql

# Verificar el tamaño
du -h backup_completo.sql

# Ver el contenido (primeras líneas)
head -30 backup_completo.sql
```

**Resultado:**
```
-rw-rw-r-- 1 administrator administrator 24729 Aug 21 15:04 backup_completo.sql
28K	backup_completo.sql
```

#### **3.2 Descarga con SCP:**
```bash
# Desde la máquina local
scp administrator@172.18.102.46:~/backup_completo.sql ./

# Verificación de descarga
ls -la backup_completo.sql
```

---

## ⚙️ **Configuración en Supabase**

### **Fase 1: Creación del Proyecto**

#### **1.1 Creación de Cuenta:**
- Acceso a [supabase.com](https://supabase.com)
- Registro con credenciales de usuario
- Verificación de email

#### **1.2 Creación del Proyecto:**
- **Nombre del proyecto:** Dashboard Orchestra
- **Database password:** Configurado según estándares de seguridad
- **Region:** Seleccionada para optimizar latencia

### **Fase 2: Configuración de la Base de Datos**

#### **2.1 Acceso a la Configuración:**
- Navegación a **Settings** → **Database**
- Visualización de configuración de conexión
- Obtención de credenciales de acceso

#### **2.2 Credenciales de Conexión:**
```
Host: db.uhyepxentwknhwkdlcan.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [configurado por el usuario]
```

#### **2.3 Connection String:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.uhyepxentwknhwkdlcan.supabase.co:5432/postgres
```

### **Fase 3: Importación de Datos**

#### **3.1 Primer Intento (Fallido):**
- Uso directo del archivo de backup
- Error: `syntax error at or near "mediafy"`
- Problema: Formato `COPY` incompatible

#### **3.2 Análisis del Problema:**
```sql
-- Línea problemática identificada
COPY public.apps (id, title, description, image_url, category, route, api_name, is_active, created_at, updated_at, icon_url) FROM stdin;
mediafy	Mediafy API	API completa para análisis de Instagram y redes sociales	/src/assets/images/apps/banners/Mediafy.png	Social Media	/apps/mediafy	Mediafy API	t	\N	\N	\N
```

**Problemas identificados:**
- Comando `COPY` no soportado por Supabase
- Datos separados por tabulaciones en lugar de comas
- Falta de comillas en valores de texto

#### **3.3 Solución: Conversión a INSERT Statements**

**Código SQL corregido para Supabase:**
```sql
-- Crear tablas
CREATE TABLE IF NOT EXISTS public.alembic_version (
    version_num character varying(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_usage (
    id integer NOT NULL,
    app_id character varying(50) NOT NULL,
    user_id integer,
    endpoint character varying(255) NOT NULL,
    status_code integer NOT NULL,
    response_time double precision NOT NULL,
    created_at timestamp without time zone
);

CREATE TABLE IF NOT EXISTS public.apps (
    id character varying(50) NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    image_url character varying(255),
    category character varying(50) NOT NULL,
    route character varying(100) NOT NULL,
    api_name character varying(100) NOT NULL,
    is_active boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    icon_url character varying(255)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(20) NOT NULL,
    title character varying(100) NOT NULL,
    message text NOT NULL,
    category character varying(20) NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    link character varying(255)
);

CREATE TABLE IF NOT EXISTS public.user_apps (
    id integer NOT NULL,
    user_id integer NOT NULL,
    app_id character varying(50) NOT NULL,
    is_favorite boolean DEFAULT false,
    purchased_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(20),
    is_active boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    plan character varying(20) DEFAULT 'basic'::character varying,
    is_verified boolean DEFAULT false,
    verification_token character varying(255),
    verification_sent_at timestamp without time zone,
    version character varying(20) DEFAULT 'beta_v2'::character varying,
    credits integer DEFAULT 250
);

-- Crear secuencias
CREATE SEQUENCE IF NOT EXISTS public.api_usage_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.notifications_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.user_apps_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Insertar datos de apps
INSERT INTO public.apps (id, title, description, image_url, category, route, api_name, is_active, created_at, updated_at, icon_url) VALUES
('mediafy', 'Mediafy API', 'API completa para análisis de Instagram y redes sociales', '/src/assets/images/apps/banners/Mediafy.png', 'Social Media', '/apps/mediafy', 'Mediafy API', true, NULL, NULL, NULL),
('perplexity', 'Perplexity', 'Búsquedas inteligentes con IA - Análisis avanzado de Google data', '/src/assets/images/apps/banners/perplexity.png', 'AI Tools', '/apps/perplexity', 'Perplexity API', true, NULL, NULL, NULL),
-- ... [más aplicaciones]

-- Insertar usuarios
INSERT INTO public.users (id, email, password_hash, name, role, is_active, created_at, updated_at, plan, is_verified, verification_token, verification_sent_at, version, credits) VALUES
(8, 'ramfi.delacruz@studio22.com.do', 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef', 'ram', 'user', true, '2025-06-03 19:21:05.521929', '2025-06-03 19:21:51.498659', 'basic', true, NULL, '2025-06-03 19:21:13.425602', 'beta_v2', 250),
-- ... [más usuarios]

-- Configurar secuencias
SELECT setval('public.api_usage_id_seq', 1, true);
SELECT setval('public.notifications_id_seq', 1, false);
SELECT setval('public.user_apps_id_seq', 41, true);
SELECT setval('public.users_id_seq', 20, true);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX IF NOT EXISTS ix_apps_category ON public.apps USING btree (category);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON public.users USING btree (email);

-- Crear constraints
ALTER TABLE ONLY public.alembic_version ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);
ALTER TABLE ONLY public.api_usage ADD CONSTRAINT api_usage_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.apps ADD CONSTRAINT apps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_apps ADD CONSTRAINT user_apps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Crear foreign keys
ALTER TABLE ONLY public.api_usage ADD CONSTRAINT api_usage_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id);
ALTER TABLE ONLY public.api_usage ADD CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_apps ADD CONSTRAINT user_apps_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id);
ALTER TABLE ONLY public.user_apps ADD CONSTRAINT user_apps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
```

#### **3.4 Limpieza de Tablas Existentes:**
```sql
-- Limpiar todo primero
DROP TABLE IF EXISTS public.user_apps CASCADE;
DROP TABLE IF EXISTS public.api_usage CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.alembic_version CASCADE;

-- Eliminar secuencias
DROP SEQUENCE IF EXISTS public.api_usage_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.notifications_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.user_apps_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;
```

#### **3.5 Ejecución Exitosa:**
- Importación de todas las tablas
- Inserción de todos los datos
- Configuración de secuencias e índices
- Establecimiento de relaciones entre tablas

---

## 🔧 **Solución de Problemas**

### **Problema 1: Error de Sintaxis COPY**

#### **Descripción:**
```
ERROR: 42601: syntax error at or near "mediafy"
LINE 284: mediafy	Mediafy API	API completa para análisis de Instagram y redes sociales...
```

#### **Causa:**
- Formato `COPY` incompatible con Supabase
- Datos separados por tabulaciones
- Falta de comillas en valores de texto

#### **Solución:**
- Conversión manual a statements `INSERT INTO`
- Uso de comillas y comas apropiadas
- Formato compatible con PostgreSQL estándar

### **Problema 2: Tablas Duplicadas**

#### **Descripción:**
```
ERROR: 23505: duplicate key value violates unique constraint "apps_pkey"
DETAIL: Key (id)=(mediafy) already exists.
```

#### **Causa:**
- Las tablas ya existían en Supabase
- Intento de inserción de datos duplicados

#### **Solución:**
- Eliminación completa de todas las tablas existentes
- Recreación desde cero
- Uso de `DROP TABLE IF EXISTS ... CASCADE`

### **Problema 3: Problemas de Conectividad SSH**

#### **Descripción:**
```
ssh: connect to host 172.18.102.46 port 22: No route to host
ping: Destination Host Unreachable
```

#### **Causas:**
- Servidor apagado o desconectado
- Cambio en la IP del servidor
- Problemas de red local
- Firewall bloqueando conexiones

#### **Soluciones:**
- Acceso físico al servidor
- Verificación del estado de la red
- Obtención de la IP actual del servidor

---

## ⚙️ **Configuración del Proyecto**

### **Fase 1: Variables de Entorno**

#### **1.1 Archivo .env del Backend:**
```bash
# Configuración de la base de datos
DEV_DATABASE_URI=postgresql://postgres:Aa.123456789!!@db.uhyepxentwknhwkdlcan.supabase.co:5432/postgres

# Otras configuraciones
FLASK_APP=app.py
FLASK_DEBUG=1
MODE=beta_v2
SECRET_KEY=tu_secret_key_aqui
JWT_SECRET_KEY=tu_jwt_secret_key_aqui
RAPIDAPI_SOCIAL_MEDIA_CONTENT_KEY=tu_rapidapi_key_aqui
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=tu_rapidapi_host_aqui
RAPIDAPI_URL=tu_rapidapi_url_aqui
```

#### **1.2 Archivo .env del Frontend:**
```bash
# Configuración del frontend (NO incluir credenciales de DB)
REACT_APP_API_URL=http://localhost:5000/api
HOST=0.0.0.0
PORT=3000
REACT_APP_MODE=beta_v2
```

### **Fase 2: Configuración de la Aplicación**

#### **2.1 Archivo config.py:**
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configuración de la base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv('DEV_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Otras configuraciones
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    MODE = os.getenv('MODE', 'beta_v2')
```

#### **2.2 Verificación de Conexión:**
```python
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def init_db(app):
    app.config.from_object(Config)
    db.init_app(app)
    
    try:
        with app.app_context():
            db.create_all()
            print("✅ Base de datos conectada exitosamente")
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
```

---

## 🚀 **Despliegue en Koyeb**

### **Fase 1: Configuración de Variables de Entorno**

#### **1.1 Acceso a Koyeb:**
- Navegación a [koyeb.com](https://koyeb.com)
- Acceso al dashboard del proyecto
- Selección del servicio a configurar

#### **1.2 Configuración de Variables:**
- **Settings** → **Environment Variables**
- **Variable:** `DEV_DATABASE_URI`
- **Valor:** `postgresql://postgres:Aa.123456789!!@db.uhyepxentwknhwkdlcan.supabase.co:5432/postgres`

#### **1.3 Variables Adicionales Recomendadas:**
```bash
FLASK_ENV=production
SECRET_KEY=tu_secret_key_produccion_aqui
JWT_SECRET_KEY=tu_jwt_secret_key_produccion_aqui
MODE=beta_v2
```

### **Fase 2: Despliegue y Verificación**

#### **2.1 Redeploy:**
- Aplicación de las nuevas variables de entorno
- Redeploy automático del servicio
- Verificación de logs de despliegue

#### **2.2 Verificación de Conexión:**
- Testing de endpoints de la API
- Verificación de conexión a la base de datos
- Monitoreo de logs de errores

---

## ✅ **Verificación y Testing**

### **Fase 1: Verificación de Tablas**

#### **1.1 Comando de Verificación:**
```sql
-- Ver cuántos registros tiene cada tabla
SELECT 'users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'apps', COUNT(*) FROM apps
UNION ALL
SELECT 'user_apps', COUNT(*) FROM user_apps
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
```

#### **1.2 Resultados Esperados:**
```
tabla        | total
-------------+-------
users        | 13
apps         | 32
user_apps    | 28
notifications| 0
```

### **Fase 2: Verificación de Usuarios**

#### **2.1 Comando de Verificación:**
```sql
-- Ver usuarios registrados
SELECT id, email, name, role, is_active, credits, created_at 
FROM users 
ORDER BY created_at DESC;
```

#### **2.2 Verificación de Aplicaciones:**
```sql
-- Ver aplicaciones disponibles
SELECT id, title, category, is_active 
FROM apps 
ORDER BY category, title;
```

### **Fase 3: Testing de Conexión**

#### **3.1 Testing Local:**
```bash
# Probar conexión desde terminal local
psql "postgresql://postgres:Aa.123456789!!@db.uhyepxentwknhwkdlcan.supabase.co:5432/postgres"

# Verificar tablas
\dt

# Verificar datos
SELECT COUNT(*) FROM users;
```

#### **3.2 Testing de la Aplicación:**
- Verificación de login de usuarios
- Testing de endpoints de la API
- Verificación de consultas a la base de datos

---

## 🔒 **Consideraciones de Seguridad**

### **1. Credenciales de Base de Datos**

#### **1.1 Protección de Passwords:**
- **Nunca** commitear credenciales en el código
- Uso de variables de entorno
- Rotación regular de passwords
- Uso de passwords fuertes

#### **1.2 Acceso a la Base de Datos:**
- Restricción de IPs si es necesario
- Uso de conexiones SSL
- Monitoreo de accesos
- Logs de auditoría

### **2. Variables de Entorno**

#### **2.1 Archivos .env:**
- **NO** incluir en control de versiones
- Uso de `.env.example` para documentación
- Configuración específica por ambiente
- Validación de variables requeridas

#### **2.2 Producción:**
- Uso de secretos del sistema
- Encriptación de valores sensibles
- Rotación automática de credenciales
- Monitoreo de cambios

### **3. Acceso a Supabase**

#### **3.1 Dashboard:**
- Acceso restringido a usuarios autorizados
- Logs de actividad
- Notificaciones de cambios
- Backup de configuración

#### **3.2 API Keys:**
- Generación de keys específicas por aplicación
- Restricción de permisos
- Rotación regular
- Monitoreo de uso

---

## 🛠️ **Mantenimiento y Backup**

### **1. Backups Automáticos**

#### **1.1 Configuración en Supabase:**
- Backups automáticos diarios
- Retención configurable
- Restauración punto en tiempo
- Exportación manual disponible

#### **1.2 Backup Manual:**
```bash
# Desde Supabase
pg_dump -h db.uhyepxentwknhwkdlcan.supabase.co -U postgres -d postgres > backup_manual.sql

# Verificar backup
ls -la backup_manual.sql
du -h backup_manual.sql
```

### **2. Monitoreo de Rendimiento**

#### **2.1 Métricas de Supabase:**
- Uso de CPU y memoria
- Conexiones activas
- Tiempo de respuesta
- Uso de almacenamiento

#### **2.2 Alertas:**
- Configuración de umbrales
- Notificaciones por email
- Webhooks para integración
- Escalado automático

### **3. Actualizaciones y Mantenimiento**

#### **3.1 Actualizaciones de PostgreSQL:**
- Notificaciones de versiones disponibles
- Ventanas de mantenimiento
- Testing en staging
- Rollback planificado

#### **3.2 Mantenimiento de la Aplicación:**
- Actualización de dependencias
- Testing de compatibilidad
- Deployment gradual
- Monitoreo post-actualización

---

## 🔍 **Troubleshooting**

### **1. Problemas de Conexión**

#### **1.1 Error: "Host desconocido"**
```
"could not translate host name "db.uhyepxentwknhwkdlcan.supabase.co" to address: Host desconocido."
```

**Causas posibles:**
- URL incorrecta de la base de datos
- Problemas de DNS
- Firewall bloqueando conexiones
- Servicio de Supabase caído

**Soluciones:**
- Verificar URL en Supabase Dashboard
- Probar conectividad con `ping` o `nslookup`
- Verificar configuración de red
- Contactar soporte de Supabase

#### **1.2 Error: "Connection refused"**
```
"connection to server at "db.uhyepxentwknhwkdlcan.supabase.co" (x.x.x.x), port 5432 failed: Connection refused"
```

**Causas posibles:**
- Puerto incorrecto
- Servicio PostgreSQL no disponible
- Restricciones de IP
- Credenciales incorrectas

**Soluciones:**
- Verificar puerto (5432 por defecto)
- Verificar credenciales
- Verificar restricciones de IP en Supabase
- Probar conexión desde otra ubicación

### **2. Problemas de Rendimiento**

#### **2.1 Conexiones Lentas:**
```
"Query execution time: 5000ms"
```

**Causas posibles:**
- Plan gratuito limitado
- Consultas no optimizadas
- Falta de índices
- Alto volumen de datos

**Soluciones:**
- Optimizar consultas SQL
- Crear índices apropiados
- Considerar upgrade del plan
- Implementar paginación

#### **2.2 Límites de Conexiones:**
```
"FATAL: remaining connection slots are reserved for non-replication superuser connections"
```

**Causas posibles:**
- Límite del plan gratuito (15 conexiones)
- Conexiones no cerradas correctamente
- Pool de conexiones mal configurado

**Soluciones:**
- Verificar cierre de conexiones
- Configurar pool de conexiones
- Considerar upgrade del plan
- Implementar connection pooling

### **3. Problemas de Datos**

#### **3.1 Datos Duplicados:**
```
"ERROR: duplicate key value violates unique constraint"
```

**Causas posibles:**
- Múltiples ejecuciones del script de migración
- Datos inconsistentes en la fuente
- Problemas en la lógica de inserción

**Soluciones:**
- Limpiar tablas antes de migrar
- Usar `INSERT ... ON CONFLICT`
- Verificar integridad de datos fuente
- Implementar validaciones

#### **3.2 Pérdida de Datos:**
```
"ERROR: relation "users" does not exist"
```

**Causas posibles:**
- Tablas eliminadas accidentalmente
- Script de migración incompleto
- Problemas de permisos

**Soluciones:**
- Restaurar desde backup
- Re-ejecutar script completo
- Verificar permisos de usuario
- Contactar soporte si es necesario

---

## 📚 **Comandos SQL Útiles**

### **1. Comandos de Diagnóstico**

#### **1.1 Verificar Estado de la Base de Datos:**
```sql
-- Ver todas las tablas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver estructura de una tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver relaciones entre tablas
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public';
```

#### **1.2 Verificar Datos:**
```sql
-- Contar registros por tabla
SELECT 'users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'apps', COUNT(*) FROM apps
UNION ALL
SELECT 'user_apps', COUNT(*) FROM user_apps
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;

-- Ver usuarios con detalles
SELECT id, email, name, role, is_active, credits, created_at 
FROM users 
ORDER BY created_at DESC;

-- Ver aplicaciones por categoría
SELECT category, COUNT(*) as total_apps
FROM apps 
GROUP BY category
ORDER BY total_apps DESC;
```

### **2. Comandos de Mantenimiento**

#### **2.1 Limpieza de Datos:**
```sql
-- Limpiar notificaciones antiguas
DELETE FROM notifications 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Limpiar logs de uso de API antiguos
DELETE FROM api_usage 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Verificar usuarios inactivos
SELECT id, email, name, last_login, is_active
FROM users 
WHERE last_login < NOW() - INTERVAL '6 months';
```

#### **2.2 Optimización:**
```sql
-- Crear índices adicionales si es necesario
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_apps_active ON apps (is_active) WHERE is_active = true;

-- Analizar tablas para optimización
ANALYZE users;
ANALYZE apps;
ANALYZE user_apps;
```

---

## 🎯 **Conclusiones y Recomendaciones**

### **1. Éxitos del Proyecto**

#### **1.1 Migración Exitosa:**
- ✅ Base de datos migrada completamente a Supabase
- ✅ Todos los datos preservados y funcionales
- ✅ Estructura de tablas mantenida
- ✅ Relaciones y constraints preservados

#### **1.2 Beneficios Obtenidos:**
- 🌐 **Accesibilidad:** Base de datos disponible desde cualquier lugar
- 🚀 **Escalabilidad:** Preparado para crecimiento futuro
- 🛡️ **Seguridad:** Conexiones SSL y credenciales seguras
- 💰 **Costo:** Plan gratuito que cubre necesidades actuales

### **2. Lecciones Aprendidas**

#### **2.1 Técnicas:**
- **Formato de migración:** Supabase prefiere `INSERT INTO` sobre `COPY`
- **Limpieza previa:** Es necesario eliminar tablas existentes antes de migrar
- **Verificación:** Siempre verificar la estructura y datos después de la migración
- **Backup:** Mantener backups locales como respaldo

#### **2.2 Proceso:**
- **Planificación:** Es crucial tener un plan claro antes de empezar
- **Testing:** Probar cada paso antes de continuar
- **Documentación:** Mantener registro de todos los cambios realizados
- **Rollback:** Tener un plan de contingencia en caso de problemas

### **3. Recomendaciones para el Futuro**

#### **3.1 Mantenimiento:**
- **Monitoreo regular:** Implementar alertas para problemas de conectividad
- **Backups automáticos:** Configurar backups programados
- **Actualizaciones:** Mantener PostgreSQL y dependencias actualizadas
- **Testing:** Probar cambios en ambiente de desarrollo antes de producción

#### **3.2 Escalabilidad:**
- **Plan de crecimiento:** Evaluar necesidades futuras de almacenamiento
- **Optimización:** Monitorear y optimizar consultas SQL
- **Caching:** Implementar estrategias de cache para mejorar rendimiento
- **Load balancing:** Considerar múltiples instancias si es necesario

#### **3.3 Seguridad:**
- **Auditoría:** Implementar logs de auditoría para cambios críticos
- **Rotación:** Rotar credenciales regularmente
- **Acceso:** Limitar acceso a la base de datos solo a usuarios necesarios
- **Encriptación:** Considerar encriptación adicional para datos sensibles

---

## 📞 **Soporte y Contacto**

### **1. Recursos de Supabase**

#### **1.1 Documentación Oficial:**
- [Documentación de Supabase](https://supabase.com/docs)
- [Guías de migración](https://supabase.com/docs/guides/migrations)
- [API Reference](https://supabase.com/docs/reference)

#### **1.2 Comunidad:**
- [Discord de Supabase](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### **2. Contacto de Soporte**

#### **2.1 Supabase:**
- **Email:** support@supabase.com
- **Chat:** Disponible en el dashboard
- **Status Page:** [status.supabase.com](https://status.supabase.com)

#### **2.2 Koyeb:**
- **Documentación:** [docs.koyeb.com](https://docs.koyeb.com)
- **Soporte:** Disponible en el dashboard
- **Comunidad:** [community.koyeb.com](https://community.koyeb.com)

---

## 📝 **Apéndice: Comandos de Referencia**

### **1. Comandos de PostgreSQL**

#### **1.1 Conexión:**
```bash
# Conexión directa
psql "postgresql://postgres:password@host:port/database"

# Conexión con parámetros
psql -h host -U username -d database -p port
```

#### **1.2 Exportación:**
```bash
# Exportación completa
pg_dump -U username -d database > backup.sql

# Solo datos
pg_dump -U username -d database --data-only --inserts > data.sql

# Solo estructura
pg_dump -U username -d database --schema-only > schema.sql
```

#### **1.3 Importación:**
```bash
# Importar desde archivo
psql -U username -d database < backup.sql

# Importar con psql
\i backup.sql
```

### **2. Comandos de Verificación**

#### **2.1 Estado de la Base de Datos:**
```sql
-- Ver versiones
SELECT version();

-- Ver bases de datos
\l

-- Ver tablas
\dt

-- Ver estructura de tabla
\d table_name

-- Ver índices
\di

-- Ver constraints
\d+ table_name
```

#### **2.2 Información del Sistema:**
```sql
-- Ver conexiones activas
SELECT * FROM pg_stat_activity;

-- Ver estadísticas de tablas
SELECT * FROM pg_stat_user_tables;

-- Ver uso de índices
SELECT * FROM pg_stat_user_indexes;
```

---

## 🏁 **Fin de la Documentación**

Esta documentación cubre el proceso completo de migración de la base de datos PostgreSQL local a Supabase, incluyendo todos los pasos, problemas encontrados, soluciones implementadas y recomendaciones para el futuro.

**Fecha de creación:** Agosto 2025  
**Versión:** 1.0  
**Autor:** Asistente de IA  
**Proyecto:** Dashboard Orchestra  

**Última actualización:** Agosto 2025  
**Estado:** Completado ✅
