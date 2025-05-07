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

  useEffect(() => {
    const fetchFormats = async () => {
      if (!videoId) {
        setError('No se ha seleccionado ningún video');
        return;
      }
      
      setLoading(true);
      
      try {
        const response = await axios.get('/api/youtube/video/formats', {
          params: { videoId }
        });
        
        setFormats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error obteniendo formatos de descarga:', err);
        setError(err.response?.data?.error || 'Error al obtener opciones de descarga');
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
    if (!bytes) return 'Desconocido';
    
    const mb = bytes / 1024 / 1024;
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
    
    if (!formats || !formats.formats) return grouped;
    
    formats.formats.forEach(format => {
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
      const heightA = a.height || 0;
      const heightB = b.height || 0;
      return heightB - heightA;
    };
    
    grouped.video.sort(sortByQuality);
    grouped.mixed.sort(sortByQuality);
    
    // Ordenar audio por bitrate (de mayor a menor)
    grouped.audio.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));
    
    return grouped;
  };

  const groupedFormats = formats ? groupFormatsByQuality(formats) : { video: [], audio: [], mixed: [] };

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && formats && (
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
              <Tab label="Solo Video" icon={<VideoFile />} />
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
                        <Button 
                          variant="contained" 
                          startIcon={<Download />}
                          href={format.url}
                          target="_blank"
                          size="small"
                        >
                          Descargar
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No se encontraron formatos combinados para este video
                  </Typography>
                )}
              </List>
            )}
            
            {activeTab === 1 && (
              <List>
                {groupedFormats.video.length > 0 ? (
                  groupedFormats.video.map((format, index) => (
                    <ListItem key={index} divider={index < groupedFormats.video.length - 1}>
                      <ListItemIcon>
                        {getQualityIcon(format.qualityLabel)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${format.qualityLabel || 'Calidad desconocida'} - ${format.container.toUpperCase()}`} 
                        secondary={`${format.width || '?'}×${format.height || '?'} - ${formatSize(format.contentLength)}`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Este formato solo contiene video (sin audio)">
                          <Button 
                            variant="contained" 
                            startIcon={<Download />}
                            href={format.url}
                            target="_blank"
                            size="small"
                            color="warning"
                          >
                            Solo Video
                          </Button>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No se encontraron formatos de solo video para este video
                  </Typography>
                )}
              </List>
            )}
            
            {activeTab === 2 && (
              <List>
                {groupedFormats.audio.length > 0 ? (
                  groupedFormats.audio.map((format, index) => (
                    <ListItem key={index} divider={index < groupedFormats.audio.length - 1}>
                      <ListItemIcon>
                        <AudioFile color={format.audioBitrate > 128 ? "primary" : "inherit"} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Audio ${format.audioBitrate ? format.audioBitrate + ' kbps' : 'Calidad desconocida'} - ${format.container.toUpperCase()}`} 
                        secondary={formatSize(format.contentLength)}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Este formato solo contiene audio (sin video)">
                          <Button 
                            variant="contained" 
                            startIcon={<Download />}
                            href={format.url}
                            target="_blank"
                            size="small"
                            color="info"
                          >
                            Solo Audio
                          </Button>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No se encontraron formatos de solo audio para este video
                  </Typography>
                )}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !formats && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            No se pudieron cargar las opciones de descarga
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intenta seleccionar otro video o verifica tu conexión a internet
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DownloadOptions; 