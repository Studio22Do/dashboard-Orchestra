# Documentación de Endpoints de Instagram API

## Endpoints Disponibles

### Versión 1 (v1)
- `/user` - Información de usuarios
- `/media` - Información de publicaciones
- `/story` - Historias de Instagram
- `/highlight` - Destacados de perfil
- `/location` - Información de ubicaciones
- `/hashtag` - Búsqueda por hashtags
- `/search` - Búsqueda general
- `/fbsearch` - Búsqueda específica
- `/share` - Compartir contenido

### Versión 2 (v2)
- `/user` - Información de usuarios (versión mejorada)
- `/media` - Información de publicaciones (versión mejorada)
- `/story` - Historias (versión mejorada)
- `/track` - Seguimiento
- `/hashtag` - Búsqueda por hashtags (versión mejorada)
- `/highlight` - Destacados (versión mejorada)
- `/search` - Búsqueda general (versión mejorada)
- `/fbsearch` - Búsqueda específica (versión mejorada)

### GraphQL (gql)
- `/media` - Consultas GraphQL para medios
- `/user` - Consultas GraphQL para usuarios

## ¿Qué necesitamos para hacer una consulta?

Para hacer una consulta necesitamos:

1. **Username o ID**: Para búsquedas relacionadas con usuarios
2. **Hashtag**: Para búsquedas de hashtags
3. **Media ID**: Para búsquedas específicas de contenido
4. **Location ID**: Para búsquedas por ubicación

## Recomendaciones de Uso

1. Para información básica de usuario: usar `v2/user`
2. Para publicaciones: usar `v2/media`
3. Para hashtags: usar `v2/hashtag`
4. Para historias: usar `v2/story`
5. Para destacados: usar `v2/highlight`

## Limitaciones Actuales (Plan Básico)

Según los logs de error que hemos visto, tenemos las siguientes limitaciones:

1. Rate Limiting (429 errors):
   - Stories
   - Following
   - Medias

2. Validación de Datos (422 errors):
   - Highlights
   - Followers

Se recomienda implementar:
- Sistema de reintentos para errores 429
- Validación previa de parámetros para evitar 422
- Caché de resultados para reducir llamadas a la API 