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
  LinkedIn,
  Star
} from '@mui/icons-material';
import { generateSocialMediaContent } from '../../services/socialMediaContent';
import socialMediaIcon from '../../assets/images/apps/icons/contentcreatoricon.png';

const AISocialMediaContent = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [history, setHistory] = useState([]);

  // Estilos consistentes
  const actionButtonSx = {
    height: 56,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

  const inputSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent',
      borderRadius: 2,
      height: 56,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiInputBase-input': { padding: '0 14px', height: 56, boxSizing: 'border-box' }
  };

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: 56,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiSelect-select': { height: 56, padding: '0 14px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }
  };

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

  // Mapeo de plataformas a endpoint de la API
  const platformApiMap = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Construir el prompt enriquecido
      const enrichedPrompt = `${prompt}\nTipo de contenido: ${contentTypes.find(t => t.value === contentType)?.label}.\nTono: ${tones.find(t => t.value === tone)?.label}.`;
      const apiPlatform = platformApiMap[platform] || 'Instagram';
      const response = await generateSocialMediaContent({
        platform: apiPlatform,
        text: enrichedPrompt,
        lang: 'es', // Puedes hacer esto dinámico si lo deseas
        length: 150 // Puedes hacer esto dinámico si lo deseas
      });
      const newContent = {
        platform,
        contentType,
        tone,
        prompt,
        content: response.content,
        timestamp: new Date().toLocaleString()
      };
      
      setGeneratedContent(newContent);
      setHistory(prev => [newContent, ...prev]);
      setPrompt('');
      
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al generar el contenido');
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
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Generador de Contenido para Redes Sociales
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Genera contenido optimizado para diferentes redes sociales usando IA
        </Typography>
        <Chip
          icon={<img src={socialMediaIcon} alt="Social Media Content" style={{ width: '20px', height: '20px' }} />}
          label="Generador inteligente de contenido para redes sociales"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por generación"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Grid  spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Barra única: Prompt + Selects + Botón */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: { xs: 'wrap', md: 'nowrap' }, width: '100%' }}>
                      {/* Prompt ocupa todo el espacio disponible */}
                      <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          required
                          placeholder="Describe el contenido que deseas generar..."
                          sx={inputSx}
                        />
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                          <InputLabel>Plataforma</InputLabel>
                          <Select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            label="Plataforma"
                            sx={selectSx}
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
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                          <InputLabel>Tipo de Contenido</InputLabel>
                          <Select
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            label="Tipo de Contenido"
                            sx={selectSx}
                          >
                            {contentTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: 200 } }}>
                        <FormControl fullWidth>
                          <InputLabel>Tono</InputLabel>
                          <Select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            label="Tono"
                            sx={selectSx}
                          >
                            {tones.map((tone) => (
                              <MenuItem key={tone.value} value={tone.value}>
                                {tone.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: 160 } }}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          disabled={loading}
                          startIcon={<Send />}
                          sx={actionButtonSx}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Generar'}
                        </Button>
                      </Box>
                    </Box>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
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

            <Card>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AISocialMediaContent; 