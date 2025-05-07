import React, { useRef } from 'react';
import { Box, Typography, Grid, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight, ArrowForward } from '@mui/icons-material';
import ToolCard from '../ToolCard/ToolCard';

// Contenedor principal de la categoría
const CategoryContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

// Contenedor del título con icono
const CategoryTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .category-icon': {
    marginRight: theme.spacing(1.5),
    color: 'white',
    fontSize: 28,
  },
}));

// Contenedor de herramientas con posición relativa para los botones de desplazamiento
const ToolsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: `0 ${theme.spacing(4)}`,
  maxWidth: '100%',
  overflowX: 'hidden',
  marginTop: theme.spacing(3),
}));

// Contenedor con scroll horizontal para las tarjetas
const ScrollContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  display: 'flex',
  flexWrap: 'nowrap',
  WebkitOverflowScrolling: 'touch',
  gap: theme.spacing(2.5),
  paddingBottom: theme.spacing(1),
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  MsOverflowStyle: 'none',
}));

// Botones de desplazamiento
const ScrollButton = styled(IconButton)(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  backgroundColor: 'rgba(20, 20, 30, 0.7)',
  color: 'white',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  ...(direction === 'left' ? { left: 0 } : { right: 0 }),
}));

// Contenedor de cada tarjeta
const CardContainer = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: 260,
  padding: theme.spacing(0.5),
}));

// Contenedor del título y botón Ver todas
const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  width: '100%',
}));

// Botón Ver todas estilizado
const ViewAllButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  fontSize: '0.9rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
  '& .MuiButton-endIcon': {
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(3px)',
  }
}));

const CategorySection = ({ title, icon: Icon, tools, onViewAll }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -520, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 520, behavior: 'smooth' });
    }
  };

  const hasMultipleTools = tools.length > 3;

  return (
    <CategoryContainer>
      <TitleContainer>
        <CategoryTitle>
          {Icon && <Icon className="category-icon" />}
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 500, 
              color: 'white',
              fontSize: '1.4rem'
            }}
          >
            {title}
          </Typography>
        </CategoryTitle>
        
        <ViewAllButton 
          endIcon={<ArrowForward />} 
          onClick={onViewAll}
        >
          Ver todas
        </ViewAllButton>
      </TitleContainer>
      
      {hasMultipleTools ? (
        <ToolsContainer>
          <ScrollButton direction="left" onClick={scrollLeft} size="small">
            <ChevronLeft />
          </ScrollButton>
          
          <ScrollContainer ref={scrollRef}>
            {tools.map((tool) => (
              <CardContainer key={tool.id}>
                <ToolCard
                  title={tool.title}
                  icon={tool.icon}
                  onClick={tool.onClick}
                />
              </CardContainer>
            ))}
          </ScrollContainer>
          
          <ScrollButton direction="right" onClick={scrollRight} size="small">
            <ChevronRight />
          </ScrollButton>
        </ToolsContainer>
      ) : (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <ToolCard
                title={tool.title}
                icon={tool.icon}
                onClick={tool.onClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CategoryContainer>
  );
};

export default CategorySection; 