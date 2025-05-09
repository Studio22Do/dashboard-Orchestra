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
  Search,
  Title,
  Description,
  Tag,
  Language
} from '@mui/icons-material';

const SeoMastermind = () => {
  const [seoData, setSeoData] = useState({
    topic: '',
    targetKeyword: '',
    language: 'es',
    tone: 'professional',
    industry: '',
    targetAudience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!seoData.topic || !seoData.targetKeyword) {
      setError('Por favor completa los campos requeridos');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedContent({
        title: `${seoData.topic} - Guía Completa y Actualizada [${new Date().getFullYear()}]`,
        metaDescription: `Descubre todo sobre ${seoData.topic}. Aprende las mejores prácticas, consejos expertos y estrategias actualizadas para dominar ${seoData.targetKeyword}.`,
        h1: `Guía Definitiva: ${seoData.topic}`,
        keywords: [
          seoData.targetKeyword,
          `${seoData.topic} guía`,
          `${seoData.topic} tutorial`,
          `${seoData.topic} consejos`,
          `${seoData.topic} mejores prácticas`,
          `${seoData.topic} ${new Date().getFullYear()}`
        ],
        relatedKeywords: [
          { keyword: 'keyword 1', volume: '12.5K', difficulty: 'Media' },
          { keyword: 'keyword 2', volume: '8.2K', difficulty: 'Baja' },
          { keyword: 'keyword 3', volume: '5.1K', difficulty: 'Alta' },
          { keyword: 'keyword 4', volume: '3.8K', difficulty: 'Media' },
          { keyword: 'keyword 5', volume: '2.9K', difficulty: 'Baja' }
        ],
        contentStructure: [
          'Introducción',
          '¿Qué es ' + seoData.topic + '?',
          'Beneficios principales',
          'Mejores prácticas',
          'Consejos expertos',
          'Preguntas frecuentes',
          'Conclusión'
        ],
        seoRecommendations: [
          'Optimizar la densidad de palabras clave',
          'Incluir enlaces internos relevantes',
          'Agregar imágenes con alt text',
          'Estructurar el contenido con H2 y H3',
          'Incluir una tabla de contenidos'
        ]
      });
    } catch (err) {
      console.error('Error generating SEO content:', err);
      setError(err.message || 'Error al generar el contenido SEO');
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
        SEO Mastermind – AI Keyword, Meta & Title Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera contenido SEO optimizado usando IA
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tema Principal"
                  name="topic"
                  value={seoData.topic}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <Search color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Palabra Clave Objetivo"
                  name="targetKeyword"
                  value={seoData.targetKeyword}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <Tag color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    name="language"
                    value={seoData.language}
                    onChange={handleInputChange}
                    label="Idioma"
                  >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tono</InputLabel>
                  <Select
                    name="tone"
                    value={seoData.tone}
                    onChange={handleInputChange}
                    label="Tono"
                  >
                    <MenuItem value="professional">Profesional</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="technical">Técnico</MenuItem>
                    <MenuItem value="friendly">Amigable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industria"
                  name="industry"
                  value={seoData.industry}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <Language color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Audiencia Objetivo"
                  name="targetAudience"
                  value={seoData.targetAudience}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <Language color="action" sx={{ mr: 1 }} />
                    ),
                  }}
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
                  {loading ? <CircularProgress size={24} /> : 'Generar Contenido SEO'}
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
            Generando contenido SEO optimizado...
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
                      Título SEO
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.title)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.title, 'titulo-seo.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    {generatedContent.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Meta Descripción
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.metaDescription)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.metaDescription, 'meta-descripcion.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    {generatedContent.metaDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Palabras Clave Principales
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {generatedContent.keywords.map((keyword, index) => (
                      <Chip key={index} label={keyword} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Palabras Clave Relacionadas
                  </Typography>
                  <List>
                    {generatedContent.relatedKeywords.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={item.keyword}
                          secondary={`Volumen: ${item.volume} • Dificultad: ${item.difficulty}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estructura del Contenido
                  </Typography>
                  <List>
                    {generatedContent.contentStructure.map((section, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Title />
                        </ListItemIcon>
                        <ListItemText primary={section} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recomendaciones SEO
                  </Typography>
                  <List>
                    {generatedContent.seoRecommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
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

export default SeoMastermind; 