import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  marginBottom: theme.spacing(3),
}));

const BarChart = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-around',
  height: 200,
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const Bar = styled(Box)(({ height, color }) => ({
  width: 60,
  height: `${height}%`,
  backgroundColor: color,
  borderRadius: '8px 8px 0 0',
  position: 'relative',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scaleY(1.05)',
    boxShadow: `0 4px 20px ${color}40`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -25,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }
}));

const DonutChart = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 200,
  height: 200,
  margin: '0 auto',
}));

const DonutSegment = styled(Box)(({ startAngle, endAngle, color }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: `conic-gradient(from ${startAngle}deg, ${color} 0deg, ${color} ${endAngle - startAngle}deg, transparent ${endAngle - startAngle}deg)`,
  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
}));

const DonutCenter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: '#272038',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255,255,255,0.1)',
}));

const UsageChartModal = ({ usageData = [] }) => {
  if (!usageData || usageData.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de uso disponibles
        </Typography>
      </Box>
    );
  }

  // Colores para las herramientas
  const getToolColor = (toolName) => {
    const colorMap = {
      'Instagram Statistics': '#E91E63',
      'sinfonIA': '#837cf2',
      'Mediafy': '#2196F3',
      'default': '#FF9800'
    };
    return colorMap[toolName] || colorMap.default;
  };

  // Calcular ángulos para el gráfico donut
  const total = usageData.reduce((sum, item) => sum + (item.percent || 0), 0);
  let currentAngle = 0;
  const donutData = usageData.map((item) => {
    const percentage = item.percent || 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage / total) * 360;
    currentAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      color: getToolColor(item.tool || item.name)
    };
  });

  return (
    <Box>
      {/* Gráfico de Barras */}
      <ChartContainer>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Uso por Herramienta (Gráfico de Barras)
        </Typography>
        <BarChart>
          {usageData.map((item, index) => {
            const percentage = item.percent || 0;
            const color = getToolColor(item.tool || item.name);
            const toolName = item.tool || item.name;
            
            return (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Bar 
                  height={percentage} 
                  color={color}
                  sx={{
                    '&::after': {
                      content: `"${percentage}%"`,
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    mt: 1, 
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}
                >
                  {toolName}
                </Typography>
              </Box>
            );
          })}
        </BarChart>
      </ChartContainer>

      {/* Gráfico Donut */}
      <ChartContainer>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Distribución del Uso (Gráfico Donut)
        </Typography>
        <DonutChart>
          {donutData.map((item, index) => (
            <DonutSegment
              key={index}
              startAngle={item.startAngle}
              endAngle={item.endAngle}
              color={item.color}
            />
          ))}
          <DonutCenter>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {total}%
            </Typography>
          </DonutCenter>
        </DonutChart>
        
        {/* Leyenda */}
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {donutData.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: item.color, 
                  borderRadius: '50%' 
                }} 
              />
              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                {item.tool || item.name}: {item.percent}%
              </Typography>
            </Box>
          ))}
        </Box>
      </ChartContainer>

      {/* Gráfico de Área */}
      <ChartContainer>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Comparación Visual (Gráfico de Área)
        </Typography>
        <Box sx={{ height: 150, display: 'flex', alignItems: 'end', gap: 1, px: 2 }}>
          {usageData.map((item, index) => {
            const percentage = item.percent || 0;
            const color = getToolColor(item.tool || item.name);
            const toolName = item.tool || item.name;
            
            return (
              <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    height: `${percentage * 1.5}px`,
                    backgroundColor: color,
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scaleY(1.1)',
                      boxShadow: `0 4px 20px ${color}40`,
                    },
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    mt: 1, 
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}
                >
                  {toolName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: color, 
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  {percentage}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </ChartContainer>
    </Box>
  );
};

export default UsageChartModal;
