import { useState, useEffect } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Search,
  Title,
  Description,
  Tag,
  ContentCopy,
  CheckCircle,
  Error,
  History,
  FileDownload,
  MoreVert,
  Refresh
} from '@mui/icons-material';

const SEOMastermind = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Cargar historial
  const loadHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`/api/seo-mastermind/history?page=${page}&per_page=10`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setHistory(data.items);
      setHistoryTotal(data.total);
      setHistoryPage(data.current_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      loadHistory();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Por favor ingresa un tema para generar el SEO');
      return;
    }
    setLoading(true);
    setError(null);
    setSeoData(null);
    try {
      const response = await fetch('/api/seo-mastermind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el SEO');
      }
      setSeoData(data);
      setUsage(data.usage);
      if (activeTab === 1) {
        loadHistory();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = async (format) => {
    try {
      const response = await fetch(`/api/seo-mastermind/export?format=${format}`);
      if (!response.ok) throw new Error('Error al exportar');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo_history_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          SEO Mastermind
        </Typography>
        <Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleExport('json')}>
              <FileDownload sx={{ mr: 1 }} /> Exportar JSON
            </MenuItem>
            <MenuItem onClick={() => handleExport('csv')}>
              <FileDownload sx={{ mr: 1 }} /> Exportar CSV
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        Genera palabras clave, meta descripciones y títulos optimizados para SEO usando IA.
      </Typography>

      {usage && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                Uso diario: {usage.daily_usage} / {usage.daily_limit} ({usage.plan.toUpperCase()})
              </Typography>
              <Chip label={usage.plan.toUpperCase()} color="primary" size="small" />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(usage.daily_usage / usage.daily_limit) * 100} 
              color={usage.daily_usage >= usage.daily_limit ? "error" : "primary"}
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Generar SEO" />
        <Tab label="Historial" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Tema o Palabra Clave"
                      placeholder="Ej: Cómo perder peso rápidamente"
                      variant="outlined"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
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
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Generar SEO'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Generando contenido SEO optimizado...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {seoData && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resultados SEO
              </Typography>
              <Grid container spacing={3}>
                {/* Títulos */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Title color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Títulos Sugeridos</Typography>
                      </Box>
                      <List>
                        {seoData.titles?.map((title, index) => (
                          <ListItem
                            key={index}
                            secondaryAction={
                              <Button
                                startIcon={copied === `title-${index}` ? <CheckCircle /> : <ContentCopy />}
                                onClick={() => copyToClipboard(title, `title-${index}`)}
                              >
                                {copied === `title-${index}` ? 'Copiado' : 'Copiar'}
                              </Button>
                            }
                          >
                            <ListItemText primary={title} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Meta Descripción */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Description color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Meta Descripción</Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {seoData.meta_description}
                      </Typography>
                      <Button
                        startIcon={copied === 'meta' ? <CheckCircle /> : <ContentCopy />}
                        onClick={() => copyToClipboard(seoData.meta_description, 'meta')}
                      >
                        {copied === 'meta' ? 'Copiado' : 'Copiar Meta Descripción'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Palabras Clave */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Tag color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Palabras Clave</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {seoData.keywords?.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            onClick={() => copyToClipboard(keyword, `keyword-${index}`)}
                            icon={copied === `keyword-${index}` ? <CheckCircle /> : <Tag />}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Historial de Búsquedas
            </Typography>
            <Button
              startIcon={<Refresh />}
              onClick={() => loadHistory(historyPage)}
              disabled={historyLoading}
            >
              Actualizar
            </Button>
          </Box>

          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Alert severity="info">
              No hay búsquedas en el historial
            </Alert>
          ) : (
            <List>
              {history.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.topic}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.created_at).toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Meta Descripción:
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {item.meta_description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Palabras Clave:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {item.keywords?.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            size="small"
                            onClick={() => copyToClipboard(keyword, `history-keyword-${index}`)}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}

          {historyTotal > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                disabled={historyPage === 1}
                onClick={() => loadHistory(historyPage - 1)}
                sx={{ mr: 2 }}
              >
                Anterior
              </Button>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Página {historyPage} de {Math.ceil(historyTotal / 10)}
              </Typography>
              <Button
                disabled={historyPage >= Math.ceil(historyTotal / 10)}
                onClick={() => loadHistory(historyPage + 1)}
                sx={{ ml: 2 }}
              >
                Siguiente
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SEOMastermind; 