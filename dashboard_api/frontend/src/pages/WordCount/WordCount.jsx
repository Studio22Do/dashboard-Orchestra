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
  Tooltip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  TextFields,
  Timer,
  Assessment,
  Speed
} from '@mui/icons-material';
import axios from 'axios';

const WordCount = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor ingresa un texto para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const words = text.trim().split(/\s+/);
      const characters = text.length;
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
      const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
      
      // Calcular tiempo de lectura (palabras por minuto)
      const wordsPerMinute = 200;
      const readingTime = Math.ceil(words.length / wordsPerMinute);
      
      // Calcular densidad de palabras clave
      const wordFrequency = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
        if (cleanWord.length > 3) { // Ignorar palabras cortas
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });
      
      const topKeywords = Object.entries(wordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({
          word,
          count,
          percentage: ((count / words.length) * 100).toFixed(1)
        }));

      setAnalysis({
        basic: {
          words: words.length,
          characters,
          sentences: sentences.length,
          paragraphs: paragraphs.length,
          uniqueWords,
          readingTime
        },
        keywords: topKeywords,
        readability: {
          averageWordsPerSentence: (words.length / sentences.length).toFixed(1),
          averageCharactersPerWord: (characters / words.length).toFixed(1),
          uniqueWordPercentage: ((uniqueWords / words.length) * 100).toFixed(1)
        }
      });
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError(err.message || 'Error al analizar el texto');
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

  const handleExtractFromUrl = async () => {
    if (!url.trim()) {
      setError('Por favor ingresa una URL válida');
      return;
    }
    setExtracting(true);
    setError(null);
    try {
      const response = await axios.post('/api/text-extract/extract', { url });
      if (response.data && response.data.text) {
        setText(response.data.text);
      } else if (typeof response.data === 'string') {
        setText(response.data);
      } else {
        setError('No se pudo extraer el texto de la URL');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al extraer el texto');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Word Count
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza y cuenta palabras, caracteres y más en tu texto
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Extraer texto desde URL"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Pega aquí la URL de un artículo, blog, etc."
                  InputProps={{
                    startAdornment: (
                      <TextFields color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleExtractFromUrl}
                  disabled={extracting || loading}
                  sx={{ height: '56px' }}
                >
                  {extracting ? <CircularProgress size={24} /> : 'Extraer Texto'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Texto a Analizar"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  multiline
                  rows={6}
                  required
                  InputProps={{
                    startAdornment: (
                      <TextFields color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Analizar Texto'}
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
            Analizando texto...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && analysis && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Métricas Básicas
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Palabras" 
                        secondary={analysis.basic.words.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Caracteres" 
                        secondary={analysis.basic.characters.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Oraciones" 
                        secondary={analysis.basic.sentences.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Párrafos" 
                        secondary={analysis.basic.paragraphs.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Palabras Únicas" 
                        secondary={analysis.basic.uniqueWords.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Timer />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tiempo de Lectura" 
                        secondary={`${analysis.basic.readingTime} minuto${analysis.basic.readingTime !== 1 ? 's' : ''}`} 
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
                    Palabras Clave Principales
                  </Typography>
                  <List>
                    {analysis.keywords.map((keyword, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Assessment />
                        </ListItemIcon>
                        <ListItemText 
                          primary={keyword.word}
                          secondary={`${keyword.count} ocurrencias (${keyword.percentage}%)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Métricas de Legibilidad
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Promedio de Palabras por Oración" 
                        secondary={analysis.readability.averageWordsPerSentence} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Promedio de Caracteres por Palabra" 
                        secondary={analysis.readability.averageCharactersPerWord} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Porcentaje de Palabras Únicas" 
                        secondary={`${analysis.readability.uniqueWordPercentage}%`} 
                      />
                    </ListItem>
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

export default WordCount; 