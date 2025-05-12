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
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: 120,
  border: '2px solid',
  borderColor: 'transparent',
  transform: 'translateY(0)',
  '&:hover': {
    borderColor: '#AC9DFB',
    background: 'linear-gradient(180deg, #201C2E 0%, #342A5B 100%)',
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 8px 24px rgba(172, 157, 251, 0.15)',
    '& .MuiAvatar-root': {
      transform: 'scale(1.1)',
      '& svg': {
        transform: 'scale(1.1)',
      }
    }
  },
}));

// Contenedor del icono con color primario
const IconContainer = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  backgroundColor: 'transparent',
  marginBottom: theme.spacing(1.5),
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '& svg': {
    fontSize: 40,
    color: 'white',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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