import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Tarjeta con gradiente vertical y borde solo en hover, animación suave
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 18,
  background: 'linear-gradient(180deg, #201C2E 0%, #342A5B 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
  overflow: 'visible',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: 130,
  border: '2px solid',
  borderColor: 'transparent',
  transform: 'translateY(0)',
  
  '&:hover': {
    borderColor: '#AC9DFB',
    background: 'linear-gradient(180deg, #342A5B 0%, #201C2E 100%)',
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
  overflow: 'visible',
  backgroundColor: 'transparent',
  marginRight: theme.spacing(2.5),
  marginBottom: 0,
  marginLeft: theme.spacing(2.5),
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: 96,
    color: 'white',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 12
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

const CardContentFade = styled('div')(({ theme, isvisible }) => ({
  opacity: isvisible ? 1 : 0,
  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  pointerEvents: isvisible ? 'auto' : 'none',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 0px',
  gap: '40px',
}));

const ToolCard = ({ 
  title = 'Sin título', 
  imageUrl, 
  onClick = () => {} 
}) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (!cardRef.current) return;
      let parent = cardRef.current.parentElement;
      let isInSwiper = false;
      while (parent) {
        if (parent.classList && parent.classList.contains('swiper-slide')) {
          isInSwiper = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (!isInSwiper) {
        setIsVisible(true); // Siempre visible si no está en Swiper
        return;
      }
      // Si está en Swiper, solo visible si es visible en el slide
      parent = cardRef.current.parentElement;
      while (parent) {
        if (parent.classList && parent.classList.contains('swiper-slide-visible')) {
          setIsVisible(true);
          return;
        }
        parent = parent.parentElement;
      }
      setIsVisible(false);
    };
    checkVisibility();
    const interval = setInterval(checkVisibility, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <StyledCard 
      onClick={handleClick} 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Abrir ${title}`}
      ref={cardRef}
    >
      <CardContentFade isvisible={isVisible ? 1 : 0}>
        <IconContainer>
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          )}
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
      </CardContentFade>
    </StyledCard>
  );
};

ToolCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func
};

export default ToolCard; 