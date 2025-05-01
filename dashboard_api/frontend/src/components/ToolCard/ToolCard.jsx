import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  minHeight: 90,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 6px 12px ${theme.palette.primary.main}30`,
    borderColor: theme.palette.primary.main,
    '& .tool-icon': {
      color: theme.palette.primary.main,
    }
  },
  transition: 'all 0.3s ease',
}));

const ToolIcon = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  transition: 'color 0.3s ease',
}));

const ToolCard = ({ title, icon: Icon, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <ToolIcon className="tool-icon">
          {Icon && <Icon sx={{ fontSize: 28 }} />}
        </ToolIcon>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ToolCard; 