import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 1.5, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        mt: 'auto', 
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ fontSize: '0.75rem' }}
      >
        &copy; {currentYear} Orchestra by Studio22. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer; 