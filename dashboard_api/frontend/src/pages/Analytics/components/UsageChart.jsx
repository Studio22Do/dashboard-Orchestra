import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  GroupAdd,
  AccessTime,
  RepeatOne,
  TrendingUp,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  background: 'linear-gradient(135deg, #2a1f3d 0%, #3a2a4d 100%)',
  border: '1px solid rgba(131, 124, 242, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(131, 124, 242, 0.2)',
    border: '1px solid rgba(131, 124, 242, 0.4)',
  }
}));

const IconContainer = styled(Box)(({ theme, color }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  boxShadow: `0 4px 15px ${color}40`,
}));

const UsageChart = ({ usageData = [] }) => {
  // Si no hay datos, mostrar mensaje
  if (!usageData || usageData.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de uso disponibles
        </Typography>
      </Box>
    );
  }

  // Colores para las herramientas
  const getToolColor = (toolName) => {
    const colorMap = {
      'Instagram Statistics': '#E91E63',
      'sinfonIA': '#837cf2',
      'Mediafy': '#2196F3',
      'default': '#FF9800'
    };
    return colorMap[toolName] || colorMap.default;
  };

  // Iconos para las herramientas
  const getToolIcon = (toolName) => {
    const iconMap = {
      'Instagram Statistics': GroupAdd,
      'sinfonIA': TrendingUp,
      'Mediafy': AccessTime,
      'default': RepeatOne
    };
    return iconMap[toolName] || iconMap.default;
  };

  return (
    <Grid container spacing={3}>
      {usageData.map((item, index) => {
        const toolName = item.tool || item.name || 'Herramienta';
        const percentage = item.percent || item.usage || item.count || 0;
        const color = getToolColor(toolName);
        const IconComponent = getToolIcon(toolName);

        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <IconContainer color={color}>
                  <IconComponent sx={{ fontSize: 24, color: 'white' }} />
                </IconContainer>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {percentage}%
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 1
                  }}
                >
                  {toolName}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: color,
                    fontWeight: 600,
                    display: 'block',
                    mt: 'auto'
                  }}
                >
                  Uso del sistema
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default UsageChart; 