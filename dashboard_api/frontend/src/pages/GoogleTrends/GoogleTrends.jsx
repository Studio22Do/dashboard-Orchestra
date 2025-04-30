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

// Datos simulados de respuesta de la API para trending searches
const mockTrendingSearches = {
  date: "2023-09-15",
  trendingSearches: [
    { title: "iPhone 15", formattedTraffic: "500K+", relatedQueries: ["iPhone 15 Pro", "Apple Event", "iPhone 15 price"] },
    { title: "Champions League", formattedTraffic: "200K+", relatedQueries: ["UCL results", "Champions League fixtures", "Real Madrid"] },
    { title: "Taylor Swift", formattedTraffic: "150K+", relatedQueries: ["Taylor Swift tour", "Taylor Swift new album", "Taylor Swift tickets"] },
    { title: "COVID-19 vaccine", formattedTraffic: "100K+", relatedQueries: ["booster shot", "vaccine side effects", "vaccination center near me"] },
    { title: "Bitcoin price", formattedTraffic: "50K+", relatedQueries: ["cryptocurrency", "ethereum", "crypto market"] }
  ]
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTrendingSearches = () => {
    setLoading(true);
    setError(null);
    
    // Simulando llamada a la API
    setTimeout(() => {
      setTrendingData(mockTrendingSearches);
      setLoading(false);
    }, 1500);
    
    // Aquí iría la llamada real a la API
    // const fetchTrendingSearches = async () => {
    //   try {
    //     const response = await fetch(`/api/trends/trending-searches?geo=${country}`, {
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       }
    //     });
    //     
    //     if (!response.ok) {
    //       throw new Error('Error al obtener tendencias');
    //     }
    //     
    //     const data = await response.json();
    //     setTrendingData(data);
    //   } catch (error) {
    //     setError(error.message || 'Error al obtener datos de tendencias');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchTrendingSearches();
  };

  const handleSearchInterest = (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Aquí iría la llamada real a la API para obtener interés a lo largo del tiempo
    // ...
    
    // Por ahora solo simularemos que se está cargando
    setTimeout(() => {
      setLoading(false);
      // Y mostraremos un mensaje de que aún no está implementado
      setError('Esta funcionalidad estará disponible próximamente');
    }, 1500);
  };

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
                  Tendencias de búsqueda para {countries.find(c => c.code === country)?.name} - {trendingData.date}
                </Typography>
              </Box>
              
              {trendingData.trendingSearches.map((trend, index) => (
                <Card key={index} sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" component="div">
                          {trend.title}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Búsquedas relacionadas: {trend.relatedQueries.join(", ")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" color="primary.main">
                          {trend.formattedTraffic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          búsquedas
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
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
                    <FormControl fullWidth>
                      <InputLabel id="interest-country-select-label">País</InputLabel>
                      <Select
                        labelId="interest-country-select-label"
                        value={country}
                        label="País"
                        onChange={(e) => setCountry(e.target.value)}
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

          {/* Aquí iría la visualización del interés a lo largo del tiempo */}
        </>
      )}
    </Container>
  );
};

export default GoogleTrends; 