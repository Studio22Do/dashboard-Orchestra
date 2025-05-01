import React, { useRef } from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ToolCard from '../ToolCard/ToolCard';

const CategoryContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const CategoryTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .category-icon': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: 32,
  },
}));

const ToolsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: `0 ${theme.spacing(4)}`,
  maxWidth: '100%',
  overflowX: 'hidden',
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  display: 'flex',
  flexWrap: 'nowrap',
  WebkitOverflowScrolling: 'touch',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  MsOverflowStyle: 'none',
  marginBottom: theme.spacing(1)
}));

const ScrollButton = styled(IconButton)(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  ...(direction === 'left' ? { left: 0 } : { right: 0 }),
}));

const CardContainer = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: '240px',
  padding: theme.spacing(1),
}));

const CategorySection = ({ title, icon: Icon, tools }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -480, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 480, behavior: 'smooth' });
    }
  };

  const hasMultipleTools = tools.length > 4;

  return (
    <CategoryContainer>
      <CategoryTitle>
        {Icon && <Icon className="category-icon" />}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </CategoryTitle>
      
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
        <Grid container spacing={3}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
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