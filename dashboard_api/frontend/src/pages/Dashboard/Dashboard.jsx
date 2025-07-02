import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../../components/CategorySection/CategorySection';
import { 
  Search, // Social Listening icon
  Palette, // UX/UI icon
  Language, // Web icon
  Instagram,
  TrendingUp,
  YouTube,
  Description,
  Speed,
  Analytics,
  MonetizationOn,
  AlternateEmail,
  Videocam,
  Transform,
  PictureAsPdf,
  AudioFile,
  Image,
  Mic,
  Code,
  ChatBubble,
  Architecture,
  Cloud,
  Assessment,
  Insights,
  Summarize,
  Storage,
  BarChart,
  Https,
  Public,
  Link,
  DomainVerification,
  ShoppingCart,
  Visibility,
  Settings,
  PhotoCamera,
  Psychology
} from '@mui/icons-material';
import AppDetailDrawer from '../../components/AppDetailDrawer/AppDetailDrawer';
import AppSearchHeader from '../../components/app-search/AppSearchHeader';
const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: theme.spacing(4),
  overflowX: 'visible', // Prevenir scroll horizontal
  maxWidth: '100%', // Asegurar que no exceda el ancho de la ventana
  
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Definición de las herramientas por categoría
  const categories = [
    {
      id: 'social-listening',
      title: 'Social Listening',
      icon: Search,
      tools: [
        {
          id: 'instagram-stats',
          title: 'Instagram Statistics API',
          icon: Instagram,
          onClick: () => {
            setSelectedApp({
              id: 'instagram-stats',
              title: 'Instagram Statistics',
              description: 'Analiza perfiles de Instagram, obtén estadísticas y monitorea crecimiento',
              imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
              category: 'Social Media',
              route: '/apps/instagram',
              apiName: 'Instagram Statistics API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'google-trends',
          title: 'Google Trends',
          icon: TrendingUp,
          onClick: () => {
            setSelectedApp({
              id: 'google-trends',
              title: 'Google Trends',
              description: 'Analiza tendencias de búsqueda en Google, explora datos de popularidad y patrones de búsqueda',
              imageUrl: 'https://cdn.pixabay.com/photo/2015/11/03/09/03/google-1018443_960_720.jpg',
              category: 'Social Listening',
              route: '/apps/trends',
              apiName: 'Google Trends API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'google-paid-search',
          title: 'Google Paid Search API',
          icon: MonetizationOn,
          onClick: () => {
            setSelectedApp({
              id: 'google-paid-search',
              title: 'Google Paid Search',
              description: 'Analiza y optimiza tus campañas de búsqueda de pago en Google Ads',
              imageUrl: 'https://cdn.pixabay.com/photo/2015/11/03/09/03/google-1018443_960_720.jpg',
              category: 'Social Listening',
              route: '/apps/paid-search',
              apiName: 'Google Paid Search API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'instagram-realtime',
          title: 'Instagram Realtime API',
          icon: AlternateEmail,
          onClick: () => {
            setSelectedApp({
              id: 'instagram-realtime',
              title: 'Instagram Realtime',
              description: 'Monitorea en tiempo real la actividad de Instagram, hashtags y menciones',
              imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
              category: 'Social Listening',
              route: '/instagram-realtime',
              apiName: 'Instagram Realtime API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'scraptik',
          title: 'TikTok API',
          icon: Videocam,
          onClick: () => {
            setSelectedApp({
              id: 'scraptik',
              title: 'TikTok Analytics',
              description: 'Analiza tendencias, hashtags y contenido viral en TikTok',
              imageUrl: 'https://cdn.pixabay.com/photo/2021/06/15/12/14/tik-tok-6338431_960_720.jpg',
              category: 'Social Listening',
              route: '/tiktok',
              apiName: 'TikTok API',
            });
            setDrawerOpen(true);
          }
        }
      ]
    },
    {
      id: 'ux-ui',
      title: 'Creative & Content',
      icon: Palette,
      tools: [
        {
          id: 'youtube-downloader',
          title: 'YouTube Media Downloader',
          icon: YouTube,
          onClick: () => {
            setSelectedApp({
              id: 'youtube-downloader',
              title: 'YouTube Media Downloader',
              description: 'Descarga videos y audio de YouTube en diferentes formatos y calidades',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/10/03/19/youtube-2625192_960_720.jpg',
              category: 'Creative & Content',
              route: '/youtube-media',
              apiName: 'YouTube Media API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'file-converter',
          title: 'All-in-One File Converter',
          icon: Transform,
          onClick: () => {
            setSelectedApp({
              id: 'file-converter',
              title: 'File Converter',
              description: 'Convierte archivos entre diferentes formatos de manera rápida y eficiente',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/file-converter',
              apiName: 'File Converter API',
            });
            setDrawerOpen(true);
          }
        },

        {
          id: 'word-count',
          title: 'Word Count',
          icon: Description,
          onClick: () => {
            setSelectedApp({
              id: 'word-count',
              title: 'Word Count',
              description: 'Analiza y cuenta palabras, caracteres y párrafos en tus textos',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/word-count',
              apiName: 'Word Count API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'pdf-to-text',
          title: 'PDF to Text Converter',
          icon: PictureAsPdf,
          onClick: () => {
            setSelectedApp({
              id: 'pdf-to-text',
              title: 'PDF to Text',
              description: 'Convierte documentos PDF a texto editable',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/pdf-to-text',
              apiName: 'PDF to Text API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'snap-video',
          title: 'Snap Video',
          icon: Videocam,
          onClick: () => {
            setSelectedApp({
              id: 'snap-video',
              title: 'Snap Video',
              description: 'Crea y edita videos cortos con efectos y filtros',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/snap-video',
              apiName: 'Snap Video API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ai-humanizer',
          title: 'AI Humanizer API',
          icon: Architecture,
          onClick: () => {
            setSelectedApp({
              id: 'ai-humanizer',
              title: 'AI Humanizer',
              description: 'Plataforma de IA avanzada para análisis y generación de contenido',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/ai-humanizer',
              apiName: 'AI Humanizer API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'openai-tts',
          title: 'OpenAI Text to Speech',
          icon: Mic,
          onClick: () => {
            setSelectedApp({
              id: 'openai-tts',
              title: 'OpenAI TTS',
              description: 'Convierte texto a voz natural usando la tecnología de OpenAI',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/openai-text-to-speech',
              apiName: 'OpenAI TTS API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'genie-ai',
          title: 'GenieAI - ChatGPT-3 Model',
          icon: ChatBubble,
          onClick: () => {
            setSelectedApp({
              id: 'genie-ai',
              title: 'GenieAI',
              description: 'Asistente de IA basado en ChatGPT-3 para diversas tareas',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/genie-ai',
              apiName: 'GenieAI API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ai-social-media',
          title: 'AI Social Media Content Generator',
          icon: Instagram,
          onClick: () => {
            setSelectedApp({
              id: 'ai-social-media',
              title: 'AI Social Media',
              description: 'Genera contenido optimizado para redes sociales usando IA',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/ai-social-media',
              apiName: 'AI Social Media API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'image-manipulation',
          title: 'Advanced Image Manipulation API',
          icon: Transform,
          onClick: () => {
            setSelectedApp({
              id: 'image-manipulation',
              title: 'Image Manipulation',
              description: 'Herramientas avanzadas para edición y manipulación de imágenes',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/advanced-image',
              apiName: 'Image Manipulation API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'whisper-url',
          title: 'Whisper: From URL',
          icon: AudioFile,
          onClick: () => {
            setSelectedApp({
              id: 'whisper-url',
              title: 'Whisper URL',
              description: 'Transcribe audio desde URLs usando el modelo Whisper',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/whisper-url',
              apiName: 'Whisper API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'runwayml',
          title: 'RunwayML',
          icon: Cloud,
          onClick: () => {
            setSelectedApp({
              id: 'runwayml',
              title: 'RunwayML',
              description: 'Plataforma de IA para generación y edición de contenido multimedia',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/apps/runway-ml',
              apiName: 'RunwayML API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'prlabs',
          title: 'PR Labs',
          icon: Psychology,
          onClick: () => {
            setSelectedApp({
              id: 'prlabs',
              title: 'PR Labs',
              description: 'Suite de herramientas de IA para generación de texto e imágenes',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Creative & Content',
              route: '/prlabs',
              apiName: 'PR Labs API',
            });
            setDrawerOpen(true);
          }
        }
      ]
    },
    {
      id: 'web-seo',
      title: 'Web & SEO',
      icon: Language,
      tools: [
        {
          id: 'seo-analyzer',
          title: 'SEO Analyzer',
          icon: Analytics,
          onClick: () => {
            setSelectedApp({
              id: 'seo-analyzer',
              title: 'SEO Analyzer',
              description: 'Analiza y optimiza el SEO de tu sitio web',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/seo-analyzer',
              apiName: 'SEO Analyzer API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'similar-web',
          title: 'Similar Web Insights',
          icon: Insights,
          onClick: () => {
            setSelectedApp({
              id: 'similar-web',
              title: 'Similar Web',
              description: 'Obtén insights detallados sobre el tráfico web y la competencia',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/similar-web',
              apiName: 'Similar Web API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'google-keyword',
          title: 'Google Keyword Insights',
          icon: Search,
          onClick: () => {
            setSelectedApp({
              id: 'google-keyword',
              title: 'Keyword Insights',
              description: 'Analiza palabras clave y tendencias de búsqueda',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/keyword-insights',
              apiName: 'Google Keyword API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'domain-metrics',
          title: 'Domain Metrics Check',
          icon: DomainVerification,
          onClick: () => {
            setSelectedApp({
              id: 'domain-metrics',
              title: 'Domain Metrics',
              description: 'Verifica métricas y salud de dominios web',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/domain-metrics',
              apiName: 'Domain Metrics API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ahrefs-checker',
          title: 'Ahrefs DR & Rank Checker',
          icon: Assessment,
          onClick: () => {
            setSelectedApp({
              id: 'ahrefs-checker',
              title: 'Ahrefs Checker',
              description: 'Verifica el Domain Rating y ranking de sitios web',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/ahrefs-rank',
              apiName: 'Ahrefs API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'page-speed',
          title: 'Page Speed Insights',
          icon: Speed,
          onClick: () => {
            setSelectedApp({
              id: 'page-speed',
              title: 'Page Speed',
              description: 'Analiza y optimiza la velocidad de carga de tu sitio web',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/page-speed',
              apiName: 'Page Speed API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ecommerce-description',
          title: 'AI eCommerce Product Description Generator',
          icon: ShoppingCart,
          onClick: () => {
            setSelectedApp({
              id: 'ecommerce-description',
              title: 'Product Description Generator',
              description: 'Genera descripciones optimizadas para productos de eCommerce',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/product-description',
              apiName: 'Product Description API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ssl-checker',
          title: 'SSL Checker',
          icon: Https,
          onClick: () => {
            setSelectedApp({
              id: 'ssl-checker',
              title: 'SSL Checker',
              description: 'Verifica el estado y validez de certificados SSL',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/ssl-checker',
              apiName: 'SSL Checker API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'website-status',
          title: 'Check if WEBSITE is UP or DOWN',
          icon: Public,
          onClick: () => {
            setSelectedApp({
              id: 'website-status',
              title: 'Website Status',
              description: 'Monitorea el estado y disponibilidad de sitios web',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/website-status',
              apiName: 'Website Status API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'url-shortener',
          title: 'URL Link Shortener and QR Code Generator',
          icon: Link,
          onClick: () => {
            setSelectedApp({
              id: 'url-shortener',
              title: 'URL Shortener',
              description: 'Acorta URLs y genera códigos QR personalizados',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/url-shortener',
              apiName: 'URL Shortener API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'seo-mastermind',
          title: 'SEO Mastermind – AI Keyword, Meta & Title Generator',
          icon: Settings,
          onClick: () => {
            setSelectedApp({
              id: 'seo-mastermind',
              title: 'SEO Mastermind',
              description: 'Genera keywords, meta tags y títulos optimizados con IA',
              imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
              category: 'Web & SEO',
              route: '/apps/seo-mastermind',
              apiName: 'SEO Mastermind API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'image-optimizer',
          title: 'Image Optimizer',
          icon: PhotoCamera,
          onClick: () => {
            setSelectedApp({
              id: 'image-optimizer',
              title: 'Image Optimizer',
              description: 'Optimiza y comprime imágenes JPEG, PNG y GIF para mejorar el rendimiento web',
              imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/19/56/image-1295100_960_720.png',
              category: 'Web & SEO',
              route: '/apps/image-optimizer',
              apiName: 'ShortPixel Image Optimiser',
            });
            setDrawerOpen(true);
          }
        }
      ]
    }
  ];

  // Filtrar apps de cada categoría según el searchQuery
  const filteredCategories = categories
    .map(category => {
      const filteredTools = category.tools.filter(tool => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          tool.title?.toLowerCase().includes(q) ||
          (tool.description && tool.description.toLowerCase().includes(q))
        );
      })
      // Asegurar que cada tool tenga las props necesarias para ToolCard
      .map(tool => {
        const mappedTool = {
          ...tool,
          title: tool.title || tool.name || 'Sin título',
          imageUrl: tool.imageUrl || tool.img || 'https://placehold.co/400x200/1a1a1a/ffffff?text=No+Image',
          icon: tool.icon || undefined,
          onClick: tool.onClick || (() => {}),
        };
        return mappedTool;
      });
      return { ...category, tools: filteredTools };
    })
    .filter(category => category.tools.length > 0);

  return (
    <DashboardContainer
      style={{ padding: "0px", margin: "0px", width: "100%" }}
      maxWidth={false}
      disableGutters
    >
      <Box sx={{ mb: 4, width: '100%', overflowX: 'hidden' }}>
        <AppSearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              title={category.title}
              icon={category.icon}
              tools={category.tools}
              onViewAll={() => {
                const categoryPath = category.id === 'social-listening' ? 'Social Media' :
                  category.id === 'ux-ui' ? 'Creative & Content' :
                  category.id === 'web-seo' ? 'Web & SEO' : '';
                navigate('/category', { state: { preselectedCategory: categoryPath } });
              }}
            />
          ))
        ) : (
          <Box sx={{ py: 8, textAlign: 'center', width: '100%' }}>
            <h2 style={{ color: '#fff', fontWeight: 700 }}>No se encontraron resultados</h2>
            <p style={{ color: '#aaa' }}>Intenta con otro término de búsqueda.</p>
          </Box>
        )}
      </Box>
      <AppDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        app={selectedApp}
      />
    </DashboardContainer>
  );
};

export default Dashboard; 