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
  Chip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  TextFields,
  Timer,
  Assessment,
  Speed,
  Star
} from '@mui/icons-material';
import axios from 'axios';
import { APP_CONFIG } from '../../config/constants';

const WordCount = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;

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
      await new Promise(resolve => setTimeout(resolve, 300));

      // Tokenización básica (incluye acentos)
      const wordMatches = text.toLowerCase().match(/[\p{L}\p{M}']+/gu) || [];
      const words = wordMatches.filter(Boolean);
      const characters = text.length;
      const sentences = (text.match(/[^.!?\n]+[.!?\n]+/g) || []).map(s => s.trim()).filter(Boolean);
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
      const uniqueWords = new Set(words).size;

      // Tiempo de lectura (palabras por minuto)
      const wordsPerMinute = 200;
      const readingTime = Math.ceil((words.length || 0) / wordsPerMinute);

      // Conteo aproximado de sílabas (agrupaciones de vocales)
      const vowelsRe = /[aeiouáéíóúü]+/gi;
      const countSyllablesInWord = (w) => {
        const matches = (w.normalize('NFC').match(vowelsRe) || []).length;
        return Math.max(matches, 1);
      };
      const totalSyllables = words.reduce((sum, w) => sum + countSyllablesInWord(w), 0);

      const wordsCount = Math.max(words.length, 1);
      const sentencesCount = Math.max(sentences.length || 1, 1);
      const syllablesPerWord = totalSyllables / wordsCount;
      const wordsPerSentence = wordsCount / sentencesCount;

      // Índices de legibilidad en español
      const fernandezHuerta = Number((206.84 - 0.60 * (syllablesPerWord * 100) - 1.02 * wordsPerSentence).toFixed(2));
      const szigrisztPazos = Number((206.835 - 62.3 * syllablesPerWord - wordsPerSentence).toFixed(2));
      const gutierrezPolini = Number((95.2 - 9.7 * syllablesPerWord - 0.35 * wordsPerSentence).toFixed(2));

      // Detección muy simple de idioma (ES) por stopwords
      const esStop = new Set(['de','la','que','el','en','y','a','los','se','del','las','por','un','para','con','no','una','su','al','lo','como','más','pero','sus','le','ya','o','fue','este','ha','sí','porque','esta','son','entre','cuando','muy','sin','sobre','también','me','hasta','hay','donde','quien','desde','todo','nos','durante','todos','uno','les','ni','contra','otros','ese','eso','ante','ellos','e','esto','mi','antes','algunos','qué','unos','yo','otro','otras','otra','él']);
      const stopCount = words.reduce((acc, w) => acc + (esStop.has(w) ? 1 : 0), 0);
      const stopRatio = words.length ? stopCount / words.length : 0;
      const detectedLang = stopRatio > 0.2 ? 'es' : 'desconocido';

      // Densidad de palabras clave y n-gramas (ignorando stopwords y palabras cortas)
      const validForKeywords = (w) => w.length > 3 && !esStop.has(w);
      const filtered = words.filter(validForKeywords);
      const freq = {};
      filtered.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
      const topKeywords = Object.entries(freq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({ word, count, percentage: ((count / Math.max(filtered.length, 1)) * 100).toFixed(1) }));

      const buildNgrams = (arr, n) => {
        const map = {};
        for (let i = 0; i <= arr.length - n; i += 1) {
          const slice = arr.slice(i, i + n);
          // descartar n-gramas si todos son stopwords
          if (slice.every(w => esStop.has(w))) continue;
          const key = slice.join(' ');
          map[key] = (map[key] || 0) + 1;
        }
        return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 5)
          .map(([gram, count]) => ({ gram, count }));
      };
      const ngrams = {
        unigrams: buildNgrams(filtered, 1).map(({ gram, count }) => ({ gram, count })),
        bigrams: buildNgrams(filtered, 2),
        trigrams: buildNgrams(filtered, 3)
      };

      // Oraciones cortas y largas
      const sentenceLengths = sentences.map(s => (s.toLowerCase().match(/[\p{L}\p{M}']+/gu) || []).length);
      const shortCount = sentenceLengths.filter(l => l > 0 && l < 10).length;
      const longCount = sentenceLengths.filter(l => l > 25).length;
      const avgSentenceLen = sentenceLengths.length ? (sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length) : 0;

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
        },
        readabilityES: {
          fernandezHuerta,
          szigrisztPazos,
          gutierrezPolini,
          syllablesPerWord: Number(syllablesPerWord.toFixed(2)),
          wordsPerSentence: Number(wordsPerSentence.toFixed(2))
        },
        language: {
          detected: detectedLang,
          stopwordRatio: Number((stopRatio * 100).toFixed(1))
        },
        ngrams,
        sentencesInfo: {
          averageLength: Number(avgSentenceLen.toFixed(1)),
          shortCount,
          longCount
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
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/text-extract/extract`, { url }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
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
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Word Count
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Analiza y cuenta palabras, caracteres y más en tu texto
        </Typography>
        <Chip 
          icon={<TextFields />} 
          label="Analiza texto desde URL o contenido directo" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip 
          icon={<Star />} 
          label="Costo: 2 puntos por análisis" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

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
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fernández‑Huerta" 
                        secondary={analysis.readabilityES.fernandezHuerta} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Szigriszt‑Pazos" 
                        secondary={analysis.readabilityES.szigrisztPazos} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Gutiérrez‑Polini" 
                        secondary={analysis.readabilityES.gutierrezPolini} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Speed />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sílabas por Palabra / Palabras por Oración" 
                        secondary={`${analysis.readabilityES.syllablesPerWord} / ${analysis.readabilityES.wordsPerSentence}`} 
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
                    N‑gramas frecuentes
                  </Typography>
                  <Typography variant="subtitle2">Bigrams</Typography>
                  <List>
                    {analysis.ngrams.bigrams.map((b, idx) => (
                      <ListItem key={idx}><ListItemText primary={b.gram} secondary={`${b.count} ocurrencias`} /></ListItem>
                    ))}
                  </List>
                  <Divider />
                  <Typography variant="subtitle2">Trigrams</Typography>
                  <List>
                    {analysis.ngrams.trigrams.map((t, idx) => (
                      <ListItem key={idx}><ListItemText primary={t.gram} secondary={`${t.count} ocurrencias`} /></ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Oraciones
                  </Typography>
                  <List>
                    <ListItem><ListItemText primary="Longitud promedio" secondary={analysis.sentencesInfo.averageLength} /></ListItem>
                    <Divider />
                    <ListItem><ListItemText primary="Oraciones cortas (&lt;10 palabras)" secondary={analysis.sentencesInfo.shortCount} /></ListItem>
                    <Divider />
                    <ListItem><ListItemText primary="Oraciones largas (&gt;25 palabras)" secondary={analysis.sentencesInfo.longCount} /></ListItem>
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