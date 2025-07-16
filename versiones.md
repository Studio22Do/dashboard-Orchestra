# Estrategia de Versionado para Dashboard-Orchestra

## Arquitectura General

Se implementan dos versiones de la aplicación usando un solo código base, diferenciando el comportamiento mediante variables de entorno y lógica condicional. Ambas versiones (beta/v1 y beta/v2) corren en el mismo VPS, cada una en su propio contenedor (frontend y backend), compartiendo la misma base de datos PostgreSQL y usando Nginx como reverse proxy para enrutar el tráfico.

```mermaid
graph TD
  Internet --> Nginx
  Nginx --> FrontendV1["Frontend beta/v1"]
  Nginx --> FrontendV2["Frontend beta/v2"]
  Nginx --> BackendV1["Backend beta/v1"]
  Nginx --> BackendV2["Backend beta/v2"]
  BackendV1 --> Postgres[("Base de Datos PostgreSQL")]
  BackendV2 --> Postgres
```

- **Un solo repositorio**: No se duplican archivos ni carpetas. Todo el código está centralizado.
- **Variables de entorno**: Cada instancia usa su propio archivo `.env` para definir el modo de operación (`MODE=beta_v1` o `MODE=beta_v2`).
- **Lógica condicional**: El código revisa la variable `MODE` para activar o desactivar funcionalidades específicas de cada versión.
- **Base de datos compartida**: Se utiliza un solo esquema, diferenciando usuarios y datos por versión mediante un campo como `beta_version` o `user_type`.

## Ejemplo de Lógica Condicional

**Backend (Flask):**
```python
import os
MODE = os.getenv("MODE", "beta_v1")

@app.route('/api/favoritos', methods=['POST'])
def agregar_favorito():
    if MODE == "beta_v1":
        return jsonify({"error": "Funcionalidad no disponible en beta v1"}), 403
    # lógica normal para beta_v2
```

**Frontend (React):**
```jsx
const mode = process.env.REACT_APP_MODE;

return (
  <div>
    {mode === "beta_v2" && <BotonFavoritos />}
    {mode === "beta_v1" && (
      <p className="text-gray-500">Funcionalidad solo disponible en beta v2</p>
    )}
  </div>
);
```

## Despliegue

- **Servicios en el VPS**: Frontend y backend de ambas versiones, base de datos PostgreSQL y Nginx.
- **Docker Compose**: Facilita el levantamiento de los servicios, cada uno con su archivo `.env` correspondiente.
- **Nginx**: Enruta el tráfico a cada frontend/backend según subdominio o ruta.

## Control de Acceso y Datos

- Un solo modelo de usuario, con un campo para distinguir la versión.
- Rate limiting solo para v1.
- Funcionalidades avanzadas solo para v2.

## Ventajas

- Mantenimiento sencillo y centralizado.
- Flexibilidad para agregar más versiones o entornos.
- Un solo punto de análisis y migración de datos.

---

**Resumen:**

La diferenciación de versiones se logra con variables de entorno y lógica condicional, permitiendo mantener un solo código base y facilitar el despliegue, mantenimiento y escalabilidad del sistema. Ambas versiones pueden convivir en el mismo VPS, compartiendo recursos y base de datos, pero con comportamientos y accesos controlados desde la configuración y el código.
