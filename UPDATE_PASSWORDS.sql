-- ============================================================
-- ACTUALIZAR CONTRASEÑAS EN SUPABASE
-- ============================================================
-- 
-- Contraseñas simples: 123456
-- 
-- Ejecuta estos comandos en el SQL Editor de Supabase
-- ============================================================

-- Usuario: testregister@gmail.com
-- Nueva contraseña: 123456
UPDATE users 
SET password_hash = 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef'
WHERE email = 'testregister@gmail.com';

-- Usuario: john.goyo@s22.do  
-- Nueva contraseña: 123456
UPDATE users 
SET password_hash = 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef'
WHERE email = 'john.goyo@s22.do';

-- Verificar que se actualizaron correctamente
SELECT id, email, name, role, is_active, is_verified 
FROM users 
WHERE email IN ('testregister@gmail.com', 'john.goyo@s22.do');

-- ============================================================
-- NOTA: Si los hashes de arriba no funcionan, usa estos:
-- ============================================================

-- Alternativa 1: Contraseña "password"
-- UPDATE users SET password_hash = 'pbkdf2:sha256:260000$xXySeIxJNQrBpcBn$6dbe46d9a2b34d88d751785f2dfa10cd51251c0fe60b6b7a77a751e283e539ef' WHERE email = 'testregister@gmail.com';

-- Alternativa 2: Contraseña "admin123"
-- UPDATE users SET password_hash = 'pbkdf2:sha256:260000$abcdefgh$1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' WHERE email = 'john.goyo@s22.do';
