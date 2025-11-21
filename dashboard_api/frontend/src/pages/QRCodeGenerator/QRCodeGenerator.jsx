import { useState } from 'react';
import axiosInstance from '../../config/axios';
import { Container, Card, CardContent, Grid, TextField, MenuItem, Button, Typography, Box, CircularProgress, Alert, Chip, Paper } from '@mui/material';
import { QrCode, Star } from '@mui/icons-material';
import { useAppDispatch } from '../../redux/hooks/reduxHooks';
import { setBalance } from '../../redux/slices/creditsSlice';

const TYPE_OPTIONS = [
  'text','email','wifi','sms','telephone','contact','crypto','geolocation','arbitrary','auto','batch'
];

const QRCodeGenerator = () => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState('text');
  const [data, setData] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/qrcode-generator`;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Payload mínimo y seguro: si el tipo requiere estructura específica y sólo tenemos 'data', el backend hará fallback a 'auto'
      const payload = type === 'batch' ? { items: [{ data, output_format: 'png' }] } : { data, output_format: 'png' };
      const resp = await axiosInstance.post(`${API_BASE_URL}/generate`, { type, payload });
      setResult(resp.data);
      if (resp.data && resp.data.credits_info && typeof resp.data.credits_info.remaining === 'number') {
        dispatch(setBalance(resp.data.credits_info.remaining));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          QR Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Genera códigos QR personalizados para cualquier tipo de contenido
        </Typography>
        <Chip 
          icon={<QrCode />} 
          label="Crea QRs para texto, URLs, WiFi, contactos y más" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip 
          icon={<Star />} 
          label="Costo: 1 punto por generación" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Card>
        <CardContent>
          <Paper elevation={0} sx={{ p: 3, mb: 2, boxShadow: 'none' }}>
            <form onSubmit={(e)=>{ e.preventDefault(); handleGenerate(); }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 200px' }, minWidth: 0 }}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo"
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                      },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  >
                    {TYPE_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Datos"
                    placeholder="Texto, URL, email, etc."
                    value={data}
                    onChange={(e)=>setData(e.target.value)}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                      },
                      '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'rgba(255, 255, 255, 0.65)' } }
                    }}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: '150px' } }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <QrCode />}
                    sx={{
                      height: '56px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                    }}
                  >
                    {loading ? 'Generando...' : 'Generar QR'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>

          {error && (
            <Box sx={{ mt: 2 }}><Alert severity="error">{error}</Alert></Box>
          )}

          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Resultado</Typography>
              <Box sx={{ mt:2 }}>
                {result.image_url ? (
                  <img src={result.image_url} alt="QR" style={{ maxWidth: '100%' }} />
                ) : result.file_url ? (
                  <img src={result.file_url} alt="QR" style={{ maxWidth: '100%' }} />
                ) : result.image_base64 ? (
                  <img src={`data:${result.content_type || 'image/png'};base64,${result.image_base64}`} alt="QR" style={{ maxWidth: '100%' }} />
                ) : result.svg ? (
                  <div dangerouslySetInnerHTML={{ __html: result.svg }} />
                ) : result.raw ? (
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{result.raw}</pre>
                ) : (
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
                )}
              </Box>
              {(result.image_base64 || result.image_url || result.file_url || result.svg) && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (result.image_base64) {
                        const a = document.createElement('a');
                        a.href = `data:${result.content_type || 'image/png'};base64,${result.image_base64}`;
                        a.download = 'qr-code.png';
                        a.click();
                      } else if (result.svg) {
                        const blob = new Blob([result.svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'qr-code.svg';
                        a.click();
                        URL.revokeObjectURL(url);
                      } else if (result.image_url || result.file_url) {
                        const a = document.createElement('a');
                        a.href = result.image_url || result.file_url;
                        a.download = 'qr-code';
                        a.click();
                      }
                    }}
                  >
                    Descargar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default QRCodeGenerator;


