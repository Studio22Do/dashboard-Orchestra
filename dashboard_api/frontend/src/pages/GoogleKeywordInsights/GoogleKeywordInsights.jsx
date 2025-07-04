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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Tooltip,
  ListSubheader,
  InputAdornment
} from '@mui/material';
import { 
  Search,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  BarChart
} from '@mui/icons-material';

// Definición de países por región
const COUNTRIES = {
  EUROPA: [
    { code: 'ES', name: 'España' },
    { code: 'FR', name: 'Francia' },
    { code: 'IT', name: 'Italia' }
  ],
  LATINOAMERICA: {
    SUDAMERICA: [
      { code: 'AR', name: 'Argentina' },
      { code: 'BO', name: 'Bolivia' },
      { code: 'BR', name: 'Brasil' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'EC', name: 'Ecuador' },
      { code: 'GY', name: 'Guyana' },
      { code: 'PY', name: 'Paraguay' },
      { code: 'PE', name: 'Perú' },
      { code: 'SR', name: 'Surinam' },
      { code: 'UY', name: 'Uruguay' },
      { code: 'VE', name: 'Venezuela' }
    ],
    CENTROAMERICA: [
      { code: 'BZ', name: 'Belice' },
      { code: 'CR', name: 'Costa Rica' },
      { code: 'SV', name: 'El Salvador' },
      { code: 'GT', name: 'Guatemala' },
      { code: 'HN', name: 'Honduras' },
      { code: 'NI', name: 'Nicaragua' },
      { code: 'PA', name: 'Panamá' },
      { code: 'CU', name: 'Cuba' },
      { code: 'DO', name: 'República Dominicana' },
      { code: 'PR', name: 'Puerto Rico' }
    ]
  },
  NORTEAMERICA: [
    { code: 'US', name: 'Estados Unidos' },
    { code: 'CA', name: 'Canadá' },
    { code: 'MX', name: 'México' }
  ]
};

const GoogleKeywordInsights = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keywordData, setKeywordData] = useState(null);
  const [endpoint, setEndpoint] = useState('keysuggest');
  const [location, setLocation] = useState('ES');
  const [lang, setLang] = useState('es');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [countrySearch, setCountrySearch] = useState('');

  // Filtrar países basado en la búsqueda
  const getFilteredCountries = () => {
    const searchTerm = countrySearch.toLowerCase();
    let filteredItems = [];

    // Función auxiliar para agregar países filtrados
    const addFilteredCountries = (countries, region, subregion = null) => {
      countries.forEach(country => {
        if (country.name.toLowerCase().includes(searchTerm)) {
          filteredItems.push({
            ...country,
            region,
            subregion
          });
        }
      });
    };

    // Procesar Europa y Norteamérica
    Object.entries(COUNTRIES).forEach(([region, content]) => {
      if (region !== 'LATINOAMERICA') {
        addFilteredCountries(content, region);
      }
    });

    // Procesar Latinoamérica (tiene subregiones)
    Object.entries(COUNTRIES.LATINOAMERICA).forEach(([subregion, countries]) => {
      addFilteredCountries(countries, 'LATINOAMERICA', subregion);
    });

    return filteredItems;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setKeywordData(null);
    setPage(1);
    
    try {
      if (!keyword) {
        throw new Error('Por favor ingresa una palabra clave para analizar');
      }

      const payload = {
        endpoint,
        lang,
        location,
        keyword
      };
      
      const response = await fetch('/api/keyword-insight/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar la palabra clave');
      }

      if (!data || !Array.isArray(data)) {
        throw new Error('Formato de respuesta inválido');
      }

      const mappedData = data.map(item => ({
        keyword: item.text || '-',
        search_volume: item.volume || 0,
        competition_level: item.competition_level || 'UNSPECIFIED',
        competition_index: item.competition_index || 0,
        cpc_min: item.low_bid || 0,
        cpc_max: item.high_bid || 0,
        trend: item.trend || 0
      }));

      setKeywordData(mappedData);
    } catch (err) {
      console.error('Error en la llamada:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompetitionColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp color="success" />;
    if (trend < 0) return <TrendingDown color="error" />;
    return <TrendingFlat color="info" />;
  };

  // Calcular resumen principal
  const resumen = {
    searchVolume: '-',
    competition: '-',
    cpc: '-',
  };

  if (Array.isArray(keywordData) && keywordData.length > 0) {
    const primerResultado = keywordData[0];
    resumen.searchVolume = primerResultado.search_volume.toLocaleString() || '-';
    resumen.competition = primerResultado.competition_level || '-';
    resumen.cpc = primerResultado.cpc_min && primerResultado.cpc_max ? 
      `$${((primerResultado.cpc_min + primerResultado.cpc_max) / 2).toFixed(2)}` : '-';
  }

  // Paginación
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = keywordData?.slice(startIndex, endIndex) || [];
  const totalPages = keywordData ? Math.ceil(keywordData.length / itemsPerPage) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Google Keyword Insights
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Analiza palabras clave y obtén insights de búsqueda de Google
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="Palabra clave"
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ flex: '1 1 300px' }}
            InputProps={{
              startAdornment: (
                <Search color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ubicación</InputLabel>
            <Select
              value={location}
              label="Ubicación"
              onChange={(e) => setLocation(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400
                  }
                }
              }}
            >
              <TextField
                size="small"
                placeholder="Buscar país..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                sx={{ m: 1, width: 'calc(100% - 16px)' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {!countrySearch ? (
                <>
                  <ListSubheader 
                    sx={{ 
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      lineHeight: '40px',
                      borderLeft: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    EUROPA
                  </ListSubheader>
                  {COUNTRIES.EUROPA.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}

                  <ListSubheader 
                    sx={{ 
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      lineHeight: '40px',
                      mt: 1,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    LATINOAMÉRICA - SUDAMÉRICA
                  </ListSubheader>
                  {COUNTRIES.LATINOAMERICA.SUDAMERICA.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}

                  <ListSubheader 
                    sx={{ 
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      lineHeight: '40px',
                      mt: 1,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    LATINOAMÉRICA - CENTROAMÉRICA Y CARIBE
                  </ListSubheader>
                  {COUNTRIES.LATINOAMERICA.CENTROAMERICA.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}

                  <ListSubheader 
                    sx={{ 
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                      lineHeight: '40px',
                      mt: 1,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    NORTEAMÉRICA
                  </ListSubheader>
                  {COUNTRIES.NORTEAMERICA.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </>
              ) : (
                getFilteredCountries().map(country => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name} 
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        ml: 1,
                        color: 'primary.main',
                        fontWeight: 'medium'
                      }}
                    >
                      ({country.subregion || country.region})
                    </Typography>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              height: '56px',
              flex: '0 0 auto',
              minWidth: '120px'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analizar'}
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && keywordData && Array.isArray(keywordData) && keywordData.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Competencia
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={resumen.competition}
                      color={getCompetitionColor(resumen.competition)}
                      sx={{ fontSize: '1.2rem', height: '2.5rem' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Palabras Clave Relacionadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mostrando {startIndex + 1}-{Math.min(endIndex, keywordData.length)} de {keywordData.length} resultados
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Palabra Clave</TableCell>
                          <TableCell align="right">Volumen</TableCell>
                          <TableCell align="center">Competencia</TableCell>
                          <TableCell align="right">CPC Mín</TableCell>
                          <TableCell align="right">CPC Máx</TableCell>
                          <TableCell align="center">Tendencia</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.keyword}</TableCell>
                            <TableCell align="right">{item.search_volume.toLocaleString()}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={item.competition_level}
                                color={getCompetitionColor(item.competition_level)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">${item.cpc_min.toFixed(2)}</TableCell>
                            <TableCell align="right">${item.cpc_max.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <Tooltip title={`${item.trend.toFixed(2)}%`}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  {getTrendIcon(item.trend)}
                                </Box>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(e, newPage) => setPage(newPage)}
                        color="primary"
                      />
                    </Box>
                  )}
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