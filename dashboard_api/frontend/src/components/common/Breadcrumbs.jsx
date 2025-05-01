import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home, ChevronRight } from '@mui/icons-material';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
      <MuiBreadcrumbs
        separator={<ChevronRight fontSize="small" sx={{ color: 'text.secondary' }} />}
        aria-label="breadcrumb"
      >
        <Link 
          component={RouterLink} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main'
            }
          }}
        >
          <Home fontSize="small" sx={{ mr: 0.5 }} />
          Inicio
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return isLast ? (
            <Typography 
              key={index} 
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              component={RouterLink}
              to={item.href}
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.main'
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 