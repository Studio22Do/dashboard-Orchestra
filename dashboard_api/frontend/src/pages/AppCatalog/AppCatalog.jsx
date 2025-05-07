import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Box, 
  Tabs, 
  Tab,
  Divider,
  Button
} from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import AppCard from '../../components/AppCard/AppCard';

// Datos de ejemplo para las apps - ahora solo incluimos las categorías que nos interesan
const APPS_DATA = [
  // Social Media
  {
    id: 'instagram-stats',
    title: 'Instagram Statistics',
    description: 'Analiza perfiles de Instagram, obtén estadísticas y monitorea crecimiento',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
    category: 'Social Media',
    route: '/apps/instagram',
    apiName: 'Instagram Statistics API'
  },
  {
    id: 'instagram-realtime',
    title: 'Instagram Realtime API',
    description: 'Monitoreo en tiempo real de perfiles, hashtags y contenido en Instagram',
    imageUrl: 'https://via.placeholder.com/400?text=Instagram+Realtime',
    category: 'Social Media',
    route: '/instagram-realtime',
    apiName: 'Instagram Realtime API'
  },
  {
    id: 'tiktok-api',
    title: 'TikTok API',
    description: 'Accede a datos y contenido de TikTok para análisis y monitoreo',
    imageUrl: 'https://via.placeholder.com/400?text=TikTok+API',
    category: 'Social Media',
    route: '/tiktok',
    apiName: 'TikTok API'
  },
  {
    id: 'google-trends',
    title: 'Google Trends',
    description: 'Analiza tendencias de búsqueda y temas populares en Google',
    imageUrl: 'https://via.placeholder.com/400?text=Google+Trends',
    category: 'Social Media',
    route: '/apps/trends',
    apiName: 'Google Trends API'
  },
  {
    id: 'google-paid-search',
    title: 'Google Paid Search API',
    description: 'Monitorea campañas y anuncios pagados en el buscador de Google',
    imageUrl: 'https://via.placeholder.com/400?text=Paid+Search',
    category: 'Social Media',
    route: '/apps/paid-search',
    apiName: 'Google Ads API'
  },
  
  // Creative & Content
  {
    id: 'youtube-media-downloader',
    title: 'YouTube Media Downloader',
    description: 'Busca, explora y descarga medios de YouTube de manera sencilla',
    imageUrl: 'https://via.placeholder.com/400?text=YouTube+Downloader',
    category: 'Creative & Content',
    route: '/youtube-media',
    apiName: 'YouTube Data API'
  },
  {
    id: 'all-in-one-file-converter',
    title: 'All in One File Converter',
    description: 'Convierte fácilmente documentos, imágenes, audio y video en múltiples formatos',
    imageUrl: 'https://via.placeholder.com/400?text=File+Converter',
    category: 'Creative & Content',
    route: '/file-converter',
    apiName: 'File Conversion API'
  },
  {
    id: 'midjourney-experience',
    title: 'Midjourney Best Experience',
    description: 'Genera imágenes sorprendentes con la mejor experiencia de Midjourney',
    imageUrl: 'https://via.placeholder.com/400?text=Midjourney',
    category: 'Creative & Content',
    route: '/apps/midjourney-experience',
    apiName: 'Midjourney API'
  },
  {
    id: 'word-count',
    title: 'Word Count',
    description: 'Cuenta palabras y caracteres de cualquier texto rápidamente',
    imageUrl: 'https://via.placeholder.com/400?text=Word+Count',
    category: 'Creative & Content',
    route: '/apps/word-count',
    apiName: 'Text Utilities API'
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text Converter',
    description: 'Extrae texto de archivos PDF de forma rápida y precisa',
    imageUrl: 'https://via.placeholder.com/400?text=PDF+to+Text',
    category: 'Creative & Content',
    route: '/apps/pdf-to-text',
    apiName: 'PDF Extraction API'
  },
  {
    id: 'snap-video',
    title: 'Snap Video',
    description: 'Recorta y transforma videos para compartir en redes sociales',
    imageUrl: 'https://via.placeholder.com/400?text=Snap+Video',
    category: 'Creative & Content',
    route: '/apps/snap-video',
    apiName: 'Video Processing API'
  },
  {
    id: 'gerwin-ai-beta',
    title: 'Gerwin AI Beta',
    description: 'Prueba las capacidades de Gerwin AI en generación de contenido',
    imageUrl: 'https://via.placeholder.com/400?text=Gerwin+AI',
    category: 'Creative & Content',
    route: '/apps/gerwin-ai-beta',
    apiName: 'Gerwin AI API'
  },
  {
    id: 'openai-text-to-speech',
    title: 'OpenAI Text to Speech',
    description: 'Convierte texto en voz natural con OpenAI',
    imageUrl: 'https://via.placeholder.com/400?text=Text+to+Speech',
    category: 'Creative & Content',
    route: '/apps/openai-text-to-speech',
    apiName: 'OpenAI TTS API'
  },
  {
    id: 'genieai-chatgpt3',
    title: 'GenieAI - ChatGPT-3 Model',
    description: 'Genera texto conversacional usando el modelo GPT-3 de OpenAI',
    imageUrl: 'https://via.placeholder.com/400?text=GenieAI+ChatGPT3',
    category: 'Creative & Content',
    route: '/apps/genieai-chatgpt3',
    apiName: 'OpenAI GPT-3 API'
  },
  {
    id: 'ai-social-media-content-generator',
    title: 'AI Social Media Content Generator',
    description: 'Crea contenido viral para redes sociales con IA',
    imageUrl: 'https://via.placeholder.com/400?text=Viral+Content',
    category: 'Creative & Content',
    route: '/apps/ai-social-media-content-generator',
    apiName: 'Social Media Content API'
  },
  {
    id: 'advanced-image-manipulation',
    title: 'Advanced Image Manipulation API',
    description: 'Aplica filtros, redimensiona y edita imágenes con IA avanzada',
    imageUrl: 'https://via.placeholder.com/400?text=Image+Manipulation',
    category: 'Creative & Content',
    route: '/apps/advanced-image-manipulation',
    apiName: 'Image Manipulation API'
  },
  {
    id: 'whisper-from-url',
    title: 'Whisper: From URL',
    description: 'Transcribe audio desde una URL usando Whisper de OpenAI',
    imageUrl: 'https://via.placeholder.com/400?text=Whisper+URL',
    category: 'Creative & Content',
    route: '/apps/whisper-from-url',
    apiName: 'OpenAI Whisper API'
  },
  {
    id: 'runwayml',
    title: 'RunwayML',
    description: 'Experimenta con modelos de IA creativa en RunwayML',
    imageUrl: 'https://via.placeholder.com/400?text=RunwayML',
    category: 'Creative & Content',
    route: '/apps/runwayml',
    apiName: 'RunwayML API'
  },
  
  // Web & SEO
  {
    id: 'seo-analyzer',
    title: 'SEO Analyzer',
    description: 'Analiza y optimiza el SEO de tu sitio web con recomendaciones completas',
    imageUrl: 'https://via.placeholder.com/400?text=SEO+Analyzer',
    category: 'Web & SEO',
    route: '/apps/seo-analyzer',
    apiName: 'SEO Analysis API'
  },
  {
    id: 'similar-web-insights',
    title: 'Similar Web Insights',
    description: 'Obtén datos de tráfico y comportamiento de cualquier sitio web',
    imageUrl: 'https://via.placeholder.com/400?text=Similar+Web',
    category: 'Web & SEO',
    route: '/apps/similar-web-insights',
    apiName: 'SimilarWeb API'
  },
  {
    id: 'google-keyword-insights',
    title: 'Google Keyword Insights',
    description: 'Descubre las mejores palabras clave para tu estrategia de contenido',
    imageUrl: 'https://via.placeholder.com/400?text=Keyword+Insights',
    category: 'Web & SEO',
    route: '/apps/google-keyword-insights',
    apiName: 'Google Keyword API'
  },
  {
    id: 'domain-metrics-check',
    title: 'Domain Metrics Check',
    description: 'Verifica métricas clave de dominio como autoridad, backlinks y más',
    imageUrl: 'https://via.placeholder.com/400?text=Domain+Metrics',
    category: 'Web & SEO',
    route: '/apps/domain-metrics-check',
    apiName: 'Domain Authority API'
  },
  {
    id: 'ahrefs-checker',
    title: 'Ahrefs DR & Rank Checker',
    description: 'Comprueba el Domain Rating y posición de dominios según Ahrefs',
    imageUrl: 'https://via.placeholder.com/400?text=Ahrefs+Checker',
    category: 'Web & SEO',
    route: '/apps/ahrefs-checker',
    apiName: 'Ahrefs API'
  },
  {
    id: 'page-speed-insights',
    title: 'Page Speed Insights',
    description: 'Analiza y mejora la velocidad de carga de tus páginas web',
    imageUrl: 'https://via.placeholder.com/400?text=Page+Speed',
    category: 'Web & SEO',
    route: '/apps/page-speed-insights',
    apiName: 'Google PageSpeed API'
  },
  {
    id: 'ecommerce-description-generator',
    title: 'AI eCommerce Product Description Generator',
    description: 'Crea descripciones de productos optimizadas para SEO con IA',
    imageUrl: 'https://via.placeholder.com/400?text=Product+Description',
    category: 'Web & SEO',
    route: '/apps/ecommerce-description-generator',
    apiName: 'AI Content Generation API'
  },
  {
    id: 'ssl-checker',
    title: 'SSL Checker',
    description: 'Verifica la seguridad y validez de certificados SSL en cualquier dominio',
    imageUrl: 'https://via.placeholder.com/400?text=SSL+Checker',
    category: 'Web & SEO',
    route: '/apps/ssl-checker',
    apiName: 'SSL Verification API'
  },
  {
    id: 'website-status-checker',
    title: 'Check if WEBSITE is UP or DOWN',
    description: 'Monitorea la disponibilidad de cualquier sitio web en tiempo real',
    imageUrl: 'https://via.placeholder.com/400?text=Website+Status',
    category: 'Web & SEO',
    route: '/apps/website-status-checker',
    apiName: 'Website Status API'
  },
  {
    id: 'url-shortener',
    title: 'URL Link Shortener and QR Code Generator',
    description: 'Acorta URLs y genera códigos QR personalizables en segundos',
    imageUrl: 'https://via.placeholder.com/400?text=URL+Shortener',
    category: 'Web & SEO',
    route: '/apps/url-shortener',
    apiName: 'URL Shortener API'
  },
  {
    id: 'seo-mastermind',
    title: 'SEO Mastermind – AI Keyword, Meta & Title Generator',
    description: 'Genera metaetiquetas y títulos optimizados para SEO con IA',
    imageUrl: 'https://via.placeholder.com/400?text=SEO+Mastermind',
    category: 'Web & SEO',
    route: '/apps/seo-mastermind',
    apiName: 'SEO Generation API'
  }
];

// Categorías que manejamos
const CATEGORIES = ['Social Media', 'Creative & Content', 'Web & SEO'];

const AppCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Verificar si hay una categoría preseleccionada (desde Dashboard)
  useEffect(() => {
    const preselectedCategory = location.state?.preselectedCategory;
    if (preselectedCategory && CATEGORIES.includes(preselectedCategory)) {
      setActiveCategory(preselectedCategory);
    } else {
      // Si no hay categoría preseleccionada, mostrar la primera por defecto
      setActiveCategory(CATEGORIES[0]);
    }
  }, [location.state]);

  // Filtrar apps según búsqueda y categoría actual
  const filteredApps = APPS_DATA.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = app.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {activeCategory}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Explora nuestra colección de herramientas para {activeCategory.toLowerCase()}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar herramientas..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Tabs 
          value={activeCategory}
          onChange={(_, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {CATEGORIES.map(category => (
            <Tab 
              key={category} 
              label={category} 
              value={category} 
              sx={{ 
                textTransform: 'none',
                fontWeight: activeCategory === category ? 'bold' : 'normal'
              }} 
            />
          ))}
        </Tabs>
        
        <Divider />
      </Box>

      <Grid container spacing={3}>
        {filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <Grid item key={app.id} xs={12} sm={6} md={4}>
              <AppCard {...app} />
            </Grid>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron herramientas que coincidan con tu búsqueda.
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default AppCatalog; 