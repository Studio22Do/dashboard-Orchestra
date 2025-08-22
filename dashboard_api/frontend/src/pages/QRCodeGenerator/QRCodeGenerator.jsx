import { useState } from 'react';
import { Container, Card, CardContent, Grid, TextField, MenuItem, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
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
      const token = localStorage.getItem('token');
      // Payload mínimo y seguro: si el tipo requiere estructura específica y sólo tenemos 'data', el backend hará fallback a 'auto'
      const payload = type === 'batch' ? { items: [{ data, output_format: 'png' }] } : { data, output_format: 'png' };
      const resp = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ type, payload })
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Error generando QR');
      setResult(json);
      if (json && json.credits_info && typeof json.credits_info.remaining === 'number') {
        dispatch(setBalance(json.credits_info.remaining));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>QR Generator</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Tipo" value={type} onChange={(e)=>setType(e.target.value)}>
                {TYPE_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Datos" placeholder="Texto, URL, email, etc." value={data} onChange={(e)=>setData(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleGenerate} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : 'Generar QR'}
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>
            )}
            {result && (
              <Grid item xs={12}>
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
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QRCodeGenerator;


