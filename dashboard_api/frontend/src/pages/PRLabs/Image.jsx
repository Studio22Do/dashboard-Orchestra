import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PR_LABS_CONFIG } from '../../config/prlabs';
import { useDispatch } from 'react-redux';
import { setBalance } from '../../redux/slices/creditsSlice';

const ImageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: 8,
  marginTop: 16
});

const PRLabsImage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const API_VERSION = 'beta_v2';
      // Usar la variable de entorno para la URL base de la API
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/${API_VERSION}/prlabs/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          text: prompt,
          width,
          height,
          steps
        })
      });

      const data = await response.json();
      // Actualizar créditos si viene en la respuesta (fetch no pasa por el interceptor)
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }
      setGeneratedImage(data.generated_image);
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error apropiadamente
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageContainer maxWidth="lg">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/prlabs')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="bold">
            Generador de Imágenes
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Crea imágenes asombrosas con IA
          </Typography>
        </Box>
        <Tooltip title="Costo por imagen generada exitosa">
          <Chip color="secondary" label={`Puntos: ${PR_LABS_CONFIG.COSTS.IMAGE}`} />
        </Tooltip>
      </Box>

      <Grid container spacing={4}>
        {/* Controls */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuración
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Describe la imagen que quieres generar"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Dimensiones</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Ancho"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 256, max: 1024, step: 64 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Alto"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 256, max: 1024, step: 64 } }}
                />
              </Grid>
            </Grid>

            <Typography gutterBottom>Pasos de Generación: {steps}</Typography>
            <Slider
              value={steps}
              onChange={(_, value) => setSteps(value)}
              min={1}
              max={4}
              step={1}
              marks
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <ImageIcon />}
            >
              {loading ? 'Generando...' : 'Generar Imagen'}
            </Button>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Vista Previa
            </Typography>
            
            {generatedImage ? (
              <Box flex={1} display="flex" flexDirection="column">
                <PreviewImage src={generatedImage} alt="Generated" />
                <Button
                  variant="outlined"
                  href={generatedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Abrir en Nueva Pestaña
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  href={generatedImage}
                  download="imagen-generada.png"
                  sx={{ mt: 2 }}
                >
                  Descargar Imagen
                </Button>
              </Box>
            ) : (
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
              >
                <Typography color="text.secondary">
                  La imagen generada aparecerá aquí
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </ImageContainer>
  );
};

export default PRLabsImage; 