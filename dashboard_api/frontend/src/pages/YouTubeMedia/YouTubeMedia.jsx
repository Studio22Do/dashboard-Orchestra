import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  AlertTitle,
  Button
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
import ChannelVideos from './components/ChannelVideos';

const YouTubeMedia = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [channelId, setChannelId] = useState('');
  const [showChannelVideos, setShowChannelVideos] = useState(false);

  const handleTabChange = (event, newValue) => {
    console.log('Tab cambiado a:', newValue);
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
          <Tab 
            icon={<VideoLibrary />} 
            label="Detalles del Video" 
            iconPosition="start"
            disabled={!selectedVideoId}
          />
          <Tab 
            icon={<PlaylistPlay />} 
            label="Listas de Reproducción" 
            iconPosition="start"
          />
          <Tab 
            icon={<VideoLibrary />} 
            label="Videos de Canal" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <VideoSearch 
            setError={setError} 
            onSelectVideo={(video) => {
              setSelectedVideoId(video.id);
              setActiveTab(1);
            }}
          />
        )}
        
        {activeTab === 1 && (
          selectedVideoId ? (
            <VideoDetails 
              videoId={selectedVideoId} 
              setError={setError}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">Selecciona un video para ver los detalles.</Typography>
          )
        )}
        
        {activeTab === 2 && (
          <PlaylistDetails 
            setError={setError}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            onSelectVideo={(video) => {
              setSelectedVideoId(video.id);
              setActiveTab(1);
            }}
          />
        )}
        
        {activeTab === 3 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Explora videos de un canal</Typography>
              <Box component="form" onSubmit={e => { e.preventDefault(); setShowChannelVideos(true); }} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Pega el ID o URL del canal de YouTube"
                  value={channelId}
                  onChange={e => setChannelId(e.target.value)}
                  style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #444', background: '#181828', color: '#fff' }}
                />
                <Button type="submit" variant="contained">Ver Videos</Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Ejemplo de ID: <b>UCeY0bbntWzzVIaj2z3QigXg</b> &nbsp;|&nbsp; Ejemplo de URL: <b>https://www.youtube.com/@CNN</b>
              </Typography>
            </Paper>
            {showChannelVideos && channelId && (
              <ChannelVideos channelId={extractChannelId(channelId)} />
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

function extractChannelId(input) {
  // Si es una URL de canal, extrae el ID o handle
  if (input.includes('youtube.com')) {
    // URL tipo /channel/ID
    const matchId = input.match(/channel\/([\w-]+)/);
    if (matchId) return matchId[1];
    // URL tipo /@handle
    const matchHandle = input.match(/\/@([\w-]+)/);
    if (matchHandle) return matchHandle[1];
  }
  // Si es un ID directo
  return input.trim();
}

export default YouTubeMedia; 