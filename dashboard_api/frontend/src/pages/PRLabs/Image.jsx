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

  const inputSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiInputBase-input': {
      height: 56,
      padding: '0 16px',
      boxSizing: 'border-box'
    }
  };

  const textareaSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      alignItems: 'flex-start',
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiInputBase-input': {
      padding: '16px',
      lineHeight: 1.5
    }
  };

  const actionButtonSx = {
    height: 56,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

  const secondaryButtonSx = {
    height: 48,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

  const paperSectionSx = {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    height: '100%'
  };

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
          <Paper sx={paperSectionSx}>
            <Typography variant="h6" component="h2">
              Configuración
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Describe la imagen que quieres generar"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={textareaSx}
            />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dimensiones (px)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 200px' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ancho"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    InputProps={{ inputProps: { min: 256, max: 1024, step: 64 } }}
                    sx={inputSx}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 200px' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Alto"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    InputProps={{ inputProps: { min: 256, max: 1024, step: 64 } }}
                    sx={inputSx}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pasos de generación
                </Typography>
                <Chip label={steps} size="small" color="primary" />
              </Box>
              <Slider
                value={steps}
                onChange={(_, value) => setSteps(value)}
                min={1}
                max={4}
                step={1}
                marks
                aria-label="Pasos de generación"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                startIcon={loading ? <CircularProgress size={24} /> : <ImageIcon />}
                fullWidth
                sx={{ ...actionButtonSx, maxWidth: 280 }}
              >
                {loading ? 'Generando...' : 'Generar imagen'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Paper sx={paperSectionSx}>
            <Typography variant="h6" component="h2">
              Vista previa
            </Typography>

            {generatedImage ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <PreviewImage src={generatedImage} alt="Imagen generada" />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    href={generatedImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={secondaryButtonSx}
                  >
                    Abrir en nueva pestaña
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    href={generatedImage}
                    download="imagen-generada.png"
                    sx={secondaryButtonSx}
                  >
                    Descargar imagen
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  backgroundColor: 'background.default',
                  color: 'text.secondary',
                  minHeight: 280,
                  minWidth: 580,
                  textAlign: 'center'
                }}
              >
                <Typography>
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