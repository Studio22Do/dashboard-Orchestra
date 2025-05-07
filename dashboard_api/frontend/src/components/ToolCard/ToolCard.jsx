import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

// Tarjeta con color de fondo oscuro y bordes redondeados
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  backgroundColor: '#272038', // Fondo morado oscuro
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  minHeight: 120,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
}));

// Contenedor del icono con color primario
const IconContainer = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  backgroundColor: 'transparent',
  marginBottom: theme.spacing(1.5),
  '& svg': {
    fontSize: 40,
    color: 'white',
  }
}));

// Contenido de la tarjeta con padding
const StyledContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  height: '100%',
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

const ToolCard = ({ title, icon: Icon, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <StyledContent>
        <IconContainer>
          {Icon && <Icon />}
        </IconContainer>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 500, 
            color: 'white',
            fontSize: '1rem',
            lineHeight: 1.3
          }}
        >
          {title}
        </Typography>
      </StyledContent>
    </StyledCard>
  );
};

export default ToolCard; 