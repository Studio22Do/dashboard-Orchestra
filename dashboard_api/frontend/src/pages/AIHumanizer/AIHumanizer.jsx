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
import { APP_CONFIG } from '../../config/constants';

const AIHumanizer = () => {
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/${API_MODE}`;
  const [promptData, setPromptData] = useState({
    type: 'text',
    tone: 'professional',
    length: 'medium',
    mode: 'easy',
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
    setGeneratedContent(null);
    
    // Mapear longitud a nivel
    const lengthToLevel = {
      'short': 3,
      'medium': 7,
      'long': 10
    };
    
    // Mapear tono del frontend al de la API
    const toneMapping = {
      'professional': 'formal',
      'casual': 'casual',
      'creative': 'general',
      'technical': 'academic'
    };
    
          try {
        // Usar endpoint diferente según el modo
        const endpoint = promptData.mode === 'basic' ? '/basic' : '/';
        const response = await fetch(`${API_BASE_URL}/ai-humanizer${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: promptData.prompt,
            level: lengthToLevel[promptData.length] || 7,
            tone: toneMapping[promptData.tone] || 'general',
            type: promptData.type
          })
        });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el contenido');
      }
      const data = await response.json();
      setGeneratedContent({
        content: data.contenido_generado || 'No se pudo generar contenido',
        alternatives: data.alternativas || [],
        metadata: {
          type: data.metadatos.tipo,
          language: data.metadatos.idioma,
          tone: data.metadatos.tono,
          length: data.metadatos.longitud,
          palabras_originales: data.metadatos.palabras_originales,
          palabras_humanizadas: data.metadatos.palabras_humanizadas,
          mejor_probabilidad_ai: data.metadatos.mejor_probabilidad_ai,
          total_alternativas: data.metadatos.total_alternativas,
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

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const response = await fetch(`${API_BASE_URL}/ai-humanizer/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Texto de prueba para verificar la funcionalidad'
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la prueba');
      }
      const data = await response.json();
      setGeneratedContent({
        content: data.contenido_generado || 'No se pudo generar contenido de prueba',
        metadata: {
          type: data.metadatos.tipo,
          language: data.metadatos.idioma,
          tone: data.metadatos.tono,
          length: data.metadatos.longitud,
          timestamp: new Date().toLocaleString()
        },
        suggestions: [
          'Esta es una respuesta de prueba que confirma que el frontend y backend funcionan correctamente',
          'El problema principal es que la API externa está tardando demasiado en responder',
          'Puedes intentar con textos más cortos o esperar unos minutos antes de intentar nuevamente'
        ]
      });
    } catch (err) {
      setError(err.message || 'Error en la prueba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Humanizer API
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera contenido inteligente con AI Humanizer
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Modo</InputLabel>
                  <Select
                    name="mode"
                    value={promptData.mode}
                    onChange={handleInputChange}
                    label="Modo"
                  >
                    <MenuItem value="easy">Fácil (Rápido)</MenuItem>
                    <MenuItem value="basic">Básico (Con Alternativas)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Contenido</InputLabel>
                  <Select
                    name="type"
                    value={promptData.type}
                    onChange={handleInputChange}
                    label="Tipo de Contenido"
                  >
                    <MenuItem value="text">Texto</MenuItem>
                    <MenuItem value="article">Artículo</MenuItem>
                    <MenuItem value="code">Código</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  La API detecta y procesa automáticamente el idioma del texto ingresado
                </Typography>
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
              <Grid item xs={12}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  onClick={handleTest}
                  startIcon={<SmartToy />}
                  sx={{ height: '56px' }}
                >
                  Probar Funcionalidad (Simulado)
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
            Generando contenido con AI Humanizer...
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
                        <IconButton onClick={() => handleDownload(generatedContent.content, 'ai-humanizer-content.txt')}>
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
                    {generatedContent.metadata.palabras_originales && (
                      <>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <Psychology />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Palabras" 
                            secondary={`${generatedContent.metadata.palabras_originales} → ${generatedContent.metadata.palabras_humanizadas}`} 
                          />
                        </ListItem>
                      </>
                    )}
                    {generatedContent.metadata.mejor_probabilidad_ai !== undefined && (
                      <>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <SmartToy />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Probabilidad AI" 
                            secondary={`${(generatedContent.metadata.mejor_probabilidad_ai * 100).toFixed(1)}%`} 
                          />
                        </ListItem>
                      </>
                    )}
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
            
            {/* Mostrar alternativas si están disponibles */}
            {generatedContent.alternatives && generatedContent.alternatives.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Alternativas Generadas ({generatedContent.alternatives.length})
                    </Typography>
                    <List>
                      {generatedContent.alternatives.map((alt, index) => (
                        <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Box sx={{ width: '100%', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Probabilidad AI: {(alt.probabilidad_ai * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                              {alt.texto}
                            </Typography>
                          </Box>
                          <Box sx={{ alignSelf: 'flex-end' }}>
                            <Tooltip title="Copiar alternativa">
                              <IconButton size="small" onClick={() => handleCopy(alt.texto)}>
                                <ContentCopy />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Divider sx={{ width: '100%', mt: 1 }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default AIHumanizer; 