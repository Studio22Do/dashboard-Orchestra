def test_health_endpoint(client):
    """Prueba para verificar que el endpoint de salud funciona correctamente."""
    response = client.get('/health')
    
    assert response.status_code == 200
    assert response.json.get('status') == 'online'
    assert 'version' in response.json 