import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 6px 12px ${theme.palette.primary.main}30`,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main + '20',
  borderRadius: '50%',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: theme.palette.primary.main,
    fontSize: 24,
  },
}));

const ChangeIndicator = styled(Typography)(({ theme, isPositive }) => ({
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
}));

const MetricCard = ({ value, change, label, icon: Icon }) => {
  const isPositive = change?.startsWith('+');

  return (
    <StyledPaper elevation={0}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <Typography variant="h4" component="div" fontWeight="500">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {change && (
        <ChangeIndicator isPositive={isPositive}>
          {change}
        </ChangeIndicator>
      )}
    </StyledPaper>
  );
};

export default MetricCard; 