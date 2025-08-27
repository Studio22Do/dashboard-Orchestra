import React from 'react';
import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Alert,
  Box,
  CircularProgress,
  Tooltip,
  Chip
} from '@mui/material';
import axiosInstance from '../../config/axios';
import { Star } from '@mui/icons-material';
import picPulseIcon from '../../assets/images/apps/icons/Picpulseicon.png';

const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#272038',
  color: '#ffffff',
  padding: '24px',
  marginBottom: '24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
}));

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  marginTop: '20px',
  border: '2px dashed #6c5ce7',
  borderRadius: '8px',
  padding: '10px'
});

const DropZone = styled('div')(({ isDragging }) => ({
  border: `2px dashed ${isDragging ? '#6c5ce7' : '#444'}`,
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '20px',
  backgroundColor: isDragging ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
  transition: 'all 0.3s ease'
}));

const ResultCard = styled(Paper)({
  backgroundColor: '#2d2649',
  padding: '15px',
  marginTop: '20px',
  borderRadius: '8px'
});

const PicPulse = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [gender, setGender] = useState('Female');
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const validateFile = (file) => {
    // Validar tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos PNG y JPG/JPEG');
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('El archivo no debe superar los 5MB');
    }

    // Validar nombre (no espacios ni caracteres especiales)
    if (/[^a-zA-Z0-9._-]/.test(file.name)) {
      throw new Error('El nombre del archivo solo debe contener letras, números, guiones y puntos');
    }

    // Validar dimensiones mínimas/máximas
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          reject(new Error('La imagen debe tener al menos 100x100 píxeles'));
        } else if (img.width > 4000 || img.height > 4000) {
          reject(new Error('La imagen no debe exceder 4000x4000 píxeles'));
        } else {
          resolve();
        }
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen para validación'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await validateFile(file);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await validateFile(file);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('gender', gender);
    formData.append('age_group', ageGroup);

    // Logs para debugging
    console.log('Archivo seleccionado:', selectedFile);
    console.log('Parámetros:', { gender, ageGroup });
    console.log('FormData contenido:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log('Enviando solicitud a:', `/api/${API_MODE}/picpulse/analyze-detailed`);
      const response = await axiosInstance.post(
        `/api/${API_MODE}/picpulse/analyze-detailed`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Respuesta:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Error al analizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          PicPulse - Análisis de Imágenes
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Analiza imágenes y obtén insights detallados usando IA avanzada
        </Typography>
        <Chip
          icon={<img src={picPulseIcon} alt="PicPulse" style={{ width: '20px', height: '20px' }} />}
          label="Análisis inteligente de imágenes con IA"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por análisis"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <StyledPaper>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Para mejores resultados:
          </Typography>
          <ul>
            <li>Usa imágenes de logos o diseños de marca</li>
            <li>Evita fotos de personas o capturas de pantalla</li>
            <li>Formato PNG o JPG/JPEG (max 2MB)</li>
            <li>Dimensiones entre 100x100 y 4000x4000 píxeles</li>
            <li>Nombres sin espacios ni caracteres especiales</li>
          </ul>
        </Alert>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Género Objetivo</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Género Objetivo"
          >
            <MenuItem value="Female">Femenino</MenuItem>
            <MenuItem value="Male">Masculino</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Grupo de Edad</InputLabel>
          <Select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            label="Grupo de Edad"
          >
            <MenuItem value="25-34">25-34 años (Recomendado)</MenuItem>
          </Select>
        </FormControl>

        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-input"
        />

        <DropZone
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input').click()}
        >
          <Typography>
            {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
          </Typography>
        </DropZone>

        {previewUrl && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <ImagePreview src={previewUrl} alt="Preview" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          fullWidth
          sx={{ mt: 3, height: '56px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analizar Imagen'}
        </Button>

        {result && (
          <ResultCard>
            <Typography variant="h6" gutterBottom>
              Resultados del Análisis
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <Tooltip title="Tiempo estimado que un usuario prestaría atención a la imagen">
                  <span>⏱️ Tiempo de Atención: {result.attention_time_ms}ms</span>
                </Tooltip>
              </Typography>
              <Typography variant="body1">
                <Tooltip title="Probabilidad de que la imagen sea del agrado del público objetivo">
                  <span>👍 Probabilidad de Gustar: {Math.round(result.probability_of_liking * 100)}%</span>
                </Tooltip>
              </Typography>
              <Typography variant="body1">
                <Tooltip title="Puntuación general combinada de la imagen">
                  <span>🎯 Puntuación Combinada: {result.combined_score}/1000</span>
                </Tooltip>
              </Typography>
            </Box>
          </ResultCard>
        )}
      </StyledPaper>
    </Container>
  );
};

export default PicPulse; 