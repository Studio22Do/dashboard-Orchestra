import React from 'react';
import { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { 
  ContentCopy,
  Download,
  AutoAwesome,
  Description,
  Upload,
  TextFields,
  CheckCircle,
  Error
} from '@mui/icons-material';
import axios from 'axios';

const PdfToText = () => {
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
      // Aquí irá la lógica de la API cuando esté disponible
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos el texto extraído
      const mockText = `Este es un ejemplo de texto extraído del PDF.
      
El texto se ha convertido correctamente y mantiene su formato original.

Puedes copiar o descargar el texto convertido para usarlo donde lo necesites.

El proceso de conversión ha sido exitoso.`;

      setConvertedText({
        text: mockText,
        stats: {
          characters: mockText.length,
          words: mockText.split(/\s+/).length,
          paragraphs: mockText.split(/\n\s*\n/).length,
          lines: mockText.split('\n').length
        }
      });
    } catch (err) {
      console.error('Error converting PDF:', err);
      setError(err.message || 'Error al convertir el PDF');
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
      setError('Por favor ingresa una URL de PDF válida');
      return;
    }
    setExtracting(true);
    setError(null);
    setExtractedPages(null);
    try {
      const response = await axios.post('/api/pdf-converter/to-text', { pdfUrl });
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
      setImgFile(selectedFile);
      setImgError(null);
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
      formData.append('file', imgFile);
      formData.append('imgFormat', imgFormat);
      // Puedes agregar startPage/endPage si lo deseas
      const response = await axios.post('/api/pdf-converter/to-image', formData, {
        responseType: 'blob',
      });
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      setImgResultUrl(url);
      setImgResultType(contentType);
    } catch (err) {
      setImgError('Error al convertir el PDF a imagen');
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        PDF to Text Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convierte archivos PDF a texto editable
      </Typography>

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
              <Grid item xs={12} md={4}>
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
          {imgError && (
            <Alert severity="error" sx={{ mt: 2 }}>{imgError}</Alert>
          )}
          {imgResultUrl && imgResultType && imgResultType.startsWith('image') && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
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
            </Box>
          )}
          {imgResultUrl && imgResultType && !imgResultType.startsWith('image') && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>Archivo generado (no visualizable):</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                href={imgResultUrl}
                download={`pdf-convertido.${imgFormat}`}
              >
                Descargar Archivo
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PdfToText; 