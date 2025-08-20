import { useState } from 'react';
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
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import { useAppDispatch } from '../../redux/hooks/reduxHooks';
import { addNotification } from '../../redux/slices/uiSlice';
import { setBalance } from '../../redux/slices/creditsSlice';
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

const KeywordTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    fontWeight: 600,
  },
}));

const SEOMastermind = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywordData, setKeywordData] = useState(null);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('difficulty');
  const [order, setOrder] = useState('asc');

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/seo-mastermind`;

  const handleAnalyze = async () => {
    if (!keyword) {
      dispatch(addNotification({
        message: 'Por favor ingresa una keyword',
        type: 'error'
      }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}`;
      console.log('Llamando a la API:', apiUrl);

      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setKeywordData(data);

      // Actualizar créditos si viene información del decorador
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }

      dispatch(addNotification({
        message: 'Análisis de keywords completado exitosamente',
        type: 'success'
      }));
    } catch (err) {
      console.error('Error en la llamada a la API:', err);
      setError(err.message);
      dispatch(addNotification({
        message: `Error al realizar el análisis de keywords: ${err.message}`,
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const KeywordSection = ({ title, data, icon }) => {
    if (!data || data.length === 0) return null;

    return (
      <MetricCard elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          <TableContainer>
            <KeywordTable>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'keyword'}
                      direction={orderBy === 'keyword' ? order : 'asc'}
                      onClick={() => handleSort('keyword')}
                    >
                      Keyword
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TableSortLabel
                      active={orderBy === 'difficulty'}
                      direction={orderBy === 'difficulty' ? order : 'asc'}
                      onClick={() => handleSort('difficulty')}
                    >
                      Dificultad
                    </TableSortLabel>
                      <Tooltip title="Indica qué tan difícil es posicionar esta keyword (0-100):
                        • 0-30: Fácil
                        • 31-60: Moderado
                        • 61-80: Difícil
                        • 81-100: Muy difícil" arrow>
                        <InfoIcon sx={{ ml: 1, fontSize: 16, opacity: 0.7 }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      Volumen
                      <Tooltip title="Número promedio de búsquedas mensuales que recibe esta keyword" arrow>
                        <InfoIcon sx={{ ml: 1, fontSize: 16, opacity: 0.7 }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(([keyword, difficulty, volume], index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={difficulty}
                        color={difficulty <= 50 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </KeywordTable>
          </TableContainer>
        </CardContent>
      </MetricCard>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledPaper>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
          Keyword Search - Análisis de keywords
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analiza keywords y descubre oportunidades de contenido
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <StyledTextField
              fullWidth
              label="Ingresa una keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: marketing digital"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAnalyze} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledButton
              fullWidth
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {loading ? 'Analizando...' : 'Analizar Keyword'}
            </StyledButton>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {keywordData && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <KeywordSection
                title="Keywords Fáciles (0-50)"
                data={keywordData.keywords0_50}
                icon={<TrendingUpIcon color="success" />}
              />
            </Grid>
            <Grid item xs={12}>
              <KeywordSection
                title="Keywords Competitivas (50-100)"
                data={keywordData.keywords50_100}
                icon={<TrendingDownIcon color="warning" />}
              />
            </Grid>
            <Grid item xs={12}>
              <KeywordSection
                title="Preguntas Relacionadas"
                data={keywordData.questions}
                icon={<QuestionAnswerIcon color="primary" />}
              />
            </Grid>
          </Grid>
        )}
      </StyledPaper>
    </Container>
  );
};

export default SEOMastermind; 