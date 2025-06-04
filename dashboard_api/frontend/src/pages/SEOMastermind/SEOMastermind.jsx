import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { addNotification } from '../../redux/slices/uiSlice';
import { APP_CONFIG } from '../../config/constants';

// Componentes estilizados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const SEOMastermind = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [error, setError] = useState(null);

  // Estados para diferentes métricas SEO
  const [pageMetrics, setPageMetrics] = useState({
    title: { score: 0, issues: [] },
    metaDescription: { score: 0, issues: [] },
    headings: { score: 0, issues: [] },
    images: { score: 0, issues: [] },
    links: { score: 0, issues: [] },
    content: { score: 0, issues: [] },
    mobile: { score: 0, issues: [] },
    performance: { score: 0, issues: [] },
  });

  const handleAnalyze = async () => {
    if (!url) {
      dispatch(addNotification({
        message: 'Por favor ingresa una URL válida',
        type: 'error'
      }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Aquí irá la llamada a la API
      const response = await fetch(`${APP_CONFIG.API_URL}/api/seo-mastermind/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Error al analizar la URL');
      }

      const data = await response.json();
      setSeoData(data);
      setPageMetrics(data.metrics);

      dispatch(addNotification({
        message: 'Análisis SEO completado exitosamente',
        type: 'success'
      }));
    } catch (err) {
      setError(err.message);
      dispatch(addNotification({
        message: 'Error al realizar el análisis SEO',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircleIcon color="success" />;
    if (score >= 70) return <WarningIcon color="warning" />;
    return <ErrorIcon color="error" />;
  };

  const MetricSection = ({ title, score, issues, icon }) => (
    <MetricCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Chip
              label={`${score}/100`}
              sx={{
                backgroundColor: getScoreColor(score),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        {issues.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            {issues.map((issue, index) => (
              <Typography
                key={index}
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                • {issue}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="success.main">
            No se encontraron problemas
          </Typography>
        )}
      </CardContent>
    </MetricCard>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        SEO Mastermind
      </Typography>

      <StyledPaper sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="URL del sitio web"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={loading || !url}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: 56 }}
            >
              {loading ? 'Analizando...' : 'Analizar SEO'}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      {seoData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Título y Meta Descripción"
              score={pageMetrics.title.score}
              issues={pageMetrics.title.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Estructura de Encabezados"
              score={pageMetrics.headings.score}
              issues={pageMetrics.headings.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Imágenes"
              score={pageMetrics.images.score}
              issues={pageMetrics.images.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Enlaces"
              score={pageMetrics.links.score}
              issues={pageMetrics.links.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Contenido"
              score={pageMetrics.content.score}
              issues={pageMetrics.content.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricSection
              title="Optimización Móvil"
              score={pageMetrics.mobile.score}
              issues={pageMetrics.mobile.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12}>
            <MetricSection
              title="Rendimiento"
              score={pageMetrics.performance.score}
              issues={pageMetrics.performance.issues}
              icon={<InfoIcon color="primary" />}
            />
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default SEOMastermind; 