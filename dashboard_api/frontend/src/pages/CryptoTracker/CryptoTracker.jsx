import { useState } from 'react';
import axiosInstance from '../../config/axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  ShowChart,
  AccountBalance,
  SwapHoriz,
  Schedule,
  Info,
  AttachMoney,
  Timeline,
  BarChart,
  TrendingFlat
} from '@mui/icons-material';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`crypto-tabpanel-${index}`}
    aria-labelledby={`crypto-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const CryptoTracker = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const [limit, setLimit] = useState('50');
  const [page, setPage] = useState('1');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${API_URL}/${API_MODE}/crypto-tracker`;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setData(null);
  };

  const handleRequest = async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axiosInstance.post(`${API_BASE_URL}${endpoint}`, params);
      console.log('Respuesta completa:', response.data);
      console.log('Estructura de data:', response.data?.data);
      console.log('Tokens encontrados:', response.data?.data?.length);
      setData(response.data);
    } catch (err) {
      console.error('Error en Crypto Tracker:', err);
      setError(err.response?.data?.error || err.message || 'Error al obtener datos');
    } finally {
      setLoading(false);
    }
  };

  // Funciones de formateo
  const formatPrice = (price) => {
    if (!price || price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return 'N/A';
    const value = parseFloat(percentage);
    if (isNaN(value)) return 'N/A';
    const color = value > 0 ? 'success.main' : value < 0 ? 'error.main' : 'text.secondary';
    return (
      <Typography color={color} variant="body2">
        {value > 0 ? '+' : ''}{value.toFixed(2)}%
      </Typography>
    );
  };

  const formatVolume = (volume) => {
    if (!volume || volume === 0) return 'N/A';
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toFixed(2);
  };

  // Renderizado de cada tab
  const renderDailyPrices = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Precios Diarios de Criptomonedas
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Límite"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Página"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={() => handleRequest('/daily-ohlcv', { limit, page })}
            startIcon={<ShowChart />}
            fullWidth
          >
            Obtener Precios Diarios
          </Button>
        </Grid>
      </Grid>
      
      {data && data.data && data.data.data && Array.isArray(data.data.data) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Símbolo</TableCell>
                <TableCell>Precio Actual</TableCell>
                <TableCell>Cambio 24h</TableCell>
                <TableCell>Volumen 24h</TableCell>
                <TableCell>Máximo 24h</TableCell>
                <TableCell>Mínimo 24h</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.data.map((token, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {token.TOKEN_SYMBOL || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatPrice(token.CLOSE)}</TableCell>
                  <TableCell>
                    {token.OPEN && token.CLOSE ? 
                      formatPercentage(((token.CLOSE - token.OPEN) / token.OPEN) * 100) : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell>{formatVolume(token.VOLUME)}</TableCell>
                  <TableCell>{formatPrice(token.HIGH)}</TableCell>
                  <TableCell>{formatPrice(token.LOW)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderHourlyData = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Datos por Hora (OHLCV)
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Límite"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Página"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={() => handleRequest('/hourly-ohlcv', { limit, page })}
            startIcon={<Timeline />}
            fullWidth
          >
            Obtener Datos por Hora
          </Button>
        </Grid>
      </Grid>
      
      {data && data.data && data.data.data && Array.isArray(data.data.data) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Símbolo</TableCell>
                <TableCell>Precio Actual</TableCell>
                <TableCell>Cambio 1h</TableCell>
                <TableCell>Volumen 1h</TableCell>
                <TableCell>Máximo 1h</TableCell>
                <TableCell>Mínimo 1h</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.data.map((token, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {token.TOKEN_SYMBOL || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatPrice(token.CLOSE)}</TableCell>
                  <TableCell>
                    {token.OPEN && token.CLOSE ? 
                      formatPercentage(((token.CLOSE - token.OPEN) / token.OPEN) * 100) : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell>{formatVolume(token.VOLUME)}</TableCell>
                  <TableCell>{formatPrice(token.HIGH)}</TableCell>
                  <TableCell>{formatPrice(token.LOW)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderMarketOverview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen del Mercado
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleRequest('/market-overview')}
        startIcon={<BarChart />}
        sx={{ mb: 3 }}
      >
        Obtener Resumen del Mercado
      </Button>
      
      {data && data.data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Top Ganadores 24h
                </Typography>
                <List>
                  {data.data.top_gainers && data.data.top_gainers.map((token, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <TrendingUp color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={token.symbol}
                        secondary={`${formatPrice(token.current_price)} (+${token.change_24h.toFixed(2)}%)`}
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
                <Typography variant="h6" color="error.main" gutterBottom>
                  Top Perdedores 24h
                </Typography>
                <List>
                  {data.data.top_losers && data.data.top_losers.map((token, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <TrendingDown color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={token.symbol}
                        secondary={`${formatPrice(token.current_price)} (${token.change_24h.toFixed(2)}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  const renderTopTokens = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tokens Más Populares
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleRequest('/top-tokens')}
        startIcon={<TrendingUp />}
        sx={{ mb: 3 }}
      >
        Obtener Top Tokens
      </Button>
      
      {data && data.data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Por Volumen
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Símbolo</TableCell>
                        <TableCell>Volumen</TableCell>
                        <TableCell>Precio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.data.top_by_volume && data.data.top_by_volume.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell>{token.symbol}</TableCell>
                          <TableCell>{formatVolume(token.volume)}</TableCell>
                          <TableCell>{formatPrice(token.close)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Por Cambio de Precio
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Símbolo</TableCell>
                        <TableCell>Cambio 24h</TableCell>
                        <TableCell>Precio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.data.top_by_change && data.data.top_by_change.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell>{token.symbol}</TableCell>
                          <TableCell>{formatPercentage(token.price_change_24h)}</TableCell>
                          <TableCell>{formatPrice(token.close)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  const renderRealTime = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Datos en Tiempo Real
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleRequest('/real-time')}
        startIcon={<Schedule />}
        sx={{ mb: 3 }}
      >
        Obtener Datos en Tiempo Real
      </Button>
      
      {data && data.data && data.data.data && Array.isArray(data.data.data) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Símbolo</TableCell>
                <TableCell>Precio Actual</TableCell>
                <TableCell>Cambio 1h</TableCell>
                <TableCell>Volumen 1h</TableCell>
                <TableCell>Máximo 1h</TableCell>
                <TableCell>Mínimo 1h</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.data.map((token, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {token.TOKEN_SYMBOL || token.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatPrice(token.CLOSE || token.current_price)}</TableCell>
                  <TableCell>
                    {token.OPEN && token.CLOSE ? 
                      formatPercentage(((token.CLOSE - token.OPEN) / token.OPEN) * 100) : 
                      formatPercentage(token.price_change_1h)
                    }
                  </TableCell>
                  <TableCell>{formatVolume(token.VOLUME || token.volume_1h)}</TableCell>
                  <TableCell>{formatPrice(token.HIGH || token.high_1h)}</TableCell>
                  <TableCell>{formatPrice(token.LOW || token.low_1h)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderTokenList = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lista Completa de Tokens
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Límite"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Página"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={() => handleRequest('/token-list', { limit, page })}
            startIcon={<Info />}
            fullWidth
          >
            Obtener Lista de Tokens
          </Button>
        </Grid>
      </Grid>
      
      {data && data.data && data.data.data && Array.isArray(data.data.data) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Símbolo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio Actual</TableCell>
                <TableCell>Cambio 24h</TableCell>
                <TableCell>Volumen 24h</TableCell>
                <TableCell>Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.data.map((token, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {token.TOKEN_SYMBOL || token.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>{token.TOKEN_NAME || token.name}</TableCell>
                  <TableCell>{formatPrice(token.CLOSE || token.current_price)}</TableCell>
                  <TableCell>
                    {token.OPEN && token.CLOSE ? 
                      formatPercentage(((token.CLOSE - token.OPEN) / token.OPEN) * 100) : 
                      formatPercentage(token.price_change_24h)
                    }
                  </TableCell>
                  <TableCell>{formatVolume(token.VOLUME || token.volume_24h)}</TableCell>
                  <TableCell>{token.market_cap ? formatPrice(token.market_cap) : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

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
          Crypto Tracker
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Monitorea precios, gráficos y datos de trading de criptomonedas en tiempo real
        </Typography>
        <Chip
          icon={<span style={{ fontSize: '20px' }}>🚀</span>}
          label="Análisis completo de criptomonedas con Token Metrics API"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por consulta"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Tabs de funcionalidades */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Precios Diarios" icon={<ShowChart />} />
          <Tab label="Datos por Hora" icon={<Timeline />} />
          <Tab label="Resumen Mercado" icon={<BarChart />} />
          <Tab label="Top Tokens" icon={<TrendingUp />} />
          <Tab label="Tiempo Real" icon={<Schedule />} />
          <Tab label="Lista Tokens" icon={<Info />} />
        </Tabs>
      </Paper>

      {/* Contenido de cada tab */}
      <TabPanel value={activeTab} index={0}>
        {renderDailyPrices()}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderHourlyData()}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {renderMarketOverview()}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        {renderTopTokens()}
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        {renderRealTime()}
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        {renderTokenList()}
      </TabPanel>

      {/* Estados de loading y error */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default CryptoTracker;
