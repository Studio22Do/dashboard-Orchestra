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
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import {
  ContentCopy,
  QrCode,
  Search,
  Link as LinkIcon
} from '@mui/icons-material';

const GoogleReviewLink = () => {
  const [placeId, setPlaceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewLink, setReviewLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerateLink = async () => {
    if (!placeId) {
      setError('Por favor ingresa un Place ID');
      return;
    }

    setLoading(true);
    setError(null);
    setReviewLink('');

    try {
      const response = await fetch('/api/google-review-link/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place_id: placeId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el enlace');
      }

      setReviewLink(data.review_link || data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPlace = async () => {
    if (!searchQuery) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/google-review-link/search-place?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar el lugar');
      }

      // Por ahora solo mostramos el mensaje de desarrollo
      setError(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generador de Enlaces de Reseñas de Google
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera enlaces directos para que tus clientes dejen reseñas en Google
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Buscar Negocio
              </Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre del negocio"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: Restaurante XYZ"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearchPlace}
                  startIcon={<Search />}
                  disabled={loading}
                  fullWidth
                >
                  Buscar
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Generar Enlace
              </Typography>
              <Box>
                <TextField
                  fullWidth
                  label="Place ID"
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                  placeholder="Ej: ChIJ81QWXL9ZwokRXT045fycD8g"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateLink}
                  startIcon={<LinkIcon />}
                  disabled={loading}
                  fullWidth
                >
                  Generar Enlace
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enlace Generado
              </Typography>
              
              {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {reviewLink && (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    position: 'relative'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-all',
                      pr: 4
                    }}
                  >
                    {reviewLink}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Tooltip title="Copiar enlace">
                      <IconButton
                        size="small"
                        onClick={handleCopyLink}
                        color={copySuccess ? 'success' : 'default'}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generar QR">
                      <IconButton
                        size="small"
                        onClick={() => {/* TODO */}}
                      >
                        <QrCode fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              )}

              {reviewLink && (
                <Box mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    Comparte este enlace con tus clientes para que puedan dejar reseñas fácilmente.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GoogleReviewLink; 