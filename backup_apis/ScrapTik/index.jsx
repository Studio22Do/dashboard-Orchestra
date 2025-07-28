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
  Tag, 
  Explore, 
  TrendingUp,
  Comment
} from '@mui/icons-material';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import UserSearch from './components/UserSearch';
import TrendingVideos from './components/TrendingVideos';
import HashtagSearch from './components/HashtagSearch';
import PostSearch from './components/PostSearch';
import VideoComments from './components/VideoComments';

// Componentes temporales hasta que se implementen
const TrendingContent = () => (
  <Box sx={{ textAlign: 'center', py: 5 }}>
    <Typography variant="h6">Contenido en Tendencia</Typography>
    <Typography color="text.secondary">Esta funcionalidad estará disponible pronto.</Typography>
  </Box>
);

const ScrapTik = () => {
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
            { label: 'TikTok', href: '/tiktok' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          TikTok Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explora perfiles, publicaciones, hashtags y tendencias de TikTok en tiempo real.
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
            label="Perfiles" 
            iconPosition="start"
          />
          {/* <Tab 
            icon={<Explore />} 
            label="Publicaciones" 
            iconPosition="start"
          /> */}
          <Tab 
            icon={<Tag />} 
            label="Hashtags" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrendingUp />} 
            label="Tendencias" 
            iconPosition="start"
          />
          {/* <Tab 
            icon={<Comment />} 
            label="Comentarios" 
            iconPosition="start"
          /> */}
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <UserSearch setError={setError} />}
        {/* {activeTab === 1 && <PostSearch setError={setError} />} */}
        {activeTab === 1 && <HashtagSearch setError={setError} />}
        {activeTab === 2 && <TrendingVideos setError={setError} />}
        {/* {activeTab === 4 && <VideoComments setError={setError} />} */}
      </Box>
    </Container>
  );
};

export default ScrapTik; 