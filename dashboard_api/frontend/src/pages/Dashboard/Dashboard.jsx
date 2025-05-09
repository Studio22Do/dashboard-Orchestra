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
  Settings
} from '@mui/icons-material';
import AppDetailDrawer from '../../components/AppDetailDrawer/AppDetailDrawer';
import AppSearchHeader from '../../components/app-search/AppSearchHeader';

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  overflowX: 'hidden', // Prevenir scroll horizontal
  maxWidth: '100%', // Asegurar que no exceda el ancho de la ventana
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          onClick: () => navigate('/apps/trends')
        },
        {
          id: 'google-paid-search',
          title: 'Google Paid Search API',
          icon: MonetizationOn,
          onClick: () => navigate('/apps/paid-search')
        },
        {
          id: 'instagram-realtime',
          title: 'Instagram Realtime API',
          icon: AlternateEmail,
          onClick: () => navigate('/instagram-realtime')
        },
        {
          id: 'scraptik',
          title: 'TikTok API',
          icon: Videocam,
          onClick: () => navigate('/tiktok')
        },
        // Añade más herramientas aquí
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
          onClick: () => navigate('/youtube-media')
        },
        {
          id: 'file-converter',
          title: 'All-in-One File Converter',
          icon: Transform,
          onClick: () => navigate('/file-converter')
        },
        {
          id: 'midjourney',
          title: 'Midjourney Best Experience',
          icon: Image,
          onClick: () => navigate('/apps/midjourney-experience')
        },
        {
          id: 'word-count',
          title: 'Word Count',
          icon: Description,
          onClick: () => navigate('/apps/word-count')
        },
        {
          id: 'pdf-to-text',
          title: 'PDF to Text Converter',
          icon: PictureAsPdf,
          onClick: () => navigate('/apps/pdf-to-text')
        },
        {
          id: 'snap-video',
          title: 'Snap Video',
          icon: Videocam,
          onClick: () => navigate('/apps/snap-video')
        },
        {
          id: 'gerwin-ai',
          title: 'Gerwin AI Beta',
          icon: Architecture,
          onClick: () => navigate('/apps/gerwin-ai-beta')
        },
        {
          id: 'openai-tts',
          title: 'OpenAI Text to Speech',
          icon: Mic,
          onClick: () => navigate('/apps/openai-text-to-speech')
        },
        {
          id: 'genie-ai',
          title: 'GenieAI - ChatGPT-3 Model',
          icon: ChatBubble,
          onClick: () => navigate('/apps/genieai-chatgpt3')
        },
        {
          id: 'ai-social-media',
          title: 'AI Social Media Content Generator',
          icon: Instagram,
          onClick: () => navigate('/apps/ai-social-media-content-generator')
        },
        {
          id: 'image-manipulation',
          title: 'Advanced Image Manipulation API',
          icon: Transform,
          onClick: () => navigate('/apps/advanced-image-manipulation')
        },
        {
          id: 'whisper-url',
          title: 'Whisper: From URL',
          icon: AudioFile,
          onClick: () => navigate('/apps/whisper-from-url')
        },
        {
          id: 'runwayml',
          title: 'RunwayML',
          icon: Cloud,
          onClick: () => navigate('/apps/runwayml')
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
          onClick: () => navigate('/apps/seo-analyzer')
        },
        {
          id: 'similar-web',
          title: 'Similar Web Insights',
          icon: Insights,
          onClick: () => navigate('/apps/similar-web-insights')
        },
        {
          id: 'google-keyword',
          title: 'Google Keyword Insights',
          icon: Search,
          onClick: () => navigate('/apps/google-keyword-insights')
        },
        {
          id: 'domain-metrics',
          title: 'Domain Metrics Check',
          icon: DomainVerification,
          onClick: () => navigate('/apps/domain-metrics-check')
        },
        {
          id: 'ahrefs-checker',
          title: 'Ahrefs DR & Rank Checker',
          icon: Assessment,
          onClick: () => navigate('/apps/ahrefs-checker')
        },
        {
          id: 'page-speed',
          title: 'Page Speed Insights',
          icon: Speed,
          onClick: () => navigate('/apps/page-speed-insights')
        },
        {
          id: 'ecommerce-description',
          title: 'AI eCommerce Product Description Generator',
          icon: ShoppingCart,
          onClick: () => navigate('/apps/ecommerce-description-generator')
        },
        {
          id: 'ssl-checker',
          title: 'SSL Checker',
          icon: Https,
          onClick: () => navigate('/apps/ssl-checker')
        },
        {
          id: 'website-status',
          title: 'Check if WEBSITE is UP or DOWN',
          icon: Public,
          onClick: () => navigate('/apps/website-status-checker')
        },
        {
          id: 'url-shortener',
          title: 'URL Link Shortener and QR Code Generator',
          icon: Link,
          onClick: () => navigate('/apps/url-shortener')
        },
        {
          id: 'seo-mastermind',
          title: 'SEO Mastermind – AI Keyword, Meta & Title Generator',
          icon: Settings,
          onClick: () => navigate('/apps/seo-mastermind')
        }
      ]
    }
  ];

  return (
    <DashboardContainer>
      <AppSearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Box sx={{ mb: 4, width: '100%', overflowX: 'hidden' }}>
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.title}
            icon={category.icon}
            tools={category.tools}
            onViewAll={() => {
              // Navegar a la vista de apps con filtro preseleccionado
              const categoryPath = category.id === 'social-listening' ? 'Social Media' :
                                 category.id === 'ux-ui' ? 'Creative & Content' :
                                 category.id === 'web-seo' ? 'Web & SEO' : '';
              
              navigate('/apps', { state: { preselectedCategory: categoryPath } });
            }}
          />
        ))}
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