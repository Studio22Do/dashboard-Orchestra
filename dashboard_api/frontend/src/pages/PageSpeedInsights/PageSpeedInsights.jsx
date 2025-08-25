import { useState } from 'react';
import axiosInstance from '../../config/axios';
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
  Security as SecurityIcon,
  Link as LinkIcon,
  Search as SearchIcon,
  Tag as TagIcon,
  Title as TitleIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const PageSpeedInsights = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const theme = useTheme();

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/website-analyzer`;

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
      const response = await axiosInstance.get(`${API_BASE_URL}/full-analysis`, {
        params: { url: url },
        timeout: 90000  // 90 segundos de timeout (más que el backend de 60s)
      });
      
      const data = response.data;
      if (data.error) {
        throw new Error(data.error || data.details || 'Error al analizar la velocidad del sitio web');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al analizar la velocidad del sitio web');
    } finally {
      setLoading(false);
    }
  };

  // Helper para formatear el tiempo de carga
  const formatLoadTime = (loadTime) => {
    if (!loadTime) return '0ms';
    // Convertir a milisegundos ya que la API devuelve segundos
    const ms = loadTime * 1000;
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms/1000).toFixed(2)}s`;
  };

  // Helper para obtener el color del puntaje de velocidad
  const getSpeedColor = (loadTime) => {
    if (!loadTime) return 'warning';
    const ms = loadTime * 1000;
    if (ms <= 500) return 'success';
    if (ms <= 2000) return 'warning';
    return 'error';
  };

  // Helper para mostrar las optimizaciones sugeridas
  const renderOptimizations = () => {
    const suggestions = [];
    
    // Agregar sugerencias del análisis SEO
    if (result?.seo?.headings?.suggestion) {
      suggestions.push(...result.seo.headings.suggestion);
    }
    if (result?.seo?.metadescription?.suggestion) {
      suggestions.push(result.seo.metadescription.suggestion);
    }
    if (result?.seo?.webtitle?.suggestion) {
      suggestions.push(result.seo.webtitle.suggestion);
    }

    if (suggestions.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No se encontraron optimizaciones específicas para este sitio.
        </Typography>
      );
    }

    return (
      <List>
        {suggestions.map((suggestion, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={suggestion} />
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

  const renderKeywords = (keywords) => {
    if (!keywords || !Array.isArray(keywords?.keywords)) {
      return (
        <Typography variant="body2" color="text.secondary">
          No hay palabras clave disponibles
        </Typography>
      );
    }

    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {keywords.keywords.slice(0, 5).map((keyword, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ 
              p: 2, 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}>
              <Typography variant="subtitle1" noWrap>
                {keyword.keyword}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posición: {keyword.position || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Volumen: {keyword.volume || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderMetrics = (data) => {
    if (!data) return null;

    return (
      <Grid container spacing={3}>
        {/* Velocidad */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Velocidad
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tiempo de carga total
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {formatLoadTime(data?.speed?.data?.total_time)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((data?.speed?.data?.total_time || 0) * 100, 100)}
                color={getSpeedColor(data?.speed?.data?.total_time)}
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tamaño de página
              </Typography>
              <Typography variant="h6">
                {formatBytes(data?.speed?.data?.size_download)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* SEO */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              SEO
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><TitleIcon /></ListItemIcon>
                <ListItemText 
                  primary="Título" 
                  secondary={`${data?.seo?.basic?.title || 'N/A'} (${data?.seo?.webtitle?.length || 0} caracteres)`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                <ListItemText 
                  primary="Meta Descripción" 
                  secondary={`${data?.seo?.metadescription?.description || 'N/A'} (${data?.seo?.metadescription?.length || 0} caracteres)`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><LinkIcon /></ListItemIcon>
                <ListItemText 
                  primary="Enlaces" 
                  secondary={`${data?.seo?.links?.count || 0} enlaces encontrados`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Backlinks */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Análisis de Backlinks
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">
                    {data?.backlinks?.counts?.backlinks?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Backlinks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">
                    {data?.backlinks?.counts?.backlinks?.doFollow || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DoFollow
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">
                    {data?.backlinks?.counts?.domains?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dominios Únicos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">
                    {data?.backlinks?.counts?.backlinks?.toHomePage || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A Página Principal
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Keywords */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <TagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Palabras Clave Principales
            </Typography>
            {renderKeywords(data?.keywords)}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Helper para formatear bytes
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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
          {/* Reemplazar el contenido existente con el nuevo renderMetrics */}
          {renderMetrics(result)}
          
          {/* Mantener las sugerencias y consejos generales */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sugerencias de Optimización
              </Typography>
              {renderOptimizations()}
            </CardContent>
          </Card>

          {/* Consejos Generales */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Consejos Generales
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