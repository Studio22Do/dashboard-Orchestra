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

const AdvancedImageManipulation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [operation, setOperation] = useState('enhance');
  const [parameters, setParameters] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [history, setHistory] = useState([]);

  const operations = [
    { value: 'enhance', label: 'Mejorar Imagen', icon: <PhotoCamera /> },
    { value: 'filter', label: 'Aplicar Filtro', icon: <Filter /> },
    { value: 'crop', label: 'Recortar', icon: <Crop /> },
    { value: 'adjust', label: 'Ajustar', icon: <Adjust /> },
    { value: 'colorize', label: 'Colorizar', icon: <Palette /> }
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleParameterChange = (parameter) => (event, newValue) => {
    setParameters(prev => ({
      ...prev,
      [parameter]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de procesamiento de imagen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProcessedImage = {
        operation,
        parameters,
        originalFile: selectedFile,
        processedUrl: URL.createObjectURL(selectedFile), // En una implementación real, esto sería la URL de la imagen procesada
        timestamp: new Date().toLocaleString()
      };
      
      setProcessedImage(newProcessedImage);
      setHistory(prev => [newProcessedImage, ...prev]);
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || 'Error al procesar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage.processedUrl;
      link.download = `processed_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<Upload />}
                      sx={{ height: '100px', borderStyle: 'dashed' }}
                    >
                      {selectedFile ? selectedFile.name : 'Seleccionar Imagen'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Operación</InputLabel>
                      <Select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        label="Operación"
                      >
                        {operations.map((op) => (
                          <MenuItem key={op.value} value={op.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {op.icon}
                              {op.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {operation === 'adjust' && (
                    <>
                      <Grid item xs={12}>
                        <Typography gutterBottom>Brillo</Typography>
                        <Slider
                          value={parameters.brightness}
                          onChange={handleParameterChange('brightness')}
                          min={-100}
                          max={100}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography gutterBottom>Contraste</Typography>
                        <Slider
                          value={parameters.contrast}
                          onChange={handleParameterChange('contrast')}
                          min={-100}
                          max={100}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography gutterBottom>Saturación</Typography>
                        <Slider
                          value={parameters.saturation}
                          onChange={handleParameterChange('saturation')}
                          min={-100}
                          max={100}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography gutterBottom>Nitidez</Typography>
                        <Slider
                          value={parameters.sharpness}
                          onChange={handleParameterChange('sharpness')}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || !selectedFile}
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

          {processedImage && (
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
                  src={processedImage.processedUrl}
                  alt="Procesada"
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={operations.find(o => o.value === processedImage.operation)?.icon} 
                      label={operations.find(o => o.value === processedImage.operation)?.label} 
                      color="primary" />
                <Chip label={processedImage.timestamp} variant="outlined" />
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
                {operation === 'adjust' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="Brillo"
                        secondary={`${parameters.brightness}%`}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Contraste"
                        secondary={`${parameters.contrast}%`}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Saturación"
                        secondary={`${parameters.saturation}%`}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Nitidez"
                        secondary={`${parameters.sharpness}%`}
                      />
                    </ListItem>
                  </>
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