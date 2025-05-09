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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!keyword) {
      setError('Por favor ingresa una palabra clave para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      setKeywordData({
        searchVolume: '12.5K',
        competition: 'Alto',
        cpc: '$2.50',
        trend: 'up',
        relatedKeywords: [
          { keyword: 'keyword 1', volume: '8.2K', trend: 'up' },
          { keyword: 'keyword 2', volume: '5.1K', trend: 'down' },
          { keyword: 'keyword 3', volume: '3.8K', trend: 'stable' },
          { keyword: 'keyword 4', volume: '2.9K', trend: 'up' },
          { keyword: 'keyword 5', volume: '1.5K', trend: 'down' }
        ],
        monthlyTrend: [
          { month: 'Ene', volume: 12000 },
          { month: 'Feb', volume: 11500 },
          { month: 'Mar', volume: 13000 },
          { month: 'Abr', volume: 12500 },
          { month: 'May', volume: 14000 },
          { month: 'Jun', volume: 13500 }
        ]
      });
    } catch (err) {
      console.error('Error analyzing keyword:', err);
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
                      {keywordData.searchVolume}
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
                      label={keywordData.competition}
                      color={keywordData.competition === 'Alto' ? 'error' : 'success'}
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
                      {keywordData.cpc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tendencia
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(keywordData.trend)}
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
                          <TableCell align="right">Tendencia</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {keywordData.relatedKeywords.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.keyword}</TableCell>
                            <TableCell align="right">{item.volume}</TableCell>
                            <TableCell align="right">
                              {getTrendIcon(item.trend)}
                            </TableCell>
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