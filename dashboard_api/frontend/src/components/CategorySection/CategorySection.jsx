import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ToolCard from '../ToolCard/ToolCard';

const CategoryContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const CategoryTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .category-icon': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: 32,
  },
}));

const CategorySection = ({ title, icon: Icon, tools }) => {
  return (
    <CategoryContainer>
      <CategoryTitle>
        {Icon && <Icon className="category-icon" />}
        <Typography variant="h4" component="h2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </CategoryTitle>
      
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
    </CategoryContainer>
  );
};

export default CategorySection; 