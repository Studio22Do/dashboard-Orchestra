import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { styled } from '@mui/material/styles';

// Componente principal con fondo oscuro
const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 1,
  background: `linear-gradient(90deg, rgba(12, 12, 12, 0.82) 0%, rgba(26,26,26,0.0) 9%, rgba(26,26,26,0.0) 91%, rgba(12, 12, 12, 0.82) 100%)`,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#1a1625', // Fondo oscuro como en la imagen
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative', // Para overlay absoluto
}));

// Contenedor para el contenido principal
const ContentContainer = styled(Box)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: theme.spacing(3),
  paddingLeft: 0,
  paddingRight: 0,
  flexGrow: 1,
  overflowY: 'auto',
  background: 'linear-gradient(180deg, #1A1A1A 0%, #232323 100%)',
  position: 'relative', // Para overlay absoluto
}));

const Layout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <MainContent>
        <Navbar />
        <ContentContainer>
          {/* 1. Cards y Swiper */}
          {children}
          {/* 2. Overlay */}
          <GradientOverlay />
          {/* 3. Flechas y botón "Ver todas" (estos ya tienen z-index: 20) */}
        </ContentContainer>
      </MainContent>
    </Box>
  );
};

export default Layout;