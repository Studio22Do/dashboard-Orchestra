import React, { useState } from 'react';
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
  TextField,
  Paper,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Psychology,
  Image,
  TrendingUp,
  Speed,
  Memory,
  Download,
  History,
  Refresh,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { APP_CONFIG } from '../../config/constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
}));

const ScoreCard = styled(Card)(({ theme, score }) => {
  let color = theme.palette.error.main;
  if (score >= 850) color = theme.palette.success.main;
  else if (score >= 800) color = theme.palette.info.main;
  else if (score >= 780) color = theme.palette.warning.main;
  else if (score >= 750) color = theme.palette.secondary.main;
  
  return {
    border: `2px solid ${color}`,
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${color}20`
    }
  };
});

const PicPulse = () => {
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v2';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [gender, setGender] = useState('Male');
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [analysisType, setAnalysisType] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const genderOptions = [
    { value: 'Male', label: 'Masculino' },
    { value: 'Female', label: 'Femenino' }
  ];

  const ageGroupOptions = [
    { value: '18-24', label: '18-24 años' },
    { value: '25-34', label: '25-34 años' },
    { value: '35-44', label: '35-44 años' },
    { value: '45-54', label: '45-54 años' },
    { value: '55+', label: '55+ años' }
  ];

  const getScoreColor = (score) => {
    if (score >= 850) return 'success';
    if (score >= 800) return 'info';
    if (score >= 780) return 'warning';
    if (score >= 750) return 'secondary';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 850) return 'Increíble';
    if (score >= 800) return 'Excelente';
    if (score >= 780) return 'Buena';
    if (score >= 750) return 'Above Average';
    if (score >= 720) return 'Decente';
    return 'Necesita Mejora';
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos JPG, JPEG y PNG');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const endpoint = analysisType === 'detailed' ? '/analyze-detailed' : '/analyze';
      
      // Crear FormData para enviar archivo
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('gender', gender);
      formData.append('age_group', ageGroup);
      
      const response = await fetch(`${API_BASE_URL}/picpulse${endpoint}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar la imagen');
      }
      
      const data = await response.json();
      setResults(data);
      
      // Agregar al historial
      setHistory(prev => [{
        imageName: selectedFile.name,
        results: data,
        timestamp: new Date().toLocaleString(),
        analysisType
      }, ...prev.slice(0, 9)]); // Mantener solo los últimos 10
      
    } catch (err) {
      setError(err.message || 'Error al analizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Psychology sx={{ color: 'primary.main' }} />
        PicPulse - Análisis de Calidad de Imágenes
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Analiza la calidad psicológica y estética de tus imágenes usando IA avanzada
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image />
              Análisis de Imagen
            </Typography>
            
            <Box component="form" onSubmit={handleAnalyze}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<Image />}
                      sx={{ height: '56px' }}
                    >
                      {selectedFile ? selectedFile.name : 'Seleccionar Imagen'}
                    </Button>
                  </label>
                  {selectedFile && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Género Objetivo</InputLabel>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      label="Género Objetivo"
                    >
                      {genderOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Grupo de Edad</InputLabel>
                    <Select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      label="Grupo de Edad"
                    >
                      {ageGroupOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Análisis</InputLabel>
                    <Select
                      value={analysisType}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      label="Tipo de Análisis"
                    >
                      <MenuItem value="basic">Análisis Básico</MenuItem>
                      <MenuItem value="detailed">Análisis Detallado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
                    sx={{ height: '56px' }}
                  >
                    {loading ? 'Analizando...' : 'Analizar Imagen'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>

          {loading && (
            <StyledPaper>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Analizando imagen con IA psicológica...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esto puede tomar unos segundos
                </Typography>
              </Box>
            </StyledPaper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {results && (
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Resultados del Análisis
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ScoreCard score={results.overall_impact_score || results.combined_score || 0}>
                    <CardContent>
                      <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 2 }}>
                        {results.overall_impact_score || results.combined_score || 0}
                      </Typography>
                      <Typography variant="h6" component="div" sx={{ textAlign: 'center', mb: 1 }}>
                        Impact Score
                      </Typography>
                      <Chip 
                        label={getScoreLabel(results.overall_impact_score || results.combined_score || 0)}
                        color={getScoreColor(results.overall_impact_score || results.combined_score || 0)}
                        sx={{ width: '100%' }}
                      />
                    </CardContent>
                  </ScoreCard>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed />
                      Attention Time
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {results.attention_time || 'N/A'} ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tiempo para captar atención
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Memory />
                      Memorabilidad
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {results.memorability || 'N/A'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Probabilidad de ser recordada
                    </Typography>
                  </Box>
                </Grid>
                
                {analysisType === 'detailed' && results.reasons && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Análisis Detallado
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2" whiteSpace="pre-line">
                        {results.reasons}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </StyledPaper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History />
                Historial
              </Typography>
              <Tooltip title="Limpiar historial">
                <IconButton onClick={handleClearHistory} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
            
            {history.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No hay análisis previos
              </Typography>
            ) : (
              <Box>
                {history.map((item, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.timestamp}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {item.imageName}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Score: ${item.results.overall_impact_score || item.results.combined_score || 0}`}
                        color={getScoreColor(item.results.overall_impact_score || item.results.combined_score || 0)}
                        size="small"
                      />
                      <Chip 
                        label={item.analysisType === 'detailed' ? 'Detallado' : 'Básico'}
                        variant="outlined"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </StyledPaper>
          
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info />
              Guía de Puntuaciones
            </Typography>
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>850+</span>
                  <Chip label="Increíble" color="success" size="small" />
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>800-849</span>
                  <Chip label="Excelente" color="info" size="small" />
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>780-799</span>
                  <Chip label="Buena" color="warning" size="small" />
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>750-779</span>
                  <Chip label="Above Average" color="secondary" size="small" />
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>720-749</span>
                  <Chip label="Decente" color="error" size="small" />
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PicPulse; 