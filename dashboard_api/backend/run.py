import os
from app import app
import sys

print("\n===== INICIANDO APLICACIÓN DASHBOARD API =====")
print(f"Python version: {sys.version}")
print(f"Ruta de ejecución: {os.getcwd()}")
print(f"Directorio de trabajo: {os.path.dirname(os.path.abspath(__file__))}")
print(f"Config DEBUG: {app.config.get('DEBUG', False)}")
print(f"FLASK_ENV: {os.environ.get('FLASK_ENV', 'No definido')}")
print(f"FLASK_DEBUG: {os.environ.get('FLASK_DEBUG', 'No definido')}")

print("\nRutas disponibles en la aplicación:")
crypto_routes = []
for rule in app.url_map.iter_rules():
    print(f"  {rule.endpoint} -> {rule.rule} [{', '.join(rule.methods)}]")
    if 'crypto' in rule.endpoint:
        crypto_routes.append(rule)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\nIniciando servidor en: http://0.0.0.0:{port}")
    print("===== APLICACIÓN INICIADA =====\n")
    app.run(
        host='0.0.0.0', 
        port=port, 
        debug=app.config.get('DEBUG', False)
    ) 