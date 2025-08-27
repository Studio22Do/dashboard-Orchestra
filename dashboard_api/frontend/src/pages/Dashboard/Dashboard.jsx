import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../../components/CategorySection/CategorySection';
// Solo iconos para categorías principales
import { 
  Search, // Social Listening icon
  Palette, // Creative & Content icon
  Language, // Web & SEO icon
} from '@mui/icons-material';
import AppDetailDrawer from '../../components/AppDetailDrawer/AppDetailDrawer';
import AppSearchHeader from '../../components/app-search/AppSearchHeader';
import picpulseicon from '../../assets/images/apps/icons/Picpulseicon.png';
import mediafyLogo from '../../assets/images/apps/icons/mediafyicon.png';
import perplexityLogo from '../../assets/images/apps/icons/perplexityicon.png';
import googleNewsLogo from '../../assets/images/apps/icons/googlenewsicon.png';

import wordCountLogo from '../../assets/images/apps/icons/wordcounticon.png';
import pdfToTextLogo from '../../assets/images/apps/icons/pdftotexticon.png';
import snapVideoLogo from '../../assets/images/apps/icons/snapvideoicon.png';
import genieAILogo from '../../assets/images/apps/icons/chatgpt4icon.png';
import aiSocialMediaLogo from '../../assets/images/apps/icons/contentcreatoricon.png';
import imageManipulationLogo from '../../assets/images/apps/icons/imagetransform-1.png';
import whisperLogo from '../../assets/images/apps/icons/whispericon.png';
import runwayMLLogo from '../../assets/images/apps/icons/runawayicon.png';
import prlabsLogo from '../../assets/images/apps/icons/chatgpt4icon.png';
import speechToTextLogo from '../../assets/images/apps/icons/speechtotexticon.png';
import qrGeneratorLogo from '../../assets/images/apps/icons/qrgeneratorcode.png';
import seoAnalyzerLogo from '../../assets/images/apps/icons/seoanalyzericon.png';
import similarWebLogo from '../../assets/images/apps/icons/similarwebicon.png';
import googleKeywordLogo from '../../assets/images/apps/icons/keywordinsightsicon.png';
import domainMetricsLogo from '../../assets/images/apps/icons/domaincheckericon.png';
import pageSpeedLogo from '../../assets/images/apps/icons/webauditicon.png';
import productDescriptionLogo from '../../assets/images/apps/icons/productdescriptionicon.png';
import sslCheckerLogo from '../../assets/images/apps/icons/SSLcheckericon.png';
import websiteStatusLogo from '../../assets/images/apps/icons/webstatusicon.png';
import seoMastermindLogo from '../../assets/images/apps/icons/keywordsearchicon.png';
import whoisLookupLogo from '../../assets/images/apps/icons/Whoisicon.png';
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
          id: 'mediafy',
          title: 'Mediafy',
          imageUrl: mediafyLogo,
          onClick: () => {
            setSelectedApp({
              id: 'mediafy',
              title: 'Mediafy',
              description: 'Análisis completo de Instagram: perfiles, posts, hashtags, usuarios y ubicaciones',
              imageUrl: mediafyLogo,
              category: 'Social Listening',
              route: '/apps/mediafy',
              apiName: 'Mediafy',
            });
            setDrawerOpen(true);
          }
        },
        {
            id: 'perplexity',
            title: 'Perplexity',
            imageUrl: perplexityLogo,
          onClick: () => {
            setSelectedApp({
              id: 'perplexity',
              title: 'Perplexity',
              description: 'Búsquedas inteligentes con IA - Análisis avanzado de Google data',
              imageUrl: perplexityLogo,
              category: 'AI & Analytics',
              route: '/apps/perplexity',
              apiName: 'Perplexity',
            });
            setDrawerOpen(true);
          }
        },

        {
          id: 'google-news',
          title: 'Google News',
          imageUrl: googleNewsLogo,
          onClick: () => {
            setSelectedApp({
              id: 'google-news',
              title: 'Google News',
              description: 'Accede a noticias en tiempo real de múltiples fuentes, categorías y países',
              imageUrl: googleNewsLogo,
              category: 'Social Listening',
              route: '/apps/google-news',
              apiName: 'Google News',
            });
            setDrawerOpen(true);
          }
        },

      ]
    },
    {
      id: 'ux-ui',
      title: 'Creative & Content',
      icon: Palette,
      tools: [
        {
          id: 'word-count',
          title: 'Word Count',
          imageUrl: wordCountLogo,
          onClick: () => {
            setSelectedApp({
              id: 'word-count',
              title: 'Word Count',
              description: 'Analiza y cuenta palabras, caracteres y párrafos en tus textos',
              imageUrl: wordCountLogo,
              category: 'Creative & Content',
              route: '/apps/word-count',
              apiName: 'Word Count API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'pdf-to-text',
          title: 'PDF to Text',
          imageUrl: pdfToTextLogo,
          onClick: () => {
            setSelectedApp({
              id: 'pdf-to-text',
              title: 'PDF to Text',
              description: 'Convierte documentos PDF a texto editable',
              imageUrl: pdfToTextLogo,
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
          imageUrl: snapVideoLogo,
          onClick: () => {
            setSelectedApp({
              id: 'snap-video',
              title: 'Snap Video',
              description: 'Crea y edita videos cortos con efectos y filtros',
              imageUrl: snapVideoLogo,
              category: 'Creative & Content',
              route: '/apps/snap-video',
              apiName: 'Snap Video API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'genie-ai',
          title: 'ChatGPT-4',
          imageUrl: genieAILogo,
          onClick: () => {
            setSelectedApp({
              id: 'genie-ai',
              title: 'GenieAI',
              description: 'Asistente de IA basado en ChatGPT-4',
              imageUrl: genieAILogo,
              category: 'Creative & Content',
              route: '/apps/genie-ai',
              apiName: 'GenieAI API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'ai-social-media',
          title: 'Content Generator',
          imageUrl: aiSocialMediaLogo,
          onClick: () => {
            setSelectedApp({
              id: 'ai-social-media',
              title: 'AI Social Media',
              description: 'Genera contenido optimizado para redes sociales usando IA',
              imageUrl: aiSocialMediaLogo,
              category: 'Creative & Content',
              route: '/apps/ai-social-media',
              apiName: 'AI Social Media API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'advanced-image',
          title: 'Image Transform',
          imageUrl: imageManipulationLogo,
          onClick: () => {
            setSelectedApp({
              id: 'advanced-image',
              title: 'Image Manipulation',
              description: 'Herramientas avanzadas para edición y manipulación de imágenes',
              imageUrl: imageManipulationLogo,
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
          imageUrl: whisperLogo,
          onClick: () => {
            setSelectedApp({
              id: 'whisper-url',
              title: 'Whisper URL',
              description: 'Transcribe audio desde URLs usando el modelo Whisper',
              imageUrl: whisperLogo,
              category: 'Creative & Content',
              route: '/apps/whisper-url',
              apiName: 'Whisper API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'runwayml',
          title: 'Runway',
          imageUrl: runwayMLLogo,
          onClick: () => {
            setSelectedApp({
              id: 'runwayml',
              title: 'Runway',
              description: 'Plataforma de IA para generación y edición de contenido multimedia',
              imageUrl: runwayMLLogo,
              category: 'Creative & Content',
              route: '/apps/runway-ml',
              apiName: 'RunwayML API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'prlabs',
          title: 'sinfonIA',
          imageUrl: prlabsLogo,
          onClick: () => {
            setSelectedApp({
              id: 'prlabs',
              title: 'sinfonIA',
              description: 'Suite de herramientas de IA para generación de texto e imágenes',
              imageUrl: prlabsLogo,
              category: 'Creative & Content',
              route: '/prlabs',
              apiName: 'sinfonIA',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'speech-to-text',
          title: 'Speech to Text ',
          imageUrl: speechToTextLogo,
          onClick: () => {
            setSelectedApp({
              id: 'speech-to-text',
              title: 'Speech to Text',
              description: 'Transcribe audio y video desde múltiples fuentes usando IA avanzada',
              imageUrl: speechToTextLogo,
              category: 'Creative & Content',
              route: '/apps/speech-to-text',
              apiName: 'Speech to Text',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'picpulse',
          title: 'PicPulse',
          imageUrl: picpulseicon,
          onClick: () => {
            setSelectedApp({
              id: 'picpulse',
              title: 'PicPulse',
              description: 'Análisis psicológico y de calidad de imágenes con IA',
              imageUrl: picpulseicon,
              category: 'Creative & Content',
              route: '/apps/picpulse',
              apiName: 'PicPulse',
            });
            setDrawerOpen(true);
          }
        },

      ]
    },
    {
      id: 'web-seo',
      title: 'Web & SEO',
      icon: Language,
      tools: [
        {
          id: 'qr-generator',
          title: 'QR Generator',
          imageUrl: qrGeneratorLogo,
          onClick: () => {
            setSelectedApp({
              id: 'qr-generator',
              title: 'QR Generator',
              description: 'Genera códigos QR personalizables (PNG/JPEG/SVG) para texto, URL, WiFi, email, SMS y más',
              imageUrl: qrGeneratorLogo,
              category: 'Web & SEO',
              route: '/apps/qr-generator',
              apiName: 'QRCode Smart Generator'
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'seo-analyzer',
          title: 'SEO Analyzer',
          imageUrl: seoAnalyzerLogo,
          onClick: () => {
            setSelectedApp({
              id: 'seo-analyzer',
              title: 'SEO Analyzer',
              description: 'Analiza y optimiza el SEO de tu sitio web',
              imageUrl: seoAnalyzerLogo,
              category: 'Web & SEO',
              route: '/apps/seo-analyzer',
              apiName: 'SEO Analyzer API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'similar-web',
          title: 'Similar Web',
          imageUrl: similarWebLogo,
          onClick: () => {
            setSelectedApp({
              id: 'similar-web',
              title: 'Similar Web',
              description: 'Obtén insights detallados sobre el tráfico web y la competencia',
              imageUrl: similarWebLogo,
              category: 'Web & SEO',
              route: '/apps/similar-web',
              apiName: 'Similar Web API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'google-keyword',
          title: 'Keyword Insights',
          imageUrl: googleKeywordLogo,
          onClick: () => {
            setSelectedApp({
              id: 'google-keyword',
              title: 'Keyword Insights',
              description: 'Analiza palabras clave y tendencias de búsqueda',
              imageUrl: googleKeywordLogo,
              category: 'Web & SEO',
              route: '/apps/keyword-insights',
              apiName: 'Google Keyword API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'domain-metrics',
          title: 'Domain Checker',
          imageUrl: domainMetricsLogo,
          onClick: () => {
            setSelectedApp({
              id: 'domain-metrics',
              title: 'Domain Metrics',
              description: 'Verifica métricas y salud de dominios web',
              imageUrl: domainMetricsLogo,
              category: 'Web & SEO',
              route: '/apps/domain-metrics',
              apiName: 'Domain Metrics API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'page-speed',
          title: 'Website Speed Test',
          imageUrl: pageSpeedLogo,
          onClick: () => {
            setSelectedApp({
              id: 'page-speed',
              title: 'Website Speed Test',
              description: 'Analiza la velocidad de carga y rendimiento de cualquier sitio web con métricas precisas',
              imageUrl: pageSpeedLogo,
              category: 'Web & SEO',
              route: '/apps/page-speed',
              apiName: 'Website Speed Test API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'product-description',
          title: 'Product Description',
          imageUrl: productDescriptionLogo,
          onClick: () => {
            setSelectedApp({
              id: 'product-description',
              title: 'Product Description',
              description: 'Genera descripciones optimizadas para productos de eCommerce',
              imageUrl: productDescriptionLogo,
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
          imageUrl: sslCheckerLogo,
          onClick: () => {
            setSelectedApp({
              id: 'ssl-checker',
              title: 'SSL Checker',
              description: 'Verifica el estado y validez de certificados SSL',
              imageUrl: sslCheckerLogo,
              category: 'Web & SEO',
              route: '/apps/ssl-checker',
              apiName: 'SSL Checker API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'website-status',
          title: ' Web Status',
          imageUrl: websiteStatusLogo,
          onClick: () => {
            setSelectedApp({
              id: 'website-status',
              title: 'Website Status',
              description: 'Monitorea el estado y disponibilidad de sitios web',
              imageUrl: websiteStatusLogo,
              category: 'Web & SEO',
              route: '/apps/website-status',
              apiName: 'Website Status API',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'seo-mastermind',
          title: 'Keyword Search',
          imageUrl: seoMastermindLogo,
          onClick: () => {
            setSelectedApp({
              id: 'seo-mastermind',
              title: 'Keyword Search',
              description: 'Genera keywords, meta tags y títulos optimizados con IA',
              imageUrl: seoMastermindLogo,
              category: 'Web & SEO',
              route: '/apps/seo-mastermind',
              apiName: 'SEO Mastermind',
            });
            setDrawerOpen(true);
          }
        },
        {
          id: 'whois-lookup',
          title: 'WHOIS',
          imageUrl: whoisLookupLogo,
          onClick: () => {
            setSelectedApp({
              id: 'whois-lookup',
              title: 'WHOIS Lookup Service',
              description: 'Consulta información detallada de registro para dominios, direcciones IP y números ASN',
              imageUrl: whoisLookupLogo,
              category: 'Web & SEO',
              route: '/apps/whois-lookup',
              apiName: 'WHOIS Lookup API',
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
                const categoryPath = category.id === 'social-listening' ? 'Social Listening' :
                  category.id === 'ux-ui' ? 'Creative & Content' :
                  category.id === 'web-seo' ? 'Web & SEO' : '';
                navigate(`/category/${category.id}`, { state: { preselectedCategory: categoryPath } });
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