import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Tabs,
  Tab,
  Skeleton,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  TrendingUp, 
  Search, 
  Public, 
  CalendarToday, 
  BarChart 
} from '@mui/icons-material';

// Base URL de la API
const API_URL = 'http://localhost:5000/api';

// Lista de países para el selector
const countries = [
  { code: "US", name: "Estados Unidos" },
  { code: "ES", name: "España" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" },
  { code: "PE", name: "Perú" }
];

const GoogleTrends = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('US');
  const [trendingData, setTrendingData] = useState(null);
  const [interestData, setInterestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  const handleTrendingSearches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor inicia sesión.');
      }
      
      // Configurar headers con token de autenticación
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Obtener tendencias
      const response = await axios.get(`${API_URL}/trends/trending-searches?geo=${country}`, config);
      
      setTrendingData(response.data);
    } catch (err) {
      console.error('Error fetching Google Trends data:', err);
      setError(err.response?.data?.error || err.message || 'Error al obtener datos de tendencias');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInterest = async (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor inicia sesión.');
      }
      
      // Configurar headers con token de autenticación
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Obtener datos de interés a lo largo del tiempo
      const response = await axios.get(`${API_URL}/trends/interest-over-time?keyword=${encodeURIComponent(searchTerm)}&geo=${country}`, config);
      
      setInterestData(response.data);
    } catch (err) {
      console.error('Error fetching interest over time data:', err);
      setError(err.response?.data?.error || err.message || 'Error al obtener datos de interés');
    } finally {
      setLoading(false);
    }
  };

  // Cargar tendencias al montar el componente
  useEffect(() => {
    if (activeTab === 0 && !trendingData && !loading) {
      handleTrendingSearches();
    }
  }, [activeTab]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Google Trends
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explora tendencias de búsqueda en Google, términos populares y patrones de interés a lo largo del tiempo
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<TrendingUp />} label="Tendencias de Búsqueda" />
          <Tab icon={<BarChart />} label="Interés a lo Largo del Tiempo" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth>
                    <InputLabel id="country-select-label">País</InputLabel>
                    <Select
                      labelId="country-select-label"
                      value={country}
                      label="País"
                      onChange={(e) => setCountry(e.target.value)}
                      startAdornment={<Public sx={{ mr: 1, ml: -0.5 }} />}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleTrendingSearches}
                    disabled={loading}
                    sx={{ height: '56px' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Ver Tendencias'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ mb: 4 }}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && trendingData && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1 }} color="primary" />
                <Typography variant="subtitle1">
                  Tendencias de búsqueda para {countries.find(c => c.code === country)?.name}
                </Typography>
              </Box>
              
              {trendingData.items ? (
                trendingData.items.map((trend, index) => (
                  <Card key={index} sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="h6" component="div">
                            {trend.title || trend.term || trend.query}
                          </Typography>
                          {trend.relatedQueries && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Búsquedas relacionadas: {Array.isArray(trend.relatedQueries) ? trend.relatedQueries.join(", ") : trend.relatedQueries}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography variant="h6" color="primary.main">
                            {trend.traffic || trend.formattedTraffic || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            búsquedas
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert severity="info">No se encontraron tendencias para la región seleccionada.</Alert>
              )}
            </Paper>
          )}
        </>
      )}

      {activeTab === 1 && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSearchInterest}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Término de búsqueda"
                      placeholder="Ej: 'inteligencia artificial'"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      error={!!error && !searchTerm}
                      helperText={!searchTerm && error ? error : ''}
                      InputProps={{
                        startAdornment: (
                          <Search sx={{ mr: 1, color: 'action.active' }} />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="interest-country-select-label">País</InputLabel>
                      <Select
                        labelId="interest-country-select-label"
                        value={country}
                        label="País"
                        onChange={(e) => setCountry(e.target.value)}
                        startAdornment={<Public sx={{ mr: 1, ml: -0.5 }} />}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analizar Interés'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ mb: 4 }}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && interestData && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Interés a lo largo del tiempo para: {searchTerm}
              </Typography>
              
              {interestData.timelineData ? (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info">
                    Datos recibidos correctamente. Esta visualización se mejorará con gráficos interactivos en próximas actualizaciones.
                  </Alert>
                  
                  <Box sx={{ mt: 3 }}>
                    {interestData.timelineData.slice(0, 5).map((point, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Grid container>
                            <Grid item xs={4}>
                              <Typography variant="body1">
                                {point.formattedTime || point.time}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body1" color="primary.main">
                                Valor: {point.value || (point.value === 0 ? '0' : 'N/A')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                    <Typography variant="body2" align="center" color="text.secondary">
                      Mostrando 5 de {interestData.timelineData.length} puntos de datos
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">No hay datos disponibles para el término y región seleccionados.</Alert>
              )}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default GoogleTrends; 