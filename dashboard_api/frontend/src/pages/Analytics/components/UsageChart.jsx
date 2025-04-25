import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.default,
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const UsageChart = () => {
  // Datos de ejemplo - En producción vendrían de una API
  const usageData = [
    { name: 'Instagram Statistics API', usage: 85, color: '#E1306C' },
    { name: 'YouTube Downloader', usage: 65, color: '#FF0000' },
    { name: 'SEO Analyzer', usage: 45, color: '#4CAF50' },
    { name: 'Google Trends', usage: 35, color: '#2196F3' },
    { name: 'Page Speed Insights', usage: 25, color: '#FFC107' },
  ];

  return (
    <Box>
      {usageData.map((item) => (
        <ProgressContainer key={item.name}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {item.usage}%
            </Typography>
          </Box>
          <StyledLinearProgress
            variant="determinate"
            value={item.usage}
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: item.color,
              },
            }}
          />
        </ProgressContainer>
      ))}
    </Box>
  );
};

export default UsageChart; 