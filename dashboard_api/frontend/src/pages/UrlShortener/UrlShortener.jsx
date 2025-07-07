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
  Download
} from '@mui/icons-material';

const UrlShortener = () => {
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [svgData, setSvgData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputData) {
      setError('Por favor ingresa el texto o dato para generar el QR');
      return;
    }
    setLoading(true);
    setError(null);
    setShowQR(false);
    setQrData(null);
    setSvgData(null);
    try {
      const response = await fetch('/api/apps/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputData }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el QR');
      }
      const result = await response.json();
      setSvgData(result.svg);
      setShowQR(true);
    } catch (err) {
      setError(err.message || 'Error al generar el QR');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.href = qrData;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSVG = () => {
    if (!svgData) return;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgData) return;
    // Crear un canvas para convertir SVG a PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        QR Generator SVG
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Ingresa cualquier texto, URL, email, teléfono, etc. y genera un código QR personalizado.
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Dato para QR"
                  placeholder="https://ejemplo.com o cualquier texto"
                  variant="outlined"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <QrCode2 color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Generar QR'}
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
            Generando QR...
          </Typography>
        </Box>
      )}
      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {!loading && svgData && showQR && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Código QR SVG Generado
          </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <span
              dangerouslySetInnerHTML={{ __html: svgData }}
              aria-label="QR SVG"
              tabIndex={0}
              role="img"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Tooltip title="Descargar como SVG (máxima calidad)">
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadSVG}
                size="small"
              >
                SVG
              </Button>
            </Tooltip>
            <Tooltip title="Descargar como PNG (universal)">
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadPNG}
                size="small"
              >
                PNG
              </Button>
            </Tooltip>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default UrlShortener; 