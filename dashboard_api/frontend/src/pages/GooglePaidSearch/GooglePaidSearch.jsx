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
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Autocomplete
} from '@mui/material';
import { 
  Search, 
  TrendingUp,
  Public, 
  Domain,
  BubbleChart,
  Assessment
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { selectAuth } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import { useAppDispatch } from '../../redux/hooks/reduxHooks';

// Lista de países para el selector
const countries = [
  { code: "us", name: "Estados Unidos" },
  { code: "es", name: "España" },
  { code: "mx", name: "México" },
  { code: "ar", name: "Argentina" },
  { code: "co", name: "Colombia" },
  { code: "cl", name: "Chile" },
  { code: "pe", name: "Perú" }
];

const GooglePaidSearch = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(selectAuth);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [competitorKeyword, setCompetitorKeyword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [keywordMetrics, setKeywordMetrics] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [adPerformance, setAdPerformance] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  const handlePaidSearchResults = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setError("Por favor ingresa un término de búsqueda");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada real a la API
      const response = await axios.get('/api/paid-search/search', {
        params: {
          query: searchQuery,
          country: selectedCountry
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSearchResults(response.data);
      
      // Notificar éxito
      dispatch(addNotification({
        message: 'Resultados de búsqueda obtenidos correctamente',
        type: 'success'
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener resultados de búsqueda");
      console.error("Error fetching paid search results:", err);
      
      // Notificar error
      dispatch(addNotification({
        message: err.response?.data?.message || "Error al obtener resultados de búsqueda",
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordMetrics = async (e) => {
    e.preventDefault();
    if (!keywordInput) {
      setError("Por favor ingresa al menos una palabra clave");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada real a la API
      const response = await axios.get('/api/paid-search/keywords', {
        params: {
          keywords: keywordInput,
          country: selectedCountry
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setKeywordMetrics(response.data);
      
      // Notificar éxito
      dispatch(addNotification({
        message: 'Métricas de palabras clave obtenidas correctamente',
        type: 'success'
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener métricas de palabras clave");
      console.error("Error fetching keyword metrics:", err);
      
      // Notificar error
      dispatch(addNotification({
        message: err.response?.data?.message || "Error al obtener métricas de palabras clave",
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitorSearch = async (e) => {
    e.preventDefault();
    if (!competitorKeyword) {
      setError("Por favor ingresa una palabra clave para buscar competidores");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada real a la API
      const response = await axios.get('/api/paid-search/competitors', {
        params: {
          keyword: competitorKeyword,
          country: selectedCountry
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCompetitors(response.data);
      
      // Notificar éxito
      dispatch(addNotification({
        message: 'Información de competidores obtenida correctamente',
        type: 'success'
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error al buscar competidores");
      console.error("Error fetching competitors:", err);
      
      // Notificar error
      dispatch(addNotification({
        message: err.response?.data?.message || "Error al buscar competidores",
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAdPerformance = async (e) => {
    e.preventDefault();
    if (!domainInput) {
      setError("Por favor ingresa un dominio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamada real a la API
      const response = await axios.get('/api/paid-search/ad-performance', {
        params: {
          domain: domainInput
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAdPerformance(response.data);
      
      // Notificar éxito
      dispatch(addNotification({
        message: 'Datos de rendimiento de anuncios obtenidos correctamente',
        type: 'success'
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener rendimiento de anuncios");
      console.error("Error fetching ad performance:", err);
      
      // Notificar error
      dispatch(addNotification({
        message: err.response?.data?.message || "Error al obtener rendimiento de anuncios",
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Google Paid Search
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza anuncios de pago en Google, métricas de palabras clave, competidores y rendimiento de campañas
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<Search />} label="Anuncios" />
          <Tab icon={<TrendingUp />} label="Palabras Clave" />
          <Tab icon={<BubbleChart />} label="Competidores" />
          <Tab icon={<Assessment />} label="Rendimiento" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handlePaidSearchResults}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Término de búsqueda"
                      placeholder="Ej: marketing digital"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      error={!!error && !searchQuery}
                      helperText={(!searchQuery && error) ? "Campo requerido" : ""}
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="country-select-label">País</InputLabel>
                      <Select
                        labelId="country-select-label"
                        value={selectedCountry}
                        label="País"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        startAdornment={<Public sx={{ mr: 1, ml: -0.5, color: 'action.active' }} />}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Buscar Anuncios'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && searchResults && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Anuncios para "{searchQuery}" en {countries.find(c => c.code === selectedCountry)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchResults.totalAds || searchResults.ads?.length || 0} anuncios encontrados • {searchResults.searchDate || new Date().toISOString().split('T')[0]}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              {searchResults.ads && searchResults.ads.map((ad, index) => (
                <Card key={index} sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Anuncio {ad.position || (index + 1)} • {ad.displayUrl}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {ad.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {ad.adText || ad.description}
                    </Typography>
                    {ad.extensions && (
                      <Box sx={{ mt: 1 }}>
                        {ad.extensions.map((ext, i) => (
                          <Chip
                            key={i}
                            label={ext}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
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
              <Box component="form" onSubmit={handleKeywordMetrics}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Palabras clave"
                      placeholder="Ej: marketing digital, sem, google ads"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      error={!!error && !keywordInput}
                      helperText={(!keywordInput && error) ? "Campo requerido" : "Separa múltiples palabras clave con comas"}
                      InputProps={{
                        startAdornment: <TrendingUp sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="country-select-label">País</InputLabel>
                      <Select
                        labelId="country-select-label"
                        value={selectedCountry}
                        label="País"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        startAdornment={<Public sx={{ mr: 1, ml: -0.5, color: 'action.active' }} />}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Obtener Métricas'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && keywordMetrics && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Métricas de palabras clave en {countries.find(c => c.code === selectedCountry)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Última actualización: {keywordMetrics.lastUpdated || new Date().toISOString().split('T')[0]}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              {keywordMetrics.keywords && keywordMetrics.keywords.map((kw, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          {kw.keyword}
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Competencia: <Chip label={kw.competition || 'Media'} size="small" color={
                              (kw.competition === "Alta" || kw.competition === "High") ? "error" :
                              (kw.competition === "Media" || kw.competition === "Medium") ? "warning" : "success"
                            } />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="h6" color="primary.main">
                          {(kw.searchVolume || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          búsquedas mensuales
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          ${(kw.cpc || 0).toFixed(2)} CPC
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

      {activeTab === 2 && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleCompetitorSearch}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Palabra clave"
                      placeholder="Ej: marketing digital"
                      value={competitorKeyword}
                      onChange={(e) => setCompetitorKeyword(e.target.value)}
                      error={!!error && !competitorKeyword}
                      helperText={(!competitorKeyword && error) ? "Campo requerido" : ""}
                      InputProps={{
                        startAdornment: <BubbleChart sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="country-select-label">País</InputLabel>
                      <Select
                        labelId="country-select-label"
                        value={selectedCountry}
                        label="País"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        startAdornment={<Public sx={{ mr: 1, ml: -0.5, color: 'action.active' }} />}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Buscar Competidores'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && competitors && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Competidores para "{competitorKeyword}" en {countries.find(c => c.code === selectedCountry)?.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>
              
              {competitors.competitors && competitors.competitors.map((comp, index) => (
                <Card key={index} sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                          {comp.name || comp.domain}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {comp.website || comp.url}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="h6" color="primary.main">
                          {comp.score || comp.adShare || index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {comp.scoreLabel || 'Puntuación'}
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

      {activeTab === 3 && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleAdPerformance}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={9}>
                    <TextField
                      fullWidth
                      label="Dominio"
                      placeholder="Ej: example.com"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      error={!!error && !domainInput}
                      helperText={(!domainInput && error) ? "Campo requerido" : ""}
                      InputProps={{
                        startAdornment: <Domain sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analizar Rendimiento'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && adPerformance && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Rendimiento de anuncios para {domainInput}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Período analizado: {adPerformance.period || 'Últimos 30 días'}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>
              
              {adPerformance.metrics && (
                <Grid container spacing={3}>
                  {Object.entries(adPerformance.metrics).map(([key, value], idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            {value.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default GooglePaidSearch;