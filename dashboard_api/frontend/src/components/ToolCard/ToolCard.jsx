import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

// Tarjeta con gradiente vertical y borde solo en hover, animación suave
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 18,
  background: 'linear-gradient(180deg, #342A5B 0%, #201C2E 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
  overflow: 'visible',
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
  width: 80,
  height: 80,
  borderRadius: 12,
  backgroundColor: 'transparent',
  marginRight: theme.spacing(2.5),
  marginBottom: 0,
  marginLeft: theme.spacing(2.5),
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: 66,
    color: 'white',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }
}));

// Contenido de la tarjeta con padding
const StyledContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: `${theme.spacing(2)} 0`,
  height: '100%',
  maxWidth: 180,
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const ToolCard = ({ title, icon: Icon, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <IconContainer>
        {Icon && <Icon />}
      </IconContainer>
      <StyledContent>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600, 
            color: 'white',
            fontSize: '1.25rem',
            lineHeight: 1.3,
            textAlign: 'left',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </Typography>
      </StyledContent>
    </StyledCard>
  );
};

export default ToolCard; 