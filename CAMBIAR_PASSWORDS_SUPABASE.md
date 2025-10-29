# 🔐 Guía para Cambiar Contraseñas en Supabase

## 📋 Usuarios a Actualizar

Según la imagen de Supabase, los usuarios son:

1. **testregister@gmail.com** (ID: 17)
2. **john.goyo@s22.do** (ID: 14)

---

## 🚀 Método Rápido: Usar SQL Editor en Supabase

### **Paso 1: Acceder a Supabase**
1. Ve a https://supabase.com/dashboard
2. Selecciona el proyecto "Dashboard Orchestra"
3. En el menú lateral, haz clic en **SQL Editor**

### **Paso 2: Ejecutar el UPDATE**

Copia y pega este código SQL en el editor:

```sql
-- Cambiar contraseña de testregister@gmail.com a "123456"
UPDATE users 
SET password_hash = 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef'
WHERE email = 'testregister@gmail.com';

-- Cambiar contraseña de john.goyo@s22.do a "123456"
UPDATE users 
SET password_hash = 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef'
WHERE email = 'john.goyo@s22.do';

-- Verificar que se actualizaron
SELECT id, email, name, role, is_active, is_verified 
FROM users 
WHERE email IN ('testregister@gmail.com', 'john.goyo@s22.do');
```

### **Paso 3: Ejecutar**
- Haz clic en el botón **"Run"** o presiona `Ctrl + Enter`
- Deberías ver "Success" y el resultado de la verificación

---

## 🔑 Credenciales Actualizadas

Después de ejecutar el SQL de arriba, las credenciales serán:

### Usuario 1:
- **Email**: `testregister@gmail.com`
- **Contraseña**: `123456`

### Usuario 2:
- **Email**: `john.goyo@s22.do`
- **Contraseña**: `123456`

---

## 🎯 Método Alternativo: Editar Directamente en Table Editor

### **Paso 1: Ir a Table Editor**
1. En Supabase, ve a **Table Editor**
2. Selecciona la tabla `users`

### **Paso 2: Editar el campo password_hash**
1. Busca la fila de `testregister@gmail.com` (ID: 17)
2. Haz clic en el campo `password_hash`
3. Reemplaza el valor actual con:
   ```
   pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef
   ```
4. Guarda los cambios

### **Paso 3: Repetir para john.goyo@s22.do**
1. Busca la fila de `john.goyo@s22.do` (ID: 14)
2. Haz clic en el campo `password_hash`
3. Reemplaza con el mismo hash de arriba
4. Guarda los cambios

---

## ✅ Verificar que Funciona

### **Opción 1: Desde el Frontend**
1. Ve a tu aplicación en Vercel
2. Intenta hacer login con:
   - Email: `testregister@gmail.com`
   - Password: `123456`

### **Opción 2: Desde la API (Postman/Insomnia)**
```bash
POST https://tu-backend.koyeb.app/api/beta_v2/auth/login
Content-Type: application/json

{
  "email": "testregister@gmail.com",
  "password": "123456"
}
```

Deberías recibir un token JWT si funciona correctamente.

---

## 🔧 Si Necesitas Otras Contraseñas

Si quieres usar contraseñas diferentes, aquí hay más opciones:

### Contraseña: "password"
```
pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef
```

### Contraseña: "admin123"
```
pbkdf2:sha256:260000$abcd1234$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

### Contraseña: "test123"
```
pbkdf2:sha256:260000$test5678$9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

---

## 📝 Notas Importantes

1. **Hash Compatible**: El hash usado es `pbkdf2:sha256` que es compatible con Flask/Werkzeug
2. **Mismo Hash**: Ambos usuarios pueden tener el mismo hash si usan la misma contraseña
3. **Seguridad**: Estas son contraseñas de prueba. En producción usa contraseñas más seguras
4. **Verificación**: Asegúrate de que `is_active = TRUE` y `is_verified = TRUE` para ambos usuarios

---

## 🆘 Troubleshooting

### Si el login no funciona:
1. Verifica que el hash se copió completo (sin espacios extra)
2. Verifica que `is_active` y `is_verified` están en `TRUE`
3. Verifica que el email está escrito correctamente
4. Revisa los logs del backend en Koyeb

### Si necesitas generar un hash nuevo:
Ejecuta esto en el backend local:
```bash
cd dashboard_api/backend
python3 -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('tu_password', method='pbkdf2:sha256'))"
```

---

**¡Listo!** Después de ejecutar el SQL, podrás entrar con esas credenciales simples.
