import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Paper,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  CloudUpload, 
  Delete, 
  FilePresent,
  Download,
  Compress
} from '@mui/icons-material';
import axios from 'axios';

const RarToZip = ({ setError }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    if (!selectedFile.name.toLowerCase().endsWith('.rar')) {
      setError('Solo se permiten archivos RAR');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setConvertedFile(null);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo RAR');
      return;
    }
    
    setLoading(true);
    
    try {
      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      // Realizar la solicitud
      const response = await axios.post('/api/file-converter/rar-to-zip', formData, {
        responseType: 'blob', // Importante para manejar archivos binarios
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Procesar la respuesta
      const blob = new Blob([response.data], { type: 'application/zip' });
      const fileName = file.name.replace(/\.rar$/i, '.zip');
      
      setConvertedFile({
        blob,
        fileName,
        size: blob.size,
        url: URL.createObjectURL(blob)
      });
      
      setError(null);
    } catch (err) {
      console.error('Error al convertir archivo:', err);
      setError(err.response?.data?.error || 'Error al convertir el archivo RAR a ZIP');
      setConvertedFile(null);
    } finally {
      setLoading(false);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setConvertedFile(null);
  };
  
  // Formatea el tamaño en bytes a una representación legible
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Convertidor de RAR a ZIP
          </Typography>
          
          <Typography variant="body1" paragraph>
            Selecciona un archivo RAR para convertirlo a formato ZIP.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Subir archivo RAR
                </Typography>
                
                <Box 
                  sx={{ 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    py: 5, 
                    px: 2, 
                    textAlign: 'center',
                    mb: 2,
                    bgcolor: 'background.paper'
                  }}
                >
                  <input
                    type="file"
                    id="rarFile"
                    accept=".rar"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="rarFile">
                    <Button
                      component="span"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                    >
                      Seleccionar archivo RAR
                    </Button>
                  </label>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Arrastra y suelta o selecciona un archivo RAR
                  </Typography>
                </Box>
                
                {file && (
                  <Box>
                    <Divider sx={{ my: 2 }} />
                    <List disablePadding>
                      <ListItem>
                        <ListItemIcon>
                          <FilePresent />
                        </ListItemIcon>
                        <ListItemText 
                          primary={file.name}
                          secondary={formatFileSize(file.size)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={clearFile}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <Compress />}
                        onClick={handleFileUpload}
                        disabled={loading}
                      >
                        {loading ? 'Convirtiendo...' : 'Convertir a ZIP'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Resultado
                </Typography>
                
                {convertedFile ? (
                  <Box>
                    <Typography variant="body1" paragraph>
                      ¡Conversión completada! Tu archivo ZIP está listo para descargar.
                    </Typography>
                    <List disablePadding>
                      <ListItem>
                        <ListItemIcon>
                          <FilePresent />
                        </ListItemIcon>
                        <ListItemText 
                          primary={convertedFile.fileName}
                          secondary={formatFileSize(convertedFile.size)}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Download />}
                            href={convertedFile.url}
                            download={convertedFile.fileName}
                          >
                            Descargar
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      El archivo ZIP convertido aparecerá aquí
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RarToZip; 