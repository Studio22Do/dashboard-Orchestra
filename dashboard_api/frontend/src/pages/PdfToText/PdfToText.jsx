import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance } from '../../redux/slices/creditsSlice';
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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  Description,
  Upload,
  TextFields,
  CheckCircle,
  Error,
  Star
} from '@mui/icons-material';
import axiosInstance from '../../config/axios';

const PdfToText = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convertedText, setConvertedText] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractedPages, setExtractedPages] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgFormat, setImgFormat] = useState('jpeg');
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(null);
  const [imgResultUrl, setImgResultUrl] = useState(null);
  const [imgResultType, setImgResultType] = useState(null);
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isMultiPage, setIsMultiPage] = useState(false);

  // Resetear valores cuando cambie el archivo
  useEffect(() => {
    if (!imgFile) {
      setStartPage(0);
      setEndPage(0);
      setPageCount(0);
      setIsMultiPage(false);
    }
  }, [imgFile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Por favor selecciona un archivo PDF');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: (selectedFile.size / 1024 / 1024).toFixed(2),
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString()
      });
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor selecciona un archivo PDF');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('pdfFile', file);
      
      // Llamar a la API real de PDF to Text con la ruta correcta
      const response = await axiosInstance.post('/api/beta_v2/pdf-converter/to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Actualizar créditos si la respuesta los incluye
      if (response.data && response.data.credits_info && typeof response.data.credits_info.remaining === 'number') {
        dispatch(setBalance(response.data.credits_info.remaining));
      }
      
      if (response.data && response.data.status === 'Success' && Array.isArray(response.data.data)) {
        // Combinar el texto de todas las páginas
        const fullText = response.data.data.map(page => page.content).join('\n\n');
        
        setConvertedText({
          text: fullText,
          stats: {
            characters: fullText.length,
            words: fullText.split(/\s+/).filter(word => word.length > 0).length,
            paragraphs: fullText.split(/\n\s*\n/).length,
            lines: fullText.split('\n').length
          },
          pages: response.data.data // Guardar también los datos por página
        });
        
        setError(null);
      } else {
        setError('No se pudo extraer el texto del PDF. Verifica que el archivo no esté protegido.');
      }
    } catch (err) {
      console.error('Error converting PDF:', err);
      setError(err.response?.data?.error || err.message || 'Error al convertir el PDF');
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

  const handleExtractFromUrl = async () => {
    if (!pdfUrl.trim()) {
      setError('Por favor ingresa una URL de PDF');
      return;
    }
    setExtracting(true);
    setError(null);
    setExtractedPages(null);
    try {
      // Usar el endpoint correcto para URLs de PDF
      const response = await axiosInstance.get('/api/beta_v2/pdf-converter/to-text-url', {
        params: { pdfUrl }
      });
      
      // Actualizar créditos si la respuesta los incluye
      if (response.data && response.data.credits_info && typeof response.data.credits_info.remaining === 'number') {
        dispatch(setBalance(response.data.credits_info.remaining));
      }
      
      if (response.data && response.data.status === 'Success' && Array.isArray(response.data.data)) {
        setExtractedPages(response.data.data);
      } else {
        setError('No se pudo extraer el texto del PDF');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al extraer el texto del PDF');
    } finally {
      setExtracting(false);
    }
  };

  const handleImgFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setImgError('Por favor selecciona un archivo PDF');
        setImgFile(null);
        return;
      }
      
      if (selectedFile.size === 0) {
        setImgError('El archivo está vacío');
        setImgFile(null);
        return;
      }
      
      setImgFile(selectedFile);
      setImgError(null);
      setImgResultUrl(null);
      setImgResultType(null);
      
      // Detectar si es un PDF de múltiples páginas
      const reader = new FileReader();
      reader.onload = function(e) {
        const arr = new Uint8Array(e.target.result);
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === 0x25 && arr[i + 1] === 0x50 && arr[i + 2] === 0x44 && arr[i + 3] === 0x46) {
            // Buscar el patrón /Count en el PDF
            const str = new TextDecoder().decode(arr);
            const match = str.match(/\/Count\s+(\d+)/);
            if (match) {
              count = parseInt(match[1]);
              break;
            }
          }
        }
        setPageCount(count);
        setIsMultiPage(count > 1);
        
        // Si es múltiples páginas, cambiar automáticamente a TIF
        if (count > 1 && imgFormat === 'jpeg') {
          setImgFormat('tifflzw');
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setImgFile(null);
      setPageCount(0);
      setIsMultiPage(false);
    }
  };

  const handlePdfToImage = async (e) => {
    e.preventDefault();
    if (!imgFile) {
      setImgError('Por favor selecciona un archivo PDF');
      return;
    }
    
    setImgLoading(true);
    setImgError(null);
    setImgResultUrl(null);
    setImgResultType(null);
    try {
      const formData = new FormData();
      formData.append('pdfFile', imgFile);
      formData.append('imgFormat', imgFormat);
      
      // Agregar parámetros de páginas si están configurados
      if (startPage > 0 || endPage > 0) {
        formData.append('startPage', startPage);
        formData.append('endPage', endPage);
      }
      
      const response = await axiosInstance.post('/api/beta_v2/pdf-converter/to-image', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Respuesta recibida:', response);
      console.log('Headers:', response.headers);
      console.log('Data type:', typeof response.data);
      console.log('Data size:', response.data.size);
      
      // Verificar el tipo de contenido y manejar diferentes formatos
      const contentType = response.headers['content-type'];
      console.log('Content-Type detectado:', contentType);
      
      if (contentType && contentType.includes('zip')) {
        // Es un ZIP con múltiples imágenes
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        setImgResultUrl(url);
        setImgResultType('application/zip');
      } else if (contentType && (contentType.includes('tiff') || contentType.includes('tif'))) {
        // Es un archivo TIFF
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        setImgResultUrl(url);
        setImgResultType(contentType);
      } else if (contentType && contentType.startsWith('image/')) {
        // Es una imagen individual (JPEG, PNG, etc.)
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        setImgResultUrl(url);
        setImgResultType(contentType);
      } else {
        // Tipo no reconocido, asumir que es una imagen
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setImgResultUrl(url);
        setImgResultType('image/jpeg');
      }
      
      console.log('Archivo creado exitosamente:', url);
      
    } catch (err) {
      console.error('Error converting PDF to image:', err);
      setImgError(err.response?.data?.error || 'Error al convertir el PDF a imagen');
    } finally {
      setImgLoading(false);
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
          PDF to Text
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Convierte archivos PDF a texto editable
        </Typography>
        <Chip 
          icon={<Description />} 
          label="Extrae texto de PDFs y conviértelos a formatos editables" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1, mr: 1 }}
        />
        <Chip 
          icon={<Star />} 
          label="Costo: 2 puntos por conversión" 
          color="primary" 
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Extraer texto desde URL de PDF"
                  value={pdfUrl}
                  onChange={e => setPdfUrl(e.target.value)}
                  placeholder="Pega aquí la URL de un PDF público"
                  InputProps={{
                    startAdornment: (
                      <Description color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleExtractFromUrl}
                  disabled={extracting || loading}
                  sx={{ height: '56px' }}
                >
                  {extracting ? <CircularProgress size={24} /> : 'Extraer Texto'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload />}
                  sx={{ height: '56px' }}
                >
                  Seleccionar PDF
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
              {fileInfo && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Nombre del archivo" 
                          secondary={fileInfo.name} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Tamaño" 
                          secondary={`${fileInfo.size} MB`} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Description />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Última modificación" 
                          secondary={fileInfo.lastModified} 
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !file}
                  startIcon={<AutoAwesome />}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Convertir a Texto'}
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
            Convirtiendo PDF a texto...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && convertedText && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Texto Convertido
                    </Typography>
                    <Box>
                      <Tooltip title="Copiar">
                        <IconButton onClick={() => handleCopy(convertedText.text)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(convertedText.text, 'texto-convertido.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {convertedText.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estadísticas del Texto
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Caracteres" 
                        secondary={convertedText.stats.characters.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Palabras" 
                        secondary={convertedText.stats.words.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Párrafos" 
                        secondary={convertedText.stats.paragraphs.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TextFields />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Líneas" 
                        secondary={convertedText.stats.lines.toLocaleString()} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {extractedPages && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Texto extraído por página
          </Typography>
          <List>
            {extractedPages.map((page) => (
              <React.Fragment key={page.pageNo}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <TextFields />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Página ${page.pageNo}`}
                    secondary={
                      <Box sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
                        {page.content}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Sección PDF a Imagen */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Convertir PDF a Imagen
          </Typography>
          <Box component="form" onSubmit={handlePdfToImage}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload />}
                  sx={{ height: '56px' }}
                >
                  Seleccionar PDF
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleImgFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Formato de Imagen"
                  value={imgFormat}
                  onChange={e => setImgFormat(e.target.value)}
                >
                  <MenuItem value="jpeg">JPEG</MenuItem>
                  <MenuItem value="tifflzw">TIFF (multi-página)</MenuItem>
                  <MenuItem value="pnggray">PNG Gray</MenuItem>
                  <MenuItem value="png256">PNG 256</MenuItem>
                  <MenuItem value="png16">PNG 16</MenuItem>
                  <MenuItem value="png16m">PNG 16M</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Página inicial"
                  type="number"
                  value={startPage}
                  onChange={e => setStartPage(parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: pageCount - 1 }}
                  disabled={pageCount === 0}
                  helperText={pageCount > 0 ? `0 a ${pageCount - 1}` : 'Selecciona un PDF'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Página final"
                  type="number"
                  value={endPage}
                  onChange={e => setEndPage(parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: pageCount - 1 }}
                  disabled={pageCount === 0}
                  helperText={pageCount > 0 ? `0 = hasta el final` : 'Selecciona un PDF'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={imgLoading || !imgFile}
                  startIcon={<AutoAwesome />}
                  sx={{ height: '56px' }}
                >
                  {imgLoading ? <CircularProgress size={24} /> : 'Convertir a Imagen'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* Información del PDF */}
          {imgFile && pageCount > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                📄 PDF seleccionado: <strong>{imgFile.name}</strong> ({pageCount} página{pageCount > 1 ? 's' : ''})
              </Typography>
              {isMultiPage && (
                <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                  ⚠️ PDF de múltiples páginas detectado. Para mejor compatibilidad, se recomienda usar formato TIFF.
                </Typography>
              )}
            </Box>
          )}
          
          {/* Solo mostrar error si realmente hay un error */}
          {imgError && !imgResultUrl && (
            <Alert severity="error" sx={{ mt: 2 }}>{imgError}</Alert>
          )}
          
          {imgResultUrl && imgResultType && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              {imgResultType === 'image/tiff' || imgResultType === 'image/tif' ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>Archivo TIFF generado:</Typography>
                  <Box sx={{ 
                    width: 200, 
                    height: 200, 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'grey.100', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed grey'
                  }}>
                    <Typography variant="h4" color="text.secondary">
                      📄 TIFF
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Formato TIFF generado exitosamente. Los navegadores no pueden mostrar este formato, pero puedes descargarlo.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    href={imgResultUrl}
                    download={`pdf-convertido.tiff`}
                  >
                    Descargar Archivo TIFF
                  </Button>
                </>
              ) : imgResultType.startsWith('image/') && !imgResultType.includes('tiff') ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>Imagen generada:</Typography>
                  <img src={imgResultUrl} alt="PDF convertido" style={{ maxWidth: '100%', maxHeight: 400 }} />
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    href={imgResultUrl}
                    download={`pdf-convertido.${imgFormat}`}
                  >
                    Descargar Imagen
                  </Button>
                </>
              ) : imgResultType === 'application/zip' ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>Archivo ZIP generado:</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    El PDF contiene múltiples páginas. Se ha generado un archivo ZIP con todas las imágenes.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    href={imgResultUrl}
                    download={`pdf-convertido-multipagina.zip`}
                  >
                    Descargar ZIP con Imágenes
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" gutterBottom>Archivo generado:</Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    href={imgResultUrl}
                    download={`pdf-convertido.${imgFormat}`}
                  >
                    Descargar Archivo
                  </Button>
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PdfToText; 