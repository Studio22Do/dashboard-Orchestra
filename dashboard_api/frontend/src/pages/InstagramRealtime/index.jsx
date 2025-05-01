import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  AlertTitle,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Person, 
  Tag 
} from '@mui/icons-material';
import Breadcrumbs from '../../components/common/Breadcrumbs';

// Importar los componentes reales de implementación
import ProfileSearch from './components/ProfileSearch';
import UserPosts from './components/UserPosts';
import HashtagSearch from './components/HashtagSearch';

const InstagramRealtime = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null); // Limpiar errores al cambiar de pestaña
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Instagram Realtime', href: '/instagram-realtime' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Instagram Realtime
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Consulta información en tiempo real de usuarios y hashtags de Instagram sin necesidad de autenticación.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            icon={<Person />} 
            label="Búsqueda por Usuario" 
            iconPosition="start"
          />
          <Tab 
            icon={<Tag />} 
            label="Búsqueda por Hashtag" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <ProfileSearch setError={setError} />}
        {activeTab === 1 && <HashtagSearch setError={setError} />}
      </Box>
    </Container>
  );
};

export default InstagramRealtime; 