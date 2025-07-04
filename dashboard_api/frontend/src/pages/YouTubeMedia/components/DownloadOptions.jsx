import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Tabs,
  Tab,
  Grid,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  VideoFile, 
  AudioFile,
  Download,
  Hd,
  Sd,
  Warning
} from '@mui/icons-material';
import axios from 'axios';

const DownloadOptions = ({ videoId, setError }) => {
  const [loading, setLoading] = useState(false);
  const [formats, setFormats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchFormats = async () => {
      if (!videoId) {
        setLocalError('No se ha seleccionado ningún video');
        setError('No se ha seleccionado ningún video');
        return;
      }
      
      setLoading(true);
      setLocalError(null);
      console.log('Obteniendo formatos para video:', videoId);
      
      try {
        const response = await axios.get('/api/youtube/video/formats', {
          params: { videoId }
        });
        
        // Validar la respuesta
        if (!response.data || !response.data.formats || !Array.isArray(response.data.formats)) {
          throw new Error('Formato de respuesta inválido');
        }

        if (response.data.formats.length === 0) {
          setLocalError('No se encontraron formatos disponibles para este video');
          setError('No se encontraron formatos disponibles para este video');
          setFormats(null);
          return;
        }
        
        console.log('Formatos recibidos:', response.data);
        setFormats(response.data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al obtener opciones de descarga';
        console.error('Error obteniendo formatos de descarga:', err);
        setLocalError(errorMessage);
        setError(errorMessage);
        setFormats(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormats();
  }, [videoId, setError]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Devuelve un ícono según la calidad
  const getQualityIcon = (quality) => {
    if (!quality) return <Sd />;
    
    const qualityLower = quality.toLowerCase();
    if (qualityLower.includes('high') || qualityLower.includes('hd') || qualityLower.includes('1080') || qualityLower.includes('720')) {
      return <Hd color="primary" />;
    } else if (qualityLower.includes('low') || qualityLower.includes('240') || qualityLower.includes('144')) {
      return <Sd color="warning" />;
    } else {
      return <Sd color="info" />;
    }
  };

  // Formatea el tamaño en MB o GB
  const formatSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return 'Desconocido';
    
    const mb = parseInt(bytes) / 1024 / 1024;
    if (mb < 1000) {
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
  };

  const groupFormatsByQuality = (formats) => {
    const grouped = {
      video: [],
      audio: [],
      mixed: []
    };
    
    if (!formats || !formats.formats || !Array.isArray(formats.formats)) return grouped;
    
    formats.formats.forEach(format => {
      // Validar que el formato tenga una URL válida
      if (!format.url) return;
      
      if (format.hasVideo && !format.hasAudio) {
        grouped.video.push(format);
      } else if (!format.hasVideo && format.hasAudio) {
        grouped.audio.push(format);
      } else if (format.hasVideo && format.hasAudio) {
        grouped.mixed.push(format);
      }
    });
    
    // Ordenar por calidad (de mayor a menor)
    const sortByQuality = (a, b) => {
      const heightA = parseInt(a.height) || 0;
      const heightB = parseInt(b.height) || 0;
      return heightB - heightA;
    };
    
    grouped.video.sort(sortByQuality);
    grouped.mixed.sort(sortByQuality);
    
    // Ordenar audio por bitrate (de mayor a menor)
    grouped.audio.sort((a, b) => (parseInt(b.audioBitrate) || 0) - (parseInt(a.audioBitrate) || 0));
    
    return grouped;
  };

  const groupedFormats = formats ? groupFormatsByQuality(formats) : { video: [], audio: [], mixed: [] };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (localError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {localError}
      </Alert>
    );
  }

  if (!formats || !formats.formats || formats.formats.length === 0) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        No se encontraron formatos disponibles para este video
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Opciones de descarga para: {formats.title}
        </Typography>
        
        <Alert severity="info" sx={{ my: 2 }}>
          Selecciona el formato que deseas descargar. Para mejor calidad, elige formatos de video + audio.
        </Alert>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ mb: 2 }}
          variant="fullWidth"
        >
          <Tab label="Video + Audio" icon={<VideoFile />} />
          <Tab label="Solo Audio" icon={<AudioFile />} />
        </Tabs>
        
        <Divider sx={{ mb: 2 }} />
        
        {activeTab === 0 && (
          <List>
            {groupedFormats.mixed.length > 0 ? (
              groupedFormats.mixed.map((format, index) => (
                <ListItem key={index} divider={index < groupedFormats.mixed.length - 1}>
                  <ListItemIcon>
                    {getQualityIcon(format.qualityLabel)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${format.qualityLabel || 'Calidad desconocida'} - ${format.container.toUpperCase()}`} 
                    secondary={`${format.width || '?'}×${format.height || '?'} - ${formatSize(format.contentLength)}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Descargar video">
                      <Button 
                        variant="contained" 
                        startIcon={<Download />}
                        href={format.url}
                        target="_blank"
                        size="small"
                        disabled={!format.url}
                      >
                        Descargar
                      </Button>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No se encontraron formatos de video + audio para este video
              </Typography>
            )}
          </List>
        )}
        
        {activeTab === 1 && (
          <List>
            {groupedFormats.audio.length > 0 ? (
              groupedFormats.audio.map((format, index) => (
                <ListItem key={index} divider={index < groupedFormats.audio.length - 1}>
                  <ListItemIcon>
                    <AudioFile color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Audio ${format.qualityLabel || 'Calidad estándar'} - ${format.container.toUpperCase()}`}
                    secondary={`${formatSize(format.contentLength)} - ${format.audioBitrate || '?'} kbps`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Descargar audio">
                      <Button 
                        variant="contained" 
                        startIcon={<Download />}
                        href={format.url}
                        target="_blank"
                        size="small"
                        disabled={!format.url}
                      >
                        Descargar
                      </Button>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No se encontraron formatos de audio para este video
              </Typography>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadOptions; 