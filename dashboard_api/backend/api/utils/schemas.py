from marshmallow import Schema, fields, validate, ValidationError

class UserSchema(Schema):
    """Esquema para serializar/deserializar datos de usuario"""
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    name = fields.Str(required=True, validate=validate.Length(min=2))
    role = fields.Str(load_default='user', validate=validate.OneOf(['admin', 'user']))
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class LoginSchema(Schema):
    """Esquema para validar datos de inicio de sesión"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class ChangePasswordSchema(Schema):
    """Esquema para validar datos de cambio de contraseña"""
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate.Length(min=6))
    confirm_password = fields.Str(required=True)

    def validate_passwords_match(self, data):
        """Validar que la nueva contraseña y su confirmación coincidan"""
        if data['new_password'] != data['confirm_password']:
            raise ValidationError('Las contraseñas no coinciden')
        if data['current_password'] == data['new_password']:
            raise ValidationError('La nueva contraseña debe ser diferente a la actual')
        return data

class AppSchema(Schema):
    """Esquema para serializar/deserializar datos de aplicación"""
    id = fields.Str(required=True)
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    image_url = fields.Url(required=False, allow_none=True)
    category = fields.Str(required=True)
    route = fields.Str(required=True)
    api_name = fields.Str(required=True)
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class ApiUsageSchema(Schema):
    """Esquema para serializar/deserializar datos de uso de API"""
    id = fields.Int(dump_only=True)
    app_id = fields.Str(required=True)
    user_id = fields.Int(required=False, allow_none=True)
    endpoint = fields.Str(required=True)
    status_code = fields.Int(required=True)
    response_time = fields.Float(required=True)
    created_at = fields.DateTime(dump_only=True)

class StatsSchema(Schema):
    """Esquema para serializar datos de estadísticas del dashboard"""
    app_usage = fields.List(fields.Dict(), required=True)
    total_apps = fields.Int(required=True)
    total_queries = fields.Int(required=True)
    api_calls = fields.Dict(required=True)
    active_users = fields.Int(required=True)
    last_updated = fields.DateTime(required=True) 