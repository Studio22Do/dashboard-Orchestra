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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  Image,
  Palette,
  Style,
  Camera,
  Brush,
  Lightbulb
} from '@mui/icons-material';

const MidjourneyExperience = () => {
  const [promptData, setPromptData] = useState({
    subject: '',
    style: 'realistic',
    lighting: 'natural',
    camera: 'wide',
    mood: 'neutral',
    additionalDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!promptData.subject) {
      setError('Por favor ingresa un sujeto para la imagen');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stylePrompts = {
        realistic: 'photorealistic, highly detailed, 8k resolution',
        artistic: 'artistic, creative, unique style, masterpiece',
        cinematic: 'cinematic, movie still, dramatic lighting',
        anime: 'anime style, vibrant colors, detailed illustration'
      };

      const lightingPrompts = {
        natural: 'natural lighting, soft shadows',
        dramatic: 'dramatic lighting, high contrast',
        studio: 'studio lighting, professional photography',
        golden: 'golden hour lighting, warm tones'
      };

      const cameraPrompts = {
        wide: 'wide angle shot, full view',
        close: 'close-up shot, detailed view',
        aerial: 'aerial view, bird\'s eye perspective',
        macro: 'macro shot, extreme detail'
      };

      const moodPrompts = {
        neutral: 'neutral mood, balanced composition',
        happy: 'bright, cheerful, positive mood',
        dramatic: 'dramatic, intense, emotional',
        peaceful: 'calm, serene, peaceful atmosphere'
      };

      const prompt = `/imagine prompt: ${promptData.subject}, ${stylePrompts[promptData.style]}, ${lightingPrompts[promptData.lighting]}, ${cameraPrompts[promptData.camera]}, ${moodPrompts[promptData.mood]}, ${promptData.additionalDetails} --ar 16:9 --v 5`;

      setGeneratedPrompt({
        fullPrompt: prompt,
        components: {
          subject: promptData.subject,
          style: stylePrompts[promptData.style],
          lighting: lightingPrompts[promptData.lighting],
          camera: cameraPrompts[promptData.camera],
          mood: moodPrompts[promptData.mood],
          additional: promptData.additionalDetails
        },
        tips: [
          'Usa --ar para ajustar la relación de aspecto',
          'Usa --v para especificar la versión de Midjourney',
          'Agrega --q 2 para mayor calidad',
          'Usa --s para ajustar el estilo',
          'Agrega --seed para reproducir resultados'
        ]
      });
    } catch (err) {
      console.error('Error generating prompt:', err);
      setError(err.message || 'Error al generar el prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Midjourney Best Experience
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera prompts optimizados para Midjourney
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sujeto Principal"
                  name="subject"
                  value={promptData.subject}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <Image color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estilo</InputLabel>
                  <Select
                    name="style"
                    value={promptData.style}
                    onChange={handleInputChange}
                    label="Estilo"
                  >
                    <MenuItem value="realistic">Realista</MenuItem>
                    <MenuItem value="artistic">Artístico</MenuItem>
                    <MenuItem value="cinematic">Cinematográfico</MenuItem>
                    <MenuItem value="anime">Anime</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Iluminación</InputLabel>
                  <Select
                    name="lighting"
                    value={promptData.lighting}
                    onChange={handleInputChange}
                    label="Iluminación"
                  >
                    <MenuItem value="natural">Natural</MenuItem>
                    <MenuItem value="dramatic">Dramática</MenuItem>
                    <MenuItem value="studio">Estudio</MenuItem>
                    <MenuItem value="golden">Hora Dorada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Encuadre</InputLabel>
                  <Select
                    name="camera"
                    value={promptData.camera}
                    onChange={handleInputChange}
                    label="Encuadre"
                  >
                    <MenuItem value="wide">Gran Angular</MenuItem>
                    <MenuItem value="close">Primer Plano</MenuItem>
                    <MenuItem value="aerial">Aéreo</MenuItem>
                    <MenuItem value="macro">Macro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado de Ánimo</InputLabel>
                  <Select
                    name="mood"
                    value={promptData.mood}
                    onChange={handleInputChange}
                    label="Estado de Ánimo"
                  >
                    <MenuItem value="neutral">Neutral</MenuItem>
                    <MenuItem value="happy">Feliz</MenuItem>
                    <MenuItem value="dramatic">Dramático</MenuItem>
                    <MenuItem value="peaceful">Pacífico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detalles Adicionales"
                  name="additionalDetails"
                  value={promptData.additionalDetails}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Agrega detalles específicos, colores, texturas, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<AutoAwesome />}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generar Prompt'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Generando prompt optimizado...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && generatedPrompt && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Prompt Completo
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedPrompt.fullPrompt)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedPrompt.fullPrompt, 'midjourney-prompt.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {generatedPrompt.fullPrompt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Componentes del Prompt
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Image />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sujeto" 
                        secondary={generatedPrompt.components.subject} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Style />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Estilo" 
                        secondary={generatedPrompt.components.style} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Palette />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Iluminación" 
                        secondary={generatedPrompt.components.lighting} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Camera />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Encuadre" 
                        secondary={generatedPrompt.components.camera} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Brush />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Estado de Ánimo" 
                        secondary={generatedPrompt.components.mood} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tips para Midjourney
                  </Typography>
                  <List>
                    {generatedPrompt.tips.map((tip, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Lightbulb />
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default MidjourneyExperience; 