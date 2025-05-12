import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { styled } from '@mui/material/styles';

// Componente principal con fondo oscuro
const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#1a1625', // Fondo oscuro como en la imagen
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

// Contenedor para el contenido principal
const ContentContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  paddingLeft: 0,
  paddingRight: 0,
  flexGrow: 1,
  overflowY: 'auto',
  // Gradiente sutil para mejorar la visibilidad del contenido
  background: 'linear-gradient(180deg, #1a1625 0%, #1f1a2e 100%)',
}));

const Layout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <MainContent>
        <Navbar />
        <ContentContainer>
          {children}
        </ContentContainer>
      </MainContent>
    </Box>
  );
};

export default Layout;