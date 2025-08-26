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
  Chip
} from '@mui/material';
import {
  Send,
  ContentCopy,
  Delete,
  SmartToy,
  Psychology,
  Lightbulb,
  History,
  Settings,
  Star
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const GenieAI = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const models = [
    { value: 'gpt-3.5-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Llamar a la API real de PRLabs
      const response = await axiosInstance.post('/api/beta_v2/prlabs/chat', {
        prompt: prompt,
        model: model,
        temperature: temperature
      });
      
      console.log('Respuesta completa de la API:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      
      const newMessage = {
        role: 'user',
        content: prompt,
        timestamp: new Date().toLocaleString()
      };
      
      const aiResponse = {
        role: 'assistant',
        content: response.data.response || response.data.message || response.data.content || JSON.stringify(response.data),
        timestamp: new Date().toLocaleString()
      };
      
      console.log('Mensaje del usuario:', newMessage);
      console.log('Respuesta de la IA:', aiResponse);
      
      setChatHistory(prev => [...prev, newMessage, aiResponse]);
      setPrompt('');
      
    } catch (err) {
      console.error('Error generating response:', err);
      setError(err.response?.data?.error || err.message || 'Error al generar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClearHistory = () => {
    setChatHistory([]);
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
          ChatGPT-4
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Interactúa con el modelo ChatGPT-4 de GenieAI para generar respuestas inteligentes
        </Typography>
        <Chip 
          icon={<Star />} 
          label="Costo: 2 puntos por prompt" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      multiline
                      rows={4}
                      required
                      placeholder="Escribe tu prompt aquí..."
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
                            {model.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Temperatura</InputLabel>
                      <Select
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        label="Temperatura"
                      >
                        <MenuItem value={0.3}>Baja (0.3)</MenuItem>
                        <MenuItem value={0.7}>Media (0.7)</MenuItem>
                        <MenuItem value={1.0}>Alta (1.0)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={<Send />}
                      sx={{ height: '56px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Enviar Prompt'}
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
                Generando respuesta...
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {chatHistory.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Chat
                </Typography>
                <Tooltip title="Limpiar historial">
                  <IconButton onClick={handleClearHistory}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <List>
                {chatHistory.map((message, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {message.role === 'user' ? (
                              <Chip icon={<Psychology />} label="Usuario" color="primary" size="small" />
                            ) : (
                              <Chip icon={<SmartToy />} label="GenieAI" color="secondary" size="small" />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {message.timestamp}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1">
                              {message.content}
                            </Typography>
                            <Tooltip title="Copiar respuesta">
                              <IconButton 
                                size="small" 
                                onClick={() => handleCopy(message.content)}
                                sx={{ mt: 1 }}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < chatHistory.length - 1 && <Divider />}
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
                    primary="Modelo Seleccionado"
                    secondary={models.find(m => m.value === model)?.label}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Temperatura"
                    secondary={`${temperature} (${temperature === 0.3 ? 'Baja' : temperature === 0.7 ? 'Media' : 'Alta'})`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Mensajes en el historial"
                    secondary={chatHistory.length}
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
                    primary="Sé específico en tus prompts"
                    secondary="Cuanto más detallado sea tu prompt, mejor será la respuesta"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Ajusta la temperatura"
                    secondary="Usa temperatura baja para respuestas más precisas y alta para más creatividad"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Experimenta con diferentes modelos"
                    secondary="Cada modelo tiene sus propias fortalezas y casos de uso"
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

export default GenieAI; 