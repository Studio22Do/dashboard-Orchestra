import React from 'react';
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
  Videocam
} from '@mui/icons-material';

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  overflowX: 'hidden', // Prevenir scroll horizontal
  maxWidth: '100%', // Asegurar que no exceda el ancho de la ventana
}));

const Dashboard = () => {
  const navigate = useNavigate();

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
          onClick: () => navigate('/apps/instagram')
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
          onClick: () => console.log('YouTube Downloader clicked')
        },
        {
          id: 'word-count',
          title: 'Word Count',
          icon: Description,
          onClick: () => console.log('Word Count clicked')
        },
        // Añade más herramientas aquí
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
          onClick: () => console.log('SEO Analyzer clicked')
        },
        {
          id: 'page-speed',
          title: 'Page Speed Insights',
          icon: Speed,
          onClick: () => console.log('Page Speed clicked')
        },
        // Añade más herramientas aquí
      ]
    }
  ];

  return (
    <DashboardContainer>
      <Box sx={{ mb: 4, width: '100%', overflowX: 'hidden' }}>
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.title}
            icon={category.icon}
            tools={category.tools}
          />
        ))}
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard; 