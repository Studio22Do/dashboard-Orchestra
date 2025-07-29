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
  marginTop: '5em',
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
  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `${APP_CONFIG.API_URL}/api/${API_MODE}`;
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gender, setGender] = useState('Male');
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [analysisType, setAnalysisType] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
      } else {
        setError('Por favor selecciona un archivo de imagen válido (JPG, PNG)');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen para analizar');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('gender', gender);
    formData.append('age_group', ageGroup);

    try {
      const endpoint = analysisType === 'detailed' ? 'analyze-detailed' : 'analyze';
      const response = await fetch(`${API_BASE_URL}/picpulse/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error al analizar la imagen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderScore = (score) => {
    let label = 'Bajo impacto';
    if (score >= 850) label = '¡Excelente!';
    else if (score >= 800) label = 'Muy bueno';
    else if (score >= 780) label = 'Bueno';
    else if (score >= 750) label = 'Aceptable';

    return (
      <ScoreCard score={score}>
        <CardContent>
          <Typography variant="h3" align="center" gutterBottom>
            {score}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            {label}
          </Typography>
        </CardContent>
      </ScoreCard>
    );
  };

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              PicPulse - Análisis de Imágenes
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Analiza el impacto psicológico y la calidad de tus imágenes usando IA avanzada
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              ) : (
                <Box>
                  <Image sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography>
                    Haz clic o arrastra una imagen aquí
                  </Typography>
                </Box>
              )}
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Género Objetivo</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Género Objetivo"
                  >
                    <MenuItem value="Male">Masculino</MenuItem>
                    <MenuItem value="Female">Femenino</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Grupo de Edad</InputLabel>
                  <Select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    label="Grupo de Edad"
                  >
                    <MenuItem value="18-24">18-24 años</MenuItem>
                    <MenuItem value="25-34">25-34 años</MenuItem>
                    <MenuItem value="35-44">35-44 años</MenuItem>
                    <MenuItem value="45-54">45-54 años</MenuItem>
                    <MenuItem value="55+">55+ años</MenuItem>
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
                    <MenuItem value="basic">Básico</MenuItem>
                    <MenuItem value="detailed">Detallado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
                >
                  {loading ? 'Analizando...' : 'Analizar Imagen'}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {result && (
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h5" gutterBottom>
                  Resultados del Análisis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    {renderScore(result.overall_impact_score)}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Tiempo de Atención: {result.attention_time}ms
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((1000 - result.attention_time) / 10, 100)}
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Memorabilidad: {result.memorability}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={result.memorability}
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>
          )}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default PicPulse; 