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
  Slider
} from '@mui/material';
import {
  Upload,
  ContentCopy,
  Delete,
  VideoFile,
  Settings,
  Lightbulb,
  History,
  Download,
  Movie,
  Edit,
  AutoAwesome,
  Speed
} from '@mui/icons-material';

const RunwayML = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [operation, setOperation] = useState('generate');
  const [model, setModel] = useState('gen-2');
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState({
    duration: 4,
    fps: 24,
    quality: 'high'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [history, setHistory] = useState([]);
  const [imgPrompt, setImgPrompt] = useState('');
  const [width, setWidth] = useState(1344);
  const [height, setHeight] = useState(768);
  const [motion, setMotion] = useState(5);
  const [seed, setSeed] = useState(0);
  const [time, setTime] = useState(4);
  const [imageAsEndFrame, setImageAsEndFrame] = useState(false);
  const [flip, setFlip] = useState(false);

  const operations = [
    { value: 'generate', label: 'Generar Video', icon: <Movie /> },
    { value: 'edit', label: 'Editar Video', icon: <Edit /> },
    { value: 'enhance', label: 'Mejorar Video', icon: <AutoAwesome /> }
  ];

  const models = [
    { value: 'gen-2', label: 'Gen-2 (Base)' },
    { value: 'gen-2-xl', label: 'Gen-2 XL (Mejorado)' }
  ];

  const qualities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Por favor selecciona un archivo de video válido');
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
    setLoading(true);
    setError(null);
    setGeneratedVideo(null);

    let payload = {};
    let op = '';
    if (operation === 'generate') {
      op = 'generate_by_text';
      if (!prompt.trim()) {
        setError('Por favor ingresa un prompt para generar el video');
        setLoading(false);
        return;
      }
      payload = {
        operation: op,
        text_prompt: prompt,
        model,
        width,
        height,
        motion,
        seed,
        time
      };
    } else if (operation === 'edit') {
      op = imgPrompt && prompt ? 'generate_by_image_and_text' : 'generate_by_image';
      if (!imgPrompt) {
        setError('Por favor ingresa la URL de la imagen/video a editar');
        setLoading(false);
        return;
      }
      payload = {
        operation: op,
        img_prompt: imgPrompt,
        model,
        image_as_end_frame: imageAsEndFrame,
        flip,
        motion,
        seed,
        time
      };
      if (op === 'generate_by_image_and_text') {
        payload.text_prompt = prompt;
      }
    } else if (operation === 'enhance') {
      op = imgPrompt && prompt ? 'generate_by_image_and_text' : 'generate_by_image';
      if (!imgPrompt) {
        setError('Por favor ingresa la URL de la imagen/video a mejorar');
        setLoading(false);
        return;
      }
      payload = {
        operation: op,
        img_prompt: imgPrompt,
        model,
        image_as_end_frame: imageAsEndFrame,
        flip,
        motion,
        seed,
        time
      };
      if (op === 'generate_by_image_and_text') {
        payload.text_prompt = prompt;
      }
    }

    try {
      const res = await fetch('/api/runwayml/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Error al procesar el video');
        setLoading(false);
        return;
      }
      // Suponemos que la respuesta contiene una URL del video generado
      setGeneratedVideo({
        videoUrl: data.result_url || data.url || data.video_url || '',
        raw: data,
        operation: op,
        model,
        prompt,
        imgPrompt,
        width,
        height,
        motion,
        seed,
        time,
        imageAsEndFrame,
        flip,
        timestamp: new Date().toLocaleString()
      });
      setHistory(prev => [{
        videoUrl: data.result_url || data.url || data.video_url || '',
        raw: data,
        operation: op,
        model,
        prompt,
        imgPrompt,
        width,
        height,
        motion,
        seed,
        time,
        imageAsEndFrame,
        flip,
        timestamp: new Date().toLocaleString()
      }, ...prev]);
      setPrompt('');
      setImgPrompt('');
    } catch (err) {
      setError(err.message || 'Error al procesar el video');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `runway_${Date.now()}.mp4`;
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
        RunwayML
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera y edita videos usando IA con RunwayML
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
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
                  
                  {(operation === 'edit' || operation === 'enhance') && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="URL de la imagen/video"
                        value={imgPrompt}
                        onChange={(e) => setImgPrompt(e.target.value)}
                        multiline
                        rows={4}
                        required={operation === 'edit' || operation === 'enhance'}
                        placeholder={operation === 'edit' || operation === 'enhance' ? 'Ingrese la URL de la imagen/video...' : ''}
                      />
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      multiline
                      rows={4}
                      required={operation === 'generate'}
                      placeholder={operation === 'generate' ? 'Describe el video que deseas generar...' : 'Describe los cambios que deseas aplicar...'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Modelo</InputLabel>
                      <Select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        label="Modelo"
                      >
                        {models.map((model) => (
                          <MenuItem key={model.value} value={model.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Speed />
                              {model.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Calidad</InputLabel>
                      <Select
                        value={parameters.quality}
                        onChange={(e) => setParameters(prev => ({ ...prev, quality: e.target.value }))}
                        label="Calidad"
                      >
                        {qualities.map((quality) => (
                          <MenuItem key={quality.value} value={quality.value}>
                            {quality.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography gutterBottom>Duración (segundos)</Typography>
                    <Slider
                      value={parameters.duration}
                      onChange={handleParameterChange('duration')}
                      min={1}
                      max={10}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography gutterBottom>FPS</Typography>
                    <Slider
                      value={parameters.fps}
                      onChange={handleParameterChange('fps')}
                      min={24}
                      max={60}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || (operation === 'generate' && !prompt.trim()) || ((operation === 'edit' || operation === 'enhance') && !imgPrompt)}
                      startIcon={<VideoFile />}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Procesar Video'}
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
                Procesando video...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {generatedVideo && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Video Procesado
                </Typography>
                <Tooltip title="Descargar video">
                  <IconButton onClick={handleDownload}>
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <video
                  src={generatedVideo.videoUrl}
                  controls
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip icon={operations.find(o => o.value === generatedVideo.operation)?.icon} 
                      label={operations.find(o => o.value === generatedVideo.operation)?.label} 
                      color="primary" />
                <Chip icon={<Speed />} 
                      label={models.find(m => m.value === generatedVideo.model)?.label} />
                <Chip label={`Duración: ${generatedVideo.metadata.duration}`} />
                <Chip label={`FPS: ${generatedVideo.metadata.fps}`} />
                <Chip label={`Calidad: ${generatedVideo.metadata.quality}`} />
                <Chip label={`Resolución: ${generatedVideo.metadata.resolution}`} />
              </Box>
              
              {generatedVideo.prompt && (
                <Typography variant="body2" color="text.secondary">
                  Prompt: {generatedVideo.prompt}
                </Typography>
              )}
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
                              <video
                                src={item.videoUrl}
                                controls
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                              <Chip icon={<Speed />} 
                                    label={models.find(m => m.value === item.model)?.label} 
                                    size="small" />
                              <Chip label={`Duración: ${item.metadata.duration}`} size="small" />
                              <Chip label={`FPS: ${item.metadata.fps}`} size="small" />
                            </Box>
                            {item.prompt && (
                              <Typography variant="body2" color="text.secondary">
                                Prompt: {item.prompt}
                              </Typography>
                            )}
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
                <ListItem>
                  <ListItemText
                    primary="Modelo"
                    secondary={models.find(m => m.value === model)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Calidad"
                    secondary={qualities.find(q => q.value === parameters.quality)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Duración"
                    secondary={`${parameters.duration} segundos`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="FPS"
                    secondary={parameters.fps}
                  />
                </ListItem>
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
                    secondary="MP4, MOV, AVI, WEBM"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tamaño máximo"
                    secondary="100MB por video"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Duración recomendada"
                    secondary="Máximo 10 segundos por video"
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

export default RunwayML; 