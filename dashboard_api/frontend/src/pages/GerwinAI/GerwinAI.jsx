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
  SmartToy,
  Psychology,
  Lightbulb,
  FormatQuote,
  Article,
  Code,
  Translate
} from '@mui/icons-material';

const GerwinAI = () => {
  const [promptData, setPromptData] = useState({
    type: 'text',
    language: 'es',
    tone: 'professional',
    length: 'medium',
    prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!promptData.prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const contentTypes = {
        text: 'Texto generado por Gerwin AI',
        code: 'Código generado por Gerwin AI',
        article: 'Artículo generado por Gerwin AI',
        translation: 'Traducción generada por Gerwin AI'
      };

      const tones = {
        professional: 'Profesional y formal',
        casual: 'Casual y amigable',
        creative: 'Creativo y original',
        technical: 'Técnico y detallado'
      };

      const lengths = {
        short: 'Breve y conciso',
        medium: 'Medio y equilibrado',
        long: 'Extenso y detallado'
      };

      setGeneratedContent({
        content: contentTypes[promptData.type],
        metadata: {
          type: promptData.type,
          language: promptData.language,
          tone: tones[promptData.tone],
          length: lengths[promptData.length],
          timestamp: new Date().toLocaleString()
        },
        suggestions: [
          'Puedes refinar el prompt para obtener resultados más específicos',
          'Prueba diferentes tonos para variar el estilo del contenido',
          'Ajusta la longitud según tus necesidades',
          'Usa palabras clave relevantes para mejorar la precisión'
        ]
      });
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
        Gerwin AI Beta
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera contenido inteligente con Gerwin AI
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Contenido</InputLabel>
                  <Select
                    name="type"
                    value={promptData.type}
                    onChange={handleInputChange}
                    label="Tipo de Contenido"
                  >
                    <MenuItem value="text">Texto</MenuItem>
                    <MenuItem value="code">Código</MenuItem>
                    <MenuItem value="article">Artículo</MenuItem>
                    <MenuItem value="translation">Traducción</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    name="language"
                    value={promptData.language}
                    onChange={handleInputChange}
                    label="Idioma"
                  >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">Inglés</MenuItem>
                    <MenuItem value="fr">Francés</MenuItem>
                    <MenuItem value="de">Alemán</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tono</InputLabel>
                  <Select
                    name="tone"
                    value={promptData.tone}
                    onChange={handleInputChange}
                    label="Tono"
                  >
                    <MenuItem value="professional">Profesional</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="creative">Creativo</MenuItem>
                    <MenuItem value="technical">Técnico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Longitud</InputLabel>
                  <Select
                    name="length"
                    value={promptData.length}
                    onChange={handleInputChange}
                    label="Longitud"
                  >
                    <MenuItem value="short">Corta</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="long">Larga</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prompt"
                  name="prompt"
                  value={promptData.prompt}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  placeholder="Describe lo que quieres generar..."
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
                  {loading ? <CircularProgress size={24} /> : 'Generar Contenido'}
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
            Generando contenido con Gerwin AI...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && generatedContent && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Contenido Generado
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.content)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.content, 'gerwin-ai-content.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {generatedContent.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Metadatos
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SmartToy />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tipo" 
                        secondary={generatedContent.metadata.type} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Translate />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Idioma" 
                        secondary={generatedContent.metadata.language} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <FormatQuote />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tono" 
                        secondary={generatedContent.metadata.tone} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Article />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Longitud" 
                        secondary={generatedContent.metadata.length} 
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
                    Sugerencias
                  </Typography>
                  <List>
                    {generatedContent.suggestions.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Lightbulb />
                        </ListItemIcon>
                        <ListItemText primary={suggestion} />
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

export default GerwinAI; 