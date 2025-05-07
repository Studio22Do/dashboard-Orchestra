#!/usr/bin/env python3
"""
Script para verificar las rutas registradas en la aplicación Flask.
Se enfoca especialmente en las rutas de crypto para depurar el error 404.
"""

import os
import sys
from app import app

def check_routes():
    """Verifica las rutas registradas en la aplicación."""
    print("\n===== COMPROBANDO RUTAS DE LA APLICACIÓN =====")
    
    # Obtener todas las rutas
    all_routes = []
    for rule in app.url_map.iter_rules():
        route_info = {
            'endpoint': rule.endpoint,
            'methods': ', '.join(rule.methods),
            'route': rule.rule
        }
        all_routes.append(route_info)
    
    # Ordenar rutas por endpoint
    all_routes.sort(key=lambda x: x['endpoint'])
    
    # Filtrar rutas de crypto
    crypto_routes = [r for r in all_routes if 'crypto' in r['endpoint']]
    
    # Mostrar estadísticas
    print(f"Total de rutas registradas: {len(all_routes)}")
    print(f"Rutas de crypto: {len(crypto_routes)}")
    
    # Mostrar rutas de crypto
    if crypto_routes:
        print("\n----- RUTAS DE CRYPTO ENCONTRADAS -----")
        for i, route in enumerate(crypto_routes, 1):
            print(f"{i}. {route['endpoint']} -> {route['route']} [{route['methods']}]")
    else:
        print("\n¡ALERTA! No se encontraron rutas relacionadas con crypto")
        print("Esto podría indicar que el blueprint de crypto no se registró correctamente.")
    
    # Mostrar información de los módulos importados
    print("\n----- VERIFICANDO MÓDULOS IMPORTADOS -----")
    
    # Buscar blueprints en el espacio de nombres
    blueprints = []
    for var_name in dir(app):
        if var_name.endswith('_bp') or var_name.endswith('_blueprint'):
            blueprints.append(var_name)
    
    if blueprints:
        print(f"Blueprints encontrados en el espacio de nombres: {', '.join(blueprints)}")
    else:
        print("No se encontraron blueprints en el espacio de nombres.")
    
    # Verificar si hay múltiples registros del mismo blueprint
    print("\n----- VERIFICANDO REGISTROS DUPLICADOS -----")
    endpoints = {}
    for route in all_routes:
        endpoint_name = route['endpoint'].split('.')[0] if '.' in route['endpoint'] else route['endpoint']
        if endpoint_name not in endpoints:
            endpoints[endpoint_name] = []
        endpoints[endpoint_name].append(route['route'])
    
    # Mostrar endpoints con rutas que podrían estar duplicadas
    for endpoint, routes in endpoints.items():
        if len(routes) > 1:
            # Solo reportar si realmente parecen ser duplicados (mismo patrón de ruta)
            unique_route_patterns = set(r.rsplit('/', 1)[0] if '/' in r else r for r in routes)
            if len(unique_route_patterns) < len(routes):
                print(f"Posible duplicado: {endpoint} tiene {len(routes)} rutas:")
                for route in routes:
                    print(f"  - {route}")
    
    print("\n===== FIN DE COMPROBACIÓN DE RUTAS =====")

if __name__ == "__main__":
    check_routes() 