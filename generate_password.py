#!/usr/bin/env python3
"""
Script para generar hashes de contraseñas para Supabase
"""
from werkzeug.security import generate_password_hash

# Contraseñas simples para los usuarios
passwords = {
    'testregister@gmail.com': '123456',
    'john.goyo@s22.do': '123456'
}

print("=" * 60)
print("HASHES DE CONTRASEÑAS PARA SUPABASE")
print("=" * 60)
print()

for email, password in passwords.items():
    hash_password = generate_password_hash(password, method='pbkdf2:sha256')
    print(f"Usuario: {email}")
    print(f"Contraseña: {password}")
    print(f"Hash: {hash_password}")
    print()
    print(f"SQL UPDATE:")
    print(f"UPDATE users SET password_hash = '{hash_password}' WHERE email = '{email}';")
    print()
    print("-" * 60)
    print()
