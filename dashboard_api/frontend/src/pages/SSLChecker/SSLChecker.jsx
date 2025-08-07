import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { Security } from '@mui/icons-material';
import { APP_CONFIG } from '../../config/constants';

const SSLChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sslData, setSslData] = useState(null);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Por favor ingresa una URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSslData(null);
    try {
      // Extraer solo el dominio (sin https://)
      let domain = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const response = await fetch(`${API_BASE_URL}/ssl-checker/check`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ domain })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.message || data.error || 'Error al verificar el certificado SSL');
        setLoading(false);
        return;
      }
      // Usar data.data si existe, sino usar data directamente
      setSslData(data.data || data);
    } catch (err) {
      console.error('Error checking SSL:', err);
      setError(err.message || 'Error al verificar el certificado SSL');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SSL Checker
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Verifica el estado y los detalles del certificado SSL de cualquier sitio web
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL del sitio web"
                  placeholder="https://ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Security color="action" sx={{ mr: 1 }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Verificar SSL'}
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
            Verificando certificado SSL...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && sslData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultados de la Verificación SSL
          </Typography>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Estado del Certificado
                  </Typography>
                  <Typography variant="h6" color={sslData.isValidCertificate ? 'success.main' : 'error.main'}>
                    {sslData.isValidCertificate ? 'Válido' : 'válido'}
                  </Typography>
                  {sslData.isExpired && (
                    <Typography color="error.main">Expirado</Typography>
                  )}
                  {sslData.isSelfSigned && (
                    <Typography color="warning.main">Self-Signed</Typography>
                  )}
                  {sslData.isWildcard && (
                    <Typography color="info.main">Wildcard</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Emitido por
                  </Typography>
                  <Typography variant="h6">
                    {sslData.issuer || sslData.issuerDetails || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Válido desde
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(sslData.validFrom || sslData.validFromDate)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Válido hasta
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(sslData.validUntil || sslData.expiry)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Días restantes
                  </Typography>
                  <Typography variant="h6">
                    {sslData.daysLeft ?? '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Dominio analizado
                  </Typography>
                  <Typography variant="h6">
                    {sslData.domain || sslData.final_url || sslData.original_url || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Puerto
                  </Typography>
                  <Typography variant="h6">
                    {sslData.port || '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default SSLChecker; 