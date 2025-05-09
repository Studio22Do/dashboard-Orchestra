import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

// Tarjeta con gradiente vertical y borde solo en hover, animación suave
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 18,
  background: 'linear-gradient(180deg, #342A5B 0%, #201C2E 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
  overflow: 'hidden',
  transition: 'border-color 0.35s cubic-bezier(.4,2,.3,1), background 0.5s cubic-bezier(.4,2,.3,1);',
  minHeight: 120,
  border: '2px solid',
  borderColor: 'transparent',
  '&:hover': {
    borderColor: '#AC9DFB',
    background: 'linear-gradient(180deg, #201C2E 0%, #342A5B 100%)',
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