import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Slider,
  TextField
} from '@mui/material';
import {
  Upload,
  ContentCopy,
  Delete,
  Image,
  Settings,
  Lightbulb,
  History,
  Download,
  PhotoCamera,
  Filter,
  Crop,
  Adjust,
  Palette
} from '@mui/icons-material';
import { APP_CONFIG } from '../../config/constants';

const AdvancedImageManipulation = () => {
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v2';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;
  const [imageUrl, setImageUrl] = useState('');
  const [operation, setOperation] = useState('resize');
  const [parameters, setParameters] = useState({
    width: '',
    height: '',
    blur: '',
    angle: '',
    left: '',
    upper: '',
    right: '',
    lower: '',
    method: '',
    convert_to: 'JPG'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [history, setHistory] = useState([]);

  const operations = [
    { value: 'resize', label: 'Redimensionar (Resize)' },
    { value: 'blur', label: 'Desenfocar (Blur)' },
    { value: 'crop', label: 'Recortar (Crop)' },
    { value: 'rotate', label: 'Rotar (Rotate)' },
    { value: 'thumbnail', label: 'Miniatura (Thumbnail)' },
    { value: 'transpose', label: 'Transponer (Transpose)' },
    { value: 'pdf_to_images', label: 'PDF a Imágenes' },
    { value: 'convert', label: 'Convertir Formato' }
  ];

  const transposeMethods = [
    'FLIP_LEFT_RIGHT',
    'FLIP_TOP_BOTTOM',
    'ROTATE_180',
    'ROTATE_270',
    'ROTATE_90',
    'TRANSPOSE',
    'TRANSVERSE'
  ];

  const formatOptions = [
    { value: 'JPG', label: 'JPG' },
    { value: 'PNG', label: 'PNG' },
    { value: 'GIF', label: 'GIF' }
  ];

  const handleParameterChange = (parameter) => (event) => {
    setParameters(prev => ({
      ...prev,
      [parameter]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Por favor ingresa la URL de la imagen o PDF');
      return;
    }
    setLoading(true);
    setError(null);
    setProcessedImageUrl(null);
    try {
      const response = await fetch(`${API_BASE_URL}/image-manipulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          source_url: imageUrl,
          params: parameters
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la imagen');
      }
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        if (operation === 'pdf_to_images') {
          setProcessedImageUrl(data.urls);
        } else {
          setProcessedImageUrl(data.urls[0]);
        }
        setHistory(prev => [{
          operation,
          parameters,
          processedUrl: operation === 'pdf_to_images' ? data.urls : data.urls[0],
          timestamp: new Date().toLocaleString()
        }, ...prev]);
      } else {
        setError('No se recibió una imagen procesada');
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (processedImageUrl) {
      try {
        const response = await fetch(processedImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `processed_image.${parameters.convert_to?.toLowerCase() || 'jpg'}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al descargar la imagen:', error);
        setError('Error al descargar la imagen');
      }
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manipulación Avanzada de Imágenes
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Procesa y mejora tus imágenes usando IA
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* PDF a Imágenes: solo campo URL PDF */}
                  {operation === 'pdf_to_images' && (
                    <Grid item xs={12}>
                      <TextField
                        label="URL del PDF"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        fullWidth
                        required
                        placeholder="https://..."
                      />
                    </Grid>
                  )}
                  {/* Convertir Formato: campo URL y formato destino */}
                  {operation === 'convert' && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          label="URL de la Imagen"
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          fullWidth
                          required
                          placeholder="https://..."
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Formato destino</InputLabel>
                          <Select
                            value={parameters.convert_to}
                            onChange={handleParameterChange('convert_to')}
                            label="Formato destino"
                            required
                          >
                            {formatOptions.map(opt => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {/* Operaciones normales: mantener comportamiento actual */}
                  {operation !== 'pdf_to_images' && operation !== 'convert' && (
                    <Grid item xs={12}>
                      <TextField
                        label="URL de la Imagen"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        fullWidth
                        required
                        placeholder="https://..."
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Operación</InputLabel>
                      <Select
                        value={operation}
                        onChange={e => setOperation(e.target.value)}
                        label="Operación"
                      >
                        {operations.map((op) => (
                          <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Parámetros dinámicos según operación */}
                  {operation === 'resize' && (
                    <>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Ancho (px)"
                          type="number"
                          value={parameters.width}
                          onChange={handleParameterChange('width')}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Alto (px)"
                          type="number"
                          value={parameters.height}
                          onChange={handleParameterChange('height')}
                          fullWidth
                          required
                        />
                      </Grid>
                    </>
                  )}
                  {operation === 'blur' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Nivel de Desenfoque (opcional)"
                        type="number"
                        value={parameters.blur}
                        onChange={handleParameterChange('blur')}
                        fullWidth
                      />
                    </Grid>
                  )}
                  {operation === 'crop' && (
                    <>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Left"
                          type="number"
                          value={parameters.left}
                          onChange={handleParameterChange('left')}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Upper"
                          type="number"
                          value={parameters.upper}
                          onChange={handleParameterChange('upper')}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Right"
                          type="number"
                          value={parameters.right}
                          onChange={handleParameterChange('right')}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Lower"
                          type="number"
                          value={parameters.lower}
                          onChange={handleParameterChange('lower')}
                          fullWidth
                          required
                        />
                      </Grid>
                    </>
                  )}
                  {operation === 'rotate' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ángulo (grados)"
                        type="number"
                        value={parameters.angle}
                        onChange={handleParameterChange('angle')}
                        fullWidth
                        required
                      />
                    </Grid>
                  )}
                  {operation === 'thumbnail' && (
                    <>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Ancho (px)"
                          type="number"
                          value={parameters.width}
                          onChange={handleParameterChange('width')}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Alto (px)"
                          type="number"
                          value={parameters.height}
                          onChange={handleParameterChange('height')}
                          fullWidth
                          required
                        />
                      </Grid>
                    </>
                  )}
                  {operation === 'transpose' && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Método</InputLabel>
                        <Select
                          value={parameters.method}
                          onChange={handleParameterChange('method')}
                          label="Método"
                          required
                        >
                          {transposeMethods.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={<Image />}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Procesar Imagen'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Procesando imagen...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {processedImageUrl && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Imagen Procesada
                </Typography>
                <Box>
                  <Tooltip title="Descargar imagen">
                    <IconButton onClick={handleDownload}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={processedImageUrl}
                  alt="Procesada"
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
            </Paper>
          )}

          {history.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Procesamiento
                </Typography>
                <Tooltip title="Limpiar historial">
                  <IconButton onClick={handleClearHistory}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <List>
                {history.map((item, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {operations.find(o => o.value === item.operation)?.icon}
                            <Typography variant="subtitle1">
                              {operations.find(o => o.value === item.operation)?.label}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ textAlign: 'center', mb: 1 }}>
                              <img
                                src={item.processedUrl}
                                alt={`Procesada ${index}`}
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={item.timestamp} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}

          {/* Mostrar resultados para PDF a Imágenes */}
          {operation === 'pdf_to_images' && processedImageUrl && Array.isArray(processedImageUrl) && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Imágenes generadas del PDF</Typography>
              <Grid container spacing={2}>
                {processedImageUrl.map((url, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <img src={url} alt={`Página ${idx + 1}`} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                    <Button
                      variant="outlined"
                      color="primary"
                      href={url}
                      target="_blank"
                      rel="noopener"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Descargar Página {idx + 1}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Mostrar resultado para Convertir Formato */}
          {operation === 'convert' && processedImageUrl && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Imagen Convertida</Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={processedImageUrl}
                  alt="Convertida"
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
              <Button
                variant="outlined"
                color="primary"
                href={processedImageUrl}
                target="_blank"
                rel="noopener"
                fullWidth
              >
                Descargar Imagen Convertida
              </Button>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuración
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Operación Seleccionada"
                    secondary={operations.find(o => o.value === operation)?.label}
                  />
                </ListItem>
                <Divider />
                {operation === 'resize' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="Ancho"
                        secondary={parameters.width}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Alto"
                        secondary={parameters.height}
                      />
                    </ListItem>
                  </>
                )}
                {operation === 'blur' && (
                  <ListItem>
                    <ListItemText
                      primary="Nivel de Desenfoque"
                      secondary={parameters.blur}
                    />
                  </ListItem>
                )}
                {operation === 'crop' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="Left"
                        secondary={parameters.left}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Upper"
                        secondary={parameters.upper}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Right"
                        secondary={parameters.right}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Lower"
                        secondary={parameters.lower}
                      />
                    </ListItem>
                  </>
                )}
                {operation === 'rotate' && (
                  <ListItem>
                    <ListItemText
                      primary="Ángulo"
                      secondary={parameters.angle}
                    />
                  </ListItem>
                )}
                {operation === 'thumbnail' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="Ancho"
                        secondary={parameters.width}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Alto"
                        secondary={parameters.height}
                      />
                    </ListItem>
                  </>
                )}
                {operation === 'transpose' && (
                  <ListItem>
                    <ListItemText
                      primary="Método"
                      secondary={parameters.method}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sugerencias
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Formatos soportados"
                    secondary="JPG, PNG, WEBP, GIF (primer frame)"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tamaño máximo"
                    secondary="10MB por imagen"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Resolución recomendada"
                    secondary="Mínimo 800x600 píxeles"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdvancedImageManipulation; 