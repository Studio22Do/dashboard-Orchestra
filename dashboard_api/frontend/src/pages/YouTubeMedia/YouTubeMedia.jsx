import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  AlertTitle
} from '@mui/material';
import { 
  YouTube, 
  Search, 
  VideoLibrary, 
  PlaylistPlay, 
  DownloadForOffline 
} from '@mui/icons-material';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import VideoSearch from './components/VideoSearch';
import VideoDetails from './components/VideoDetails';
import PlaylistDetails from './components/PlaylistDetails';
import DownloadOptions from './components/DownloadOptions';

const YouTubeMedia = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'YouTube Media Downloader', href: '/youtube-media' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          YouTube Media Downloader
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Busca, explora y descarga videos, listas de reproducción y audios de YouTube.
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
            icon={<Search />} 
            label="Buscar Videos" 
            iconPosition="start"
          />
          {selectedVideo && (
            <Tab 
              icon={<VideoLibrary />} 
              label="Detalles del Video" 
              iconPosition="start"
            />
          )}
          {selectedVideo && (
            <Tab 
              icon={<DownloadForOffline />} 
              label="Opciones de Descarga" 
              iconPosition="start"
            />
          )}
          <Tab 
            icon={<PlaylistPlay />} 
            label="Listas de Reproducción" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <VideoSearch 
            setError={setError} 
            setSelectedVideo={setSelectedVideo} 
            onSelectVideo={(video) => {
              setSelectedVideo(video);
              setActiveTab(1);
            }}
          />
        )}
        
        {activeTab === 1 && selectedVideo && (
          <VideoDetails 
            video={selectedVideo} 
            setError={setError}
          />
        )}
        
        {activeTab === 2 && selectedVideo && (
          <DownloadOptions 
            videoId={selectedVideo.id} 
            setError={setError}
          />
        )}
        
        {activeTab === 3 && (
          <PlaylistDetails 
            setError={setError}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            onSelectVideo={(video) => {
              setSelectedVideo(video);
              setActiveTab(1);
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default YouTubeMedia; 