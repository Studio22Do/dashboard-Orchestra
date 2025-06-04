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
  styled,
  alpha,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Title as TitleIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { addNotification } from '../../redux/slices/uiSlice';
import { APP_CONFIG } from '../../config/constants';

// Componentes estilizados mejorados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    background: alpha(theme.palette.background.paper, 1),
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2.5),
    '&:last-child': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiCardContent-root': {
      padding: theme.spacing(2),
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
  },
}));

const ScoreChip = styled(Chip)(({ theme, score }) => ({
  backgroundColor: score >= 90 
    ? alpha(theme.palette.success.main, 0.9)
    : score >= 70 
    ? alpha(theme.palette.warning.main, 0.9)
    : alpha(theme.palette.error.main, 0.9),
  color: theme.palette.common.white,
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(0.5, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const SEOMastermind = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const MetricSection = ({ title, score, issues, icon }) => {
    const IconComponent = {
      'Título y Meta Descripción': TitleIcon,
      'Estructura de Encabezados': DescriptionIcon,
      'Imágenes': ImageIcon,
      'Enlaces': LinkIcon,
      'Contenido': DescriptionIcon,
      'Móvil': DevicesIcon,
      'Rendimiento': SpeedIcon,
    }[title] || InfoIcon;

    return (
      <MetricCard elevation={2}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: 1
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              minWidth: 0
            }}>
              <IconComponent 
                color="primary" 
                sx={{ 
                  mr: 1,
                  fontSize: isMobile ? '1.5rem' : '2rem'
                }} 
              />
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                sx={{ 
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {title}
              </Typography>
            </Box>
            <ScoreChip
              score={score}
              label={`${score}/100`}
            />
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ mt: 2 }}>
            {issues.length > 0 ? (
              issues.map((issue, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    '&::before': {
                      content: '"•"',
                      mr: 1,
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {issue}
                </Typography>
              ))
            ) : (
              <Typography 
                variant="body2" 
                color="success.main"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <CheckCircleIcon fontSize="small" />
                No se encontraron problemas
              </Typography>
            )}
          </Box>
        </CardContent>
      </MetricCard>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: { xs: 2, md: 4 },
          fontWeight: 700,
          color: theme.palette.primary.main,
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        SEO Mastermind
      </Typography>

      <StyledPaper sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <StyledTextField
              fullWidth
              label="URL del sitio web"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledButton
              fullWidth
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={loading || !url}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ 
                height: { xs: 48, md: 56 },
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              {loading ? 'Analizando...' : 'Analizar SEO'}
            </StyledButton>
          </Grid>
        </Grid>
      </StyledPaper>

      {seoData && (
        <Grid container spacing={{ xs: 2, md: 3 }}>
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