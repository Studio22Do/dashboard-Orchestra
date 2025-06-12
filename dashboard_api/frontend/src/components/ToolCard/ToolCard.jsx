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
  icon: Icon, 
  imageUrl = 'https://placehold.co/400x200/1a1a1a/ffffff?text=No+Image', 
  onClick = () => {} 
}) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
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
      ref={cardRef}
      className={isVisible ? 'visible' : ''}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Abrir ${title}`}
    >
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
          {!imgError ? (
            <img
              src={imageUrl}
              alt={title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px 12px 0 0',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px 12px 0 0',
              }}
            >
              {Icon ? (
                <Icon sx={{ fontSize: 40, color: '#ffffff' }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {title}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {Icon && (
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 32,
                height: 32,
                mr: 1,
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Avatar>
          )}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.2,
              color: 'white',
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

ToolCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func
};

export default ToolCard; 