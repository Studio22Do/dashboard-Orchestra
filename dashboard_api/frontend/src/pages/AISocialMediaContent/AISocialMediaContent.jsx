import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Send,
  ContentCopy,
  Delete,
  SmartToy,
  Psychology,
  Lightbulb,
  History,
  Settings,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const AISocialMediaContent = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [history, setHistory] = useState([]);

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: <Instagram /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook /> },
    { value: 'twitter', label: 'Twitter', icon: <Twitter /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <LinkedIn /> }
  ];

  const contentTypes = [
    { value: 'post', label: 'Post' },
    { value: 'story', label: 'Story' },
    { value: 'caption', label: 'Caption' },
    { value: 'hashtags', label: 'Hashtags' }
  ];

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Amigable' },
    { value: 'humorous', label: 'Humorístico' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newContent = {
        platform,
        contentType,
        tone,
        prompt,
        content: `Este es un contenido generado por IA para ${platform} en formato ${contentType} con tono ${tone}. En una implementación real, este contenido sería generado por un modelo de IA.`,
        timestamp: new Date().toLocaleString()
      };
      
      setGeneratedContent(newContent);
      setHistory(prev => [newContent, ...prev]);
      setPrompt('');
      
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || 'Error al generar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generador de Contenido para Redes Sociales
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera contenido optimizado para diferentes redes sociales usando IA
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      multiline
                      rows={4}
                      required
                      placeholder="Describe el contenido que deseas generar..."
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Plataforma</InputLabel>
                      <Select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        label="Plataforma"
                      >
                        {platforms.map((platform) => (
                          <MenuItem key={platform.value} value={platform.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {platform.icon}
                              {platform.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Contenido</InputLabel>
                      <Select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        label="Tipo de Contenido"
                      >
                        {contentTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tono</InputLabel>
                      <Select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        label="Tono"
                      >
                        {tones.map((tone) => (
                          <MenuItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={<Send />}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Generar Contenido'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Generando contenido...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {generatedContent && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Contenido Generado
                </Typography>
                <Tooltip title="Copiar contenido">
                  <IconButton onClick={() => handleCopy(generatedContent.content)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="body1" paragraph>
                {generatedContent.content}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={platforms.find(p => p.value === generatedContent.platform)?.icon} 
                      label={platforms.find(p => p.value === generatedContent.platform)?.label} 
                      color="primary" />
                <Chip label={contentTypes.find(t => t.value === generatedContent.contentType)?.label} />
                <Chip label={tones.find(t => t.value === generatedContent.tone)?.label} />
                <Chip label={generatedContent.timestamp} variant="outlined" />
              </Box>
            </Paper>
          )}

          {history.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Generación
                </Typography>
                <Tooltip title="Limpiar historial">
                  <IconButton onClick={handleClearHistory}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <List>
                {history.map((item, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {platforms.find(p => p.value === item.platform)?.icon}
                            <Typography variant="subtitle1">
                              {platforms.find(p => p.value === item.platform)?.label} - 
                              {contentTypes.find(t => t.value === item.contentType)?.label}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" paragraph>
                              {item.content}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={tones.find(t => t.value === item.tone)?.label} size="small" />
                              <Chip label={item.timestamp} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuración
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Plataforma Seleccionada"
                    secondary={platforms.find(p => p.value === platform)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tipo de Contenido"
                    secondary={contentTypes.find(t => t.value === contentType)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tono"
                    secondary={tones.find(t => t.value === tone)?.label}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sugerencias
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Sé específico en tu prompt"
                    secondary="Menciona detalles clave como el tema, público objetivo y objetivos del contenido"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Adapta el tono"
                    secondary="Cada plataforma tiene su propio estilo de comunicación"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Optimiza el formato"
                    secondary="Considera las limitaciones de caracteres y formato de cada plataforma"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AISocialMediaContent; 