import { useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../config/axios';
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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  ShoppingBag,
  Category,
  PriceChange,
  Description
} from '@mui/icons-material';

const ProductDescriptionGenerator = () => {

  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    features: '',
    tone: 'professional'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/product-description`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productData.name || !productData.category || !productData.price) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Lógica real: llamada al backend
      const language = 'Spanish'; // Puedes hacer esto dinámico si lo deseas
      const name = productData.name;
      // Unimos categoría, precio y features en un solo string descriptivo
      const description = `${productData.category}, precio: ${productData.price}. ${productData.features}`;
      const response = await axiosInstance.post(`${API_BASE_URL}/generate`, {
        language,
        name,
        description
      });
      
      const data = response.data;
      if (!data.descriptions) {
        throw new Error(data.error || 'Error al generar la descripción');
      }
      // Usamos la primera descripción como título, la segunda como corta, la tercera como larga
      setGeneratedContent({
        title: data.descriptions[0] || '',
        shortDescription: data.descriptions[1] || '',
        longDescription: data.descriptions[2] || '',
        keywords: [name, productData.category, 'calidad premium', 'mejor precio', 'garantía', 'envío rápido'],
        metaDescription: data.descriptions[3] || ''
      });
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || 'Error al generar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI eCommerce Product Description Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera descripciones de productos optimizadas para eCommerce usando IA
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <ShoppingBag color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Categoría"
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <Category color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <PriceChange color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tono de la Descripción</InputLabel>
                  <Select
                    name="tone"
                    value={productData.tone}
                    onChange={handleInputChange}
                    label="Tono de la Descripción"
                  >
                    <MenuItem value="professional">Profesional</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="luxury">Lujo</MenuItem>
                    <MenuItem value="technical">Técnico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Características del Producto"
                  name="features"
                  value={productData.features}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <Description color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<AutoAwesome />}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generar Descripción'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Generando contenido optimizado...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && generatedContent && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Título del Producto
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.title)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.title, 'titulo.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    {generatedContent.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Descripción Corta
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.shortDescription)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.shortDescription, 'descripcion-corta.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    {generatedContent.shortDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Descripción Larga
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.longDescription)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.longDescription, 'descripcion-larga.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {generatedContent.longDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Palabras Clave
                  </Typography>
                  <List>
                    {generatedContent.keywords.map((keyword, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={keyword} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Meta Descripción
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(generatedContent.metaDescription)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(generatedContent.metaDescription, 'meta-descripcion.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    {generatedContent.metaDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default ProductDescriptionGenerator; 