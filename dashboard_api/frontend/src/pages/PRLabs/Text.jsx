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
  Chip,
  Tooltip
} from '@mui/material';
import { Send, TextFields } from '@mui/icons-material';
import { prlabsService } from '../../services/prlabs';
import { PR_LABS_CONFIG } from '../../config/prlabs';

const Text = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedText, setGeneratedText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await prlabsService.generateText(prompt, model);
      setGeneratedText(response.choices[0].text);
    } catch (err) {
      setError(err.message || 'Error al generar el texto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white', flex: 1 }}>
          <TextFields sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Generación de Texto
        </Typography>
        <Tooltip title="Costo por solicitud exitosa">
          <Chip color="secondary" label={`Puntos: ${PR_LABS_CONFIG.COSTS.TEXT}`} />
        </Tooltip>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Modelo</InputLabel>
                  <Select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    label="Modelo"
                  >
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="deepseek">DeepSeek</MenuItem>
                    <MenuItem value="mixtral">Mixtral</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Escribe tu prompt aquí..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !prompt}
                  startIcon={loading ? <CircularProgress size={24} /> : <Send />}
                >
                  Generar
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {generatedText && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={generatedText}
                    label="Texto Generado"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Text; 