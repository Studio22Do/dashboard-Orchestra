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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { 
  Search,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  BarChart
} from '@mui/icons-material';

const GoogleKeywordInsights = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keywordData, setKeywordData] = useState(null);
  const [endpoint, setEndpoint] = useState('keysuggest');
  const [location, setLocation] = useState('US');
  const [lang, setLang] = useState('en');
  const [minSearchVol, setMinSearchVol] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [num, setNum] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setKeywordData(null);
    try {
      let payload = {
        endpoint,
        lang,
      };
      if (endpoint === 'keysuggest' || endpoint === 'topkeys') {
        if (!keyword) {
          setError('Por favor ingresa una palabra clave para analizar');
          setLoading(false);
          return;
        }
        payload.keyword = keyword;
        payload.location = location;
      } else if (endpoint === 'urlkeysuggest') {
        if (!urlInput) {
          setError('Por favor ingresa una URL para analizar');
          setLoading(false);
          return;
        }
        payload.url = urlInput;
        payload.location = location;
      } else if (endpoint === 'globalkey') {
        if (!keyword) {
          setError('Por favor ingresa una palabra clave para analizar');
          setLoading(false);
          return;
        }
        payload.keyword = keyword;
      } else if (endpoint === 'globalurl') {
        if (!urlInput) {
          setError('Por favor ingresa una URL para analizar');
          setLoading(false);
          return;
        }
        payload.url = urlInput;
      }
      if (minSearchVol) payload.min_search_vol = minSearchVol;
      if (num && endpoint === 'topkeys') payload.num = num;
      const response = await fetch('/api/keyword-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Error al analizar la palabra clave');
        setLoading(false);
        return;
      }
      // Mapear la respuesta real a la UI (ejemplo para keysuggest)
      setKeywordData(data);
      console.log('Keyword Insight API response:', data);
    } catch (err) {
      setError(err.message || 'Error al analizar la palabra clave');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  // Calcular resumen principal
  let resumen = {
    searchVolume: '-',
    competition: '-',
    cpc: '-',
  };
  if (Array.isArray(keywordData) && keywordData.length > 0) {
    resumen.searchVolume = keywordData[0].search_volume ?? '-';
    resumen.competition = keywordData[0].competition_level ?? '-';
    // Calcular CPC promedio de los primeros 10 resultados
    const cpcs = keywordData.slice(0, 10).map(k => (k.cpc_min ?? 0) + (k.cpc_max ?? 0)).filter(v => v > 0);
    if (cpcs.length > 0) {
      resumen.cpc = `$${(cpcs.reduce((a, b) => a + b, 0) / (2 * cpcs.length)).toFixed(2)}`;
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Google Keyword Insights
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza palabras clave y obtén insights de búsqueda de Google
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Palabra clave"
                  placeholder="Ingresa una palabra clave"
                  variant="outlined"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Search color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analizar Palabra Clave'}
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
            Analizando palabra clave...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && keywordData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Volumen de Búsqueda
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {resumen.searchVolume}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Competencia
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={resumen.competition}
                      color={resumen.competition === 'HIGH' ? 'error' : resumen.competition === 'MEDIUM' ? 'warning' : 'success'}
                      sx={{ fontSize: '1.2rem', height: '2.5rem' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    CPC Promedio
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4">
                      {resumen.cpc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Palabras Clave Relacionadas
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Palabra Clave</TableCell>
                          <TableCell align="right">Volumen</TableCell>
                          <TableCell align="right">Competencia</TableCell>
                          <TableCell align="right">CPC Mín</TableCell>
                          <TableCell align="right">CPC Máx</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(keywordData) && keywordData.slice(0, 5).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.keyword}</TableCell>
                            <TableCell align="right">{item.search_volume ?? '-'}</TableCell>
                            <TableCell align="right">{item.competition_level ?? '-'}</TableCell>
                            <TableCell align="right">{item.cpc_min !== undefined ? `$${item.cpc_min}` : '-'}</TableCell>
                            <TableCell align="right">{item.cpc_max !== undefined ? `$${item.cpc_max}` : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default GoogleKeywordInsights; 