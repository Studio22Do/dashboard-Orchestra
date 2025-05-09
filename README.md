# Dashboard Orchestra

## Descripción
Dashboard Orchestra es una plataforma integral para análisis y gestión de datos de redes sociales y marketing digital. La plataforma está diseñada con una arquitectura de microservicios que proporciona una colección de herramientas especializadas para el monitoreo y análisis de redes sociales, SEO, tendencias y más.

## Estructura del Proyecto
```
dashboard-Orchestra/
│
├── dashboard_api/               # Directorio principal del proyecto
│   ├── backend/                 # Servicio backend en Flask
│   │   ├── api/                 # Módulos de API
│   │   │   ├── models/          # Modelos de base de datos
│   │   │   ├── routes/          # Rutas de API
│   │   │   └── utils/           # Utilidades y helpers
│   │   ├── blueprints/          # Blueprints de Flask
│   │   ├── utils/               # Utilidades generales
│   │   ├── app.py               # Aplicación principal Flask
│   │   ├── config.py            # Configuraciones
│   │   ├── requirements.txt     # Dependencias de Python
│   │   └── run.py               # Script de ejecución
│   │
│   └── frontend/                # Aplicación frontend en React
│       ├── public/              # Archivos estáticos públicos
│       ├── src/                 # Código fuente React
│       │   ├── components/      # Componentes reutilizables
│       │   ├── pages/           # Páginas de la aplicación
│       │   ├── redux/           # Estado global con Redux
│       │   ├── App.jsx          # Componente principal
│       │   └── index.jsx        # Punto de entrada
│       ├── package.json         # Dependencias y scripts
│       └── README.md            # Documentación del frontend
```

## Características Implementadas

### Social Listening
- Instagram Statistics API ✅
- Google Trends ✅
- Google Paid Search API ✅
- Instagram Realtime API ✅
- ScrapTik ✅

### Creative & Content
- YouTube Media Downloader ✅
- All in One File Converter ✅
- Midjourney Best Experience ✅
- Word Count ✅
- PDF to Text Converter ✅
- Snap Video ✅
- Gerwin AI Beta ✅
- OpenAI Text to Speech ✅
- GenieAI - ChatGPT-3 Model ✅
- AI Social Media Content Generator ✅
- Advanced Image Manipulation API ✅
- Whisper: From URL ✅
- RunwayML ✅

### Web & SEO
- SEO Analyzer ✅
- Similar Web Insights ✅
- Google Keyword Insights ✅
- Domain Metrics Check ✅
- Ahrefs DR & Rank Checker ✅
- Page Speed Insights ✅
- AI eCommerce Product Description Generator ✅
- SSL Checker ✅
- Check if WEBSITE is UP or DOWN ✅
- URL Link Shortener and QR Code Generator ✅
- SEO Mastermind – AI Keyword, Meta & Title Generator ✅

## Requisitos

- Python 3.8+
- Node.js 18+
- npm o yarn
- Redis (opcional, para caché)
- Variables de entorno configuradas

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/dashboard-Orchestra.git
cd dashboard-Orchestra
```

2. Configurar el backend:
```bash
cd dashboard_api/backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configurar el frontend:
```bash
cd dashboard_api/frontend
npm install
```

4. Configurar variables de entorno:
- Crear archivo `.env` en el directorio backend
- Crear archivo `.env` en el directorio frontend

## Ejecución

1. Iniciar el backend:
```bash
cd dashboard_api/backend
python run.py
```

2. Iniciar el frontend:
```bash
cd dashboard_api/frontend
npm start
```

## Documentación Detallada
Para más información sobre la configuración, uso y desarrollo, consulta el archivo [documentation.md](documentation.md).

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles. 
