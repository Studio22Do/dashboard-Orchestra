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
  InputLabel,
  Chip,
  InputAdornment
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  ShoppingBag,
  Category,
  PriceChange,
  Description,
  Star
} from '@mui/icons-material';
import productIcon from '../../assets/images/apps/icons/productdescriptionicon.png';

const ProductDescriptionGenerator = () => {
  // Estilos para inputs consistentes
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 2,
      backgroundColor: 'transparent',
      '& fieldset': { 
        borderColor: 'rgba(0,0,0,0.23)',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': { 
        borderColor: 'rgba(0,0,0,0.35)',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: '2px'
      },
      // Evitar color azul del autofill manteniendo el color del tema
      '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
        transition: 'background-color 5000s ease-in-out 0s',
        caretColor: '#fff',
      },
      '& input:-webkit-autofill:hover': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
      },
      '& input:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
      },
      '& input:-webkit-autofill:active': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
      },
    },
    '& .MuiInputBase-input': {
      padding: '16px 14px',
      backgroundColor: 'transparent',
    }
  };

  const textareaSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
      '& fieldset': { 
        borderColor: 'rgba(0,0,0,0.23)',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': { 
        borderColor: 'rgba(0,0,0,0.35)',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: '2px'
      },
      // Evitar color azul del autofill manteniendo el color del tema
      '& textarea:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
        transition: 'background-color 5000s ease-in-out 0s',
        caretColor: '#fff',
      },
      '& textarea:-webkit-autofill:hover': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
      },
      '& textarea:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        WebkitTextFillColor: '#fff !important',
      },
    },
    '& .MuiInputBase-input': {
      padding: '16px',
      lineHeight: 1.5,
      backgroundColor: 'transparent',
    }
  };

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 2,
      '& fieldset': { 
        borderColor: 'rgba(0,0,0,0.23)',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': { 
        borderColor: 'rgba(0,0,0,0.35)',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: '2px'
      }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0
    }
  };

  const actionButtonSx = {
    height: 56,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600
  };

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
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          AI eCommerce Product Description Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Genera descripciones de productos optimizadas para eCommerce usando IA
        </Typography>
        <Chip
          icon={<img src={productIcon} alt="Product Description" style={{ width: '20px', height: '20px' }} />}
          label="Generador inteligente de descripciones para eCommerce"
          color="primary"
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip
          icon={<Star />}
          label="Costo: 2 puntos por generación"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Primera fila: Nombre del Producto (ocupa más espacio) */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
                sx={{ flex: '1 1 300px', ...inputSx }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingBag color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Segunda fila: Categoría, Precio y Tono */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Categoría"
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                sx={{ flex: '1 1 200px', minWidth: '200px', ...inputSx }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Precio"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
                sx={{ flex: '1 1 200px', minWidth: '200px', ...inputSx }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PriceChange color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ flex: '1 1 200px', minWidth: '200px', ...selectSx }}>
                <InputLabel>Tono</InputLabel>
                <Select
                  name="tone"
                  value={productData.tone}
                  onChange={handleInputChange}
                  label="Tono"
                >
                  <MenuItem value="professional">Profesional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="luxury">Lujo</MenuItem>
                  <MenuItem value="technical">Técnico</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Tercera fila: Características del Producto */}
            <Box>
              <TextField
                fullWidth
                label="Características del Producto"
                name="features"
                value={productData.features}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Describe las características principales, beneficios y detalles del producto..."
                sx={textareaSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <Description color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Botón de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !productData.name || !productData.category || !productData.price}
                startIcon={loading ? <CircularProgress size={24} /> : <AutoAwesome />}
                sx={{ ...actionButtonSx, minWidth: { xs: '100%', md: 240 } }}
                fullWidth
              >
                {loading ? 'Generando...' : 'Generar Descripción'}
              </Button>
            </Box>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, minWidth: 'fit-content' }}>
                      Título del Producto
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Copiar">
                        <IconButton 
                          onClick={() => handleCopy(generatedContent.title)}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton 
                          onClick={() => handleDownload(generatedContent.title, 'titulo.txt')}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <Download fontSize="small" />
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, minWidth: 'fit-content' }}>
                      Descripción Corta
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Copiar">
                        <IconButton 
                          onClick={() => handleCopy(generatedContent.shortDescription)}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton 
                          onClick={() => handleDownload(generatedContent.shortDescription, 'descripcion-corta.txt')}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <Download fontSize="small" />
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, minWidth: 'fit-content' }}>
                      Descripción Larga
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Copiar">
                        <IconButton 
                          onClick={() => handleCopy(generatedContent.longDescription)}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton 
                          onClick={() => handleDownload(generatedContent.longDescription, 'descripcion-larga.txt')}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <Download fontSize="small" />
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, minWidth: 'fit-content' }}>
                      Meta Descripción
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Copiar">
                        <IconButton 
                          onClick={() => handleCopy(generatedContent.metaDescription)}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton 
                          onClick={() => handleDownload(generatedContent.metaDescription, 'meta-descripcion.txt')}
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(0,0,0,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <Download fontSize="small" />
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