import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, IconButton, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Chat as ChatIcon,
  Image as ImageIcon,
  Psychology as AIIcon,
  SmartToy as BotIcon,
  TextFields as TextIcon,
  RecordVoiceOver as VoiceIcon,
  Speed as PerformanceIcon,
  Insights as InsightsIcon,
  ArrowBack,
  Build
} from '@mui/icons-material';
import { PR_LABS_CONFIG } from '../../config/prlabs';

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  maxWidth: '100%'
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    '& .icon-wrapper': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.1)'
    }
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3]
  }
}));

const PRLabsDashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const getIconComponent = (id) => {
    switch (id) {
      case 'chat-models': return ChatIcon;
      case 'image-generation': return ImageIcon;
      case 'text-processing': return TextIcon;
      case 'custom-chatbots': return BotIcon;
      case 'voice-features': return VoiceIcon;
      case 'ai-tools': return AIIcon;
      default: return AIIcon;
    }
  };

  const handleFeatureClick = (feature) => {
    navigate(feature.route);
  };

  return (
    <DashboardContainer>
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
          sinfonIA AI Suite
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Suite completa de herramientas de IA para potenciar tu productividad
          </Typography>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={4}>
          <StatsCard elevation={2}>
            <PerformanceIcon color="primary" />
            <Box>
              <Typography variant="h6">Rendimiento</Typography>
              <Typography variant="body2" color="text.secondary">
                99.9% Uptime
              </Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard elevation={2}>
            <InsightsIcon color="primary" />
            <Box>
              <Typography variant="h6">Precisión</Typography>
              <Typography variant="body2" color="text.secondary">
                95% Promedio
              </Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard elevation={2}>
            <PerformanceIcon color="primary" />
            <Box>
              <Typography variant="h6">Velocidad</Typography>
              <Typography variant="body2" color="text.secondary">
                &lt; 500ms Respuesta
              </Typography>
            </Box>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {PR_LABS_CONFIG.FEATURES.map((feature) => {
          const IconComponent = getIconComponent(feature.id);
          return (
            <Grid item xs={12} sm={6} md={4} key={feature.id}>
              <FeatureCard 
                elevation={hoveredCard === feature.id ? 4 : 2}
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <IconWrapper className="icon-wrapper">
                  <IconComponent />
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Box mt="auto">
                  <Typography variant="caption" color="primary">
                    {feature.category}
                  </Typography>
                </Box>
              </FeatureCard>
            </Grid>
          );
        })}
      </Grid>
    </DashboardContainer>
  );
};

export default PRLabsDashboard; 