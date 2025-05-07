import requests
import os
import sys
from config import get_config

# Obtener la clave de la API
config = get_config()
RAPIDAPI_KEY = config().RAPIDAPI_KEY

def test_ping():
    """Test the ping endpoint"""
    try:
        print("Testing ping endpoint...")
        response = requests.get("http://localhost:5000/api/file-converter/ping")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_direct_api_conversion(input_file_path, from_format, to_format):
    """Test direct conversion using RapidAPI"""
    if not os.path.exists(input_file_path):
        print(f"Error: File {input_file_path} not found")
        return False
    
    try:
        print(f"Testing direct conversion from {from_format} to {to_format}...")
        
        # Configurar API
        api_url = f"https://all-in-one-file-converter.p.rapidapi.com/api/{from_format}-to-{to_format}"
        
        # Configurar headers
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "all-in-one-file-converter.p.rapidapi.com"
        }
        
        # Preparar el archivo
        with open(input_file_path, 'rb') as f:
            files = {"file": (os.path.basename(input_file_path), f.read())}
        
        print(f"URL: {api_url}")
        print(f"Headers: {headers}")
        print(f"File: {input_file_path}")
        
        # Hacer solicitud a la API
        response = requests.post(api_url, files=files, headers=headers)
        
        print(f"Status: {response.status_code}")
        
        # Verificar respuesta
        if response.status_code != 200:
            print(f"Error: {response.text}")
            return False
        
        # Guardar el archivo convertido
        output_file_path = os.path.splitext(input_file_path)[0] + f".{to_format}"
        with open(output_file_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Converted file saved to {output_file_path}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_endpoint_conversion(input_file_path, target_format):
    """Test conversion using the Flask endpoint"""
    if not os.path.exists(input_file_path):
        print(f"Error: File {input_file_path} not found")
        return False
    
    try:
        print(f"Testing endpoint conversion to {target_format}...")
        
        # Preparar el archivo
        with open(input_file_path, 'rb') as f:
            files = {"file": (os.path.basename(input_file_path), f.read())}
        
        data = {"target_format": target_format}
        
        # Hacer solicitud al endpoint
        response = requests.post(
            "http://localhost:5000/api/file-converter/image-convert", 
            files=files, 
            data=data
        )
        
        print(f"Status: {response.status_code}")
        
        # Verificar respuesta
        if response.status_code != 200:
            print(f"Error: {response.text}")
            return False
        
        # Guardar el archivo convertido
        output_file_path = os.path.splitext(input_file_path)[0] + f"_converted.{target_format}"
        with open(output_file_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Converted file saved to {output_file_path}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_supported_formats(input_format):
    """Test the supported formats endpoint"""
    try:
        print(f"Testing supported formats for {input_format}...")
        response = requests.get(
            f"http://localhost:5000/api/file-converter/supported-formats?input={input_format}"
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python test_image_conversion.py <command> [arguments]")
        print("Commands:")
        print("  ping - Test the ping endpoint")
        print("  direct <input_file_path> <from_format> <to_format> - Test direct conversion")
        print("  endpoint <input_file_path> <to_format> - Test endpoint conversion")
        print("  formats <input_format> - Test supported formats")
        return
    
    command = sys.argv[1]
    
    if command == "ping":
        test_ping()
    elif command == "direct" and len(sys.argv) >= 5:
        test_direct_api_conversion(sys.argv[2], sys.argv[3], sys.argv[4])
    elif command == "endpoint" and len(sys.argv) >= 4:
        test_endpoint_conversion(sys.argv[2], sys.argv[3])
    elif command == "formats" and len(sys.argv) >= 3:
        test_supported_formats(sys.argv[2])
    else:
        print("Invalid command or arguments")

if __name__ == "__main__":
    main() 