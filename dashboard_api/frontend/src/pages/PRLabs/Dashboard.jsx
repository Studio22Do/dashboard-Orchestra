import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, IconButton, Button, Tooltip, Chip } from '@mui/material';
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
  Build,
  Star
} from '@mui/icons-material';
import { PR_LABS_CONFIG, getChatCost } from '../../config/prlabs';
import prlabsIcon from '../../assets/images/apps/icons/marketinghubicon.png';

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
  backgroundColor: '#1a1a2e',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    '& .icon-wrapper': {
      backgroundColor: '#6a4c93',
      transform: 'scale(1.1)'
    }
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#6a4c93',
  color: 'white',
  borderRadius: '50%',
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: 40,
  }
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

  const renderCostChip = (feature) => {
    if (feature.id === 'chat-models' || feature.id === 'custom-chatbots') {
      return (
        <Tooltip title="Costo por solicitud exitosa. Modelos premium pueden costar 2 puntos. Con imagen: +1 punto.">
          <Chip label={`Puntos: desde ${getChatCost('gpt-4o-mini', false)}`} size="small" color="secondary" />
        </Tooltip>
      );
    }
    if (feature.id === 'image-generation') {
      return (
        <Tooltip title="Costo por imagen generada exitosa">
          <Chip label={`Puntos: ${PR_LABS_CONFIG.COSTS.IMAGE}`} size="small" color="secondary" />
        </Tooltip>
      );
    }
    if (feature.id === 'voice-features') {
      return (
        <Tooltip title="Costo por conversión exitosa (TTS/STT)">
          <Chip label={`Puntos: ${PR_LABS_CONFIG.COSTS.VOICE}`} size="small" color="secondary" />
        </Tooltip>
      );
    }
    if (feature.id === 'text-processing') {
      return (
        <Tooltip title="Costo por solicitud exitosa">
          <Chip label={`Puntos: ${PR_LABS_CONFIG.COSTS.TEXT}`} size="small" color="secondary" />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          sinfonIA AI Suite
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Suite completa de herramientas de IA para potenciar tu productividad
        </Typography>
        <Chip
          icon={<img src={prlabsIcon} alt="sinfonIA AI Suite" style={{ width: '20px', height: '20px' }} />}
          label="Suite completa de herramientas de IA"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: Varía según herramienta"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
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
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3}>
        {PR_LABS_CONFIG.FEATURES.map((feature) => {
          const IconComponent = getIconComponent(feature.id);
          return (
            <Box key={feature.id}>
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
                <Box mt="auto" display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color="primary">
                    {feature.category}
                  </Typography>
                  {renderCostChip(feature)}
                </Box>
              </FeatureCard>
            </Box>
          );
        })}
      </Box>
    </DashboardContainer>
  );
};

export default PRLabsDashboard; 