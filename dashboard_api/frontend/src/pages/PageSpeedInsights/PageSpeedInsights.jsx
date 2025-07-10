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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Storage as StorageIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Dns as DnsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const PageSpeedInsights = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ url: url });
      const response = await fetch(`/api/pagespeed-insights/run?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.details || 'Error al analizar la velocidad del sitio web');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al analizar la velocidad del sitio web');
    } finally {
      setLoading(false);
    }
  };

  // Helper para obtener el color del puntaje de velocidad
  const getSpeedColor = (loadTime) => {
    if (loadTime <= 2) return 'success';
    if (loadTime <= 4) return 'warning';
    return 'error';
  };

  // Helper para formatear el tiempo de carga
  const formatLoadTime = (loadTime) => {
    if (loadTime < 1) {
      return `${Math.round(loadTime * 1000)}ms`;
    }
    return `${loadTime.toFixed(2)}s`;
  };

  // Helper para mostrar las optimizaciones sugeridas
  const renderOptimizations = () => {
    if (!result?.optimizations || result.optimizations.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No se encontraron optimizaciones específicas para este sitio.
        </Typography>
      );
    }

    return (
      <List>
        {result.optimizations.map((optimization, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={optimization.title || optimization.suggestion}
              secondary={optimization.description || optimization.detail}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  // Helper para mostrar problemas detectados
  const renderIssues = () => {
    if (!result?.issues || result.issues.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No se detectaron problemas específicos.
        </Typography>
      );
    }

    return (
      <List>
        {result.issues.map((issue, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary={issue.title || issue.problem}
              secondary={issue.description || issue.detail}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Website Speed Test
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Analiza la velocidad de carga y rendimiento de cualquier sitio web. 
        Obtén métricas precisas y sugerencias de optimización.
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mt: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="URL del sitio web"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ej: https://github.com"
            sx={{ flex: '1 1 300px' }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SpeedIcon />}
            sx={{ 
              height: '56px',
              flex: '0 0 auto',
              minWidth: '140px'
            }}
          >
            {loading ? 'Analizando...' : 'Analizar'}
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Analizando velocidad del sitio web...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esto puede tomar hasta 60 segundos
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && result && (
        <>
          {/* Métricas Principales */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resultados del Análisis
              </Typography>
              
              <Grid container spacing={3}>
                {/* Tiempo de Carga Principal */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <SpeedIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: getSpeedColor(result.load_time || result.loadTime || 0) === 'success' ? 'success.main' : 
                               getSpeedColor(result.load_time || result.loadTime || 0) === 'warning' ? 'warning.main' : 'error.main'
                      }} 
                    />
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {formatLoadTime(result.load_time || result.loadTime || 0)}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Tiempo de Carga
                    </Typography>
                    <Chip 
                      label={
                        getSpeedColor(result.load_time || result.loadTime || 0) === 'success' ? 'Excelente' :
                        getSpeedColor(result.load_time || result.loadTime || 0) === 'warning' ? 'Mejorable' : 'Lento'
                      }
                      color={getSpeedColor(result.load_time || result.loadTime || 0)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Métricas Adicionales */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Métricas Detectadas
                    </Typography>
                    
                    {/* CDN Status */}
                    {result.cdn_status !== undefined && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DnsIcon sx={{ mr: 1, color: result.cdn_status ? 'success.main' : 'warning.main' }} />
                        <Typography variant="body2">
                          CDN: {result.cdn_status ? 'Activo' : 'No detectado'}
                        </Typography>
                      </Box>
                    )}

                    {/* Compression */}
                    {result.compression !== undefined && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorageIcon sx={{ mr: 1, color: result.compression ? 'success.main' : 'warning.main' }} />
                        <Typography variant="body2">
                          Compresión: {result.compression ? 'Habilitada' : 'No detectada'}
                        </Typography>
                      </Box>
                    )}

                    {/* Page Size */}
                    {result.page_size && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorageIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          Tamaño: {result.page_size}
                        </Typography>
                      </Box>
                    )}

                    {/* Requests */}
                    {result.requests && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CodeIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          Requests: {result.requests}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  URL Analizada:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {result.url || url}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Problemas Detectados */}
          {(result.issues || result.problems) && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Problemas Detectados
                </Typography>
                {renderIssues()}
              </CardContent>
            </Card>
          )}

          {/* Sugerencias de Optimización */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sugerencias de Optimización
              </Typography>
              {renderOptimizations()}
              
              {/* Consejos Generales */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Consejos Generales para Mejorar la Velocidad:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                  <ListItemText primary="Usa un CDN como Cloudflare para distribuir contenido" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                  <ListItemText primary="Comprime imágenes y archivos CSS/JS" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                  <ListItemText primary="Habilita compresión GZIP en el servidor" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                  <ListItemText primary="Minimiza el número de plugins y scripts" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default PageSpeedInsights; 