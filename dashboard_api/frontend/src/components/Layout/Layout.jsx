import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { styled } from '@mui/material/styles';

interface LayoutProps {
  children: ReactNode;
}

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
  padding: theme.spacing(3),
  flexGrow: 1,
  overflowY: 'auto',
  // Gradiente sutil para mejorar la visibilidad del contenido
  background: 'linear-gradient(180deg, #1a1625 0%, #1f1a2e 100%)',
}));

const Layout = ({ children }: LayoutProps) => {
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