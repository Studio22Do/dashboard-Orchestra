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
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ContentCopy, 
  QrCode2, 
  Link as LinkIcon,
  Download
} from '@mui/icons-material';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shortenedData, setShortenedData] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa una URL para acortar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShortenedData({
        originalUrl: url,
        shortUrl: 'https://short.ly/abc123',
        qrCode: 'data:image/png;base64,example', // Aquí irá el QR code real
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err.message || 'Error al acortar la URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleDownloadQR = () => {
    // Aquí irá la lógica para descargar el QR code
    console.log('Downloading QR code...');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener & QR Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Acorta tus URLs y genera códigos QR para compartir fácilmente
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL para acortar"
                  placeholder="https://ejemplo.com/url-muy-larga"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <LinkIcon color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Acortar URL'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Procesando URL...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && shortenedData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            URL Acortada
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    URL Original
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ flex: 1, wordBreak: 'break-all' }}>
                      {shortenedData.originalUrl}
                    </Typography>
                    <Tooltip title="Copiar URL original">
                      <IconButton onClick={() => handleCopy(shortenedData.originalUrl)}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    URL Acortada
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ flex: 1, wordBreak: 'break-all' }}>
                      {shortenedData.shortUrl}
                    </Typography>
                    <Tooltip title="Copiar URL acortada">
                      <IconButton onClick={() => handleCopy(shortenedData.shortUrl)}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Código QR
                    </Typography>
                    <Box>
                      <Tooltip title="Descargar QR">
                        <IconButton onClick={handleDownloadQR}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    {showQR ? (
                      <img 
                        src={shortenedData.qrCode} 
                        alt="QR Code" 
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    ) : (
                      <Button
                        startIcon={<QrCode2 />}
                        onClick={() => setShowQR(true)}
                        variant="outlined"
                      >
                        Mostrar Código QR
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default UrlShortener; 