import { useState, useEffect } from 'react';
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
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  CloudUpload, 
  Delete, 
  FilePresent,
  Download,
  Image
} from '@mui/icons-material';
import axios from 'axios';

const ImageConverter = ({ setError }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [pingResult, setPingResult] = useState(null);
  
  // Probar el endpoint de ping al montar el componente
  useEffect(() => {
    const testPing = async () => {
      try {
        console.log("Probando endpoint /api/file-converter/ping...");
        const response = await axios.get('/api/file-converter/ping');
        console.log("Respuesta de ping:", response.data);
        setPingResult(response.data.message);
      } catch (err) {
        console.error("Error al probar ping:", err);
        setPingResult(`Error: ${err.response?.status || 'Desconocido'}`);
      }
    };
    
    testPing();
  }, []);
  
  // Formatos soportados para conversión
  const supportedFormats = [
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'bmp', label: 'BMP' },
    { value: 'gif', label: 'GIF' },
    { value: 'tiff', label: 'TIFF' }
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    console.log("Archivo seleccionado:", selectedFile);
    
    // Verificar que es una imagen
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/gif', 'image/tiff'];
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Solo se permiten imágenes (JPG, PNG, WebP, BMP, GIF, TIFF)');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setConvertedFile(null);

    // Auto-seleccionar un formato destino diferente al actual
    const currentExt = selectedFile.name.split('.').pop().toLowerCase();
    console.log("Extensión del archivo:", currentExt);
    const availableFormats = supportedFormats.filter(format => 
      !(format.value === currentExt || (currentExt === 'jpg' && format.value === 'jpeg') || (currentExt === 'jpeg' && format.value === 'jpg'))
    );
    console.log("Formatos disponibles:", availableFormats);
    if (availableFormats.length > 0) {
      setTargetFormat(availableFormats[0].value);
    }
  };

  const handleFormatChange = (event) => {
    setTargetFormat(event.target.value);
    console.log("Formato destino seleccionado:", event.target.value);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Por favor selecciona una imagen');
      return;
    }

    if (!targetFormat) {
      setError('Por favor selecciona un formato de destino');
      return;
    }
    
    setLoading(true);
    console.log("Iniciando conversión de", file.name, "a formato", targetFormat);
    
    try {
      // Obtener el formato original del archivo
      const originalExt = file.name.split('.').pop().toLowerCase();
      let fromFormat = originalExt;
      let toFormat = targetFormat;
      
      // Normalizar jpg/jpeg para la URL de la API
      if (fromFormat === 'jpg') fromFormat = 'jpeg';
      if (toFormat === 'jpg') toFormat = 'jpeg';
      
      console.log(`Convirtiendo de ${fromFormat} a ${toFormat}`);
      
      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("FormData preparado:", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fromFormat,
        toFormat
      });
      
      // Construir URL con formato específico
      const apiUrl = `/api/file-converter/${fromFormat}-to-${toFormat}`;
      console.log("URL a usar:", apiUrl);
      
      // Realizar la solicitud usando la ruta específica
      console.log(`Enviando solicitud a ${apiUrl}...`);
      const response = await axios.post(apiUrl, formData, {
        responseType: 'blob', // Importante para manejar archivos binarios
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Procesar la respuesta
      console.log("Respuesta recibida:", response);
      console.log("Headers:", response.headers);
      console.log("Status:", response.status);
      
      let contentType = response.headers['content-type'];
      if (!contentType) {
        // Mapeo de formato a tipo MIME si no viene en el header
        const mimeMap = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp',
          'bmp': 'image/bmp',
          'gif': 'image/gif',
          'tiff': 'image/tiff'
        };
        contentType = mimeMap[targetFormat] || 'application/octet-stream';
      }
      
      const blob = new Blob([response.data], { type: contentType });
      const fileName = file.name.split('.').slice(0, -1).join('.') + '.' + targetFormat;
      
      console.log("Blob creado:", {
        size: blob.size,
        type: blob.type,
        fileName: fileName
      });
      
      setConvertedFile({
        blob,
        fileName,
        size: blob.size,
        url: URL.createObjectURL(blob),
        type: contentType
      });
      
      setError(null);
      console.log("Conversión completada exitosamente");
    } catch (err) {
      console.error('Error al convertir imagen:', err);
      
      console.log("Error response:", err.response);
      
      // Intentar leer el mensaje de error si está disponible
      if (err.response && err.response.data) {
        try {
          // Si la respuesta es un blob, leerlo como texto
          const errorText = await new Response(err.response.data).text();
          console.log("Error text:", errorText);
          try {
            // Intentar parsear como JSON
            const errorJson = JSON.parse(errorText);
            console.log("Error JSON:", errorJson);
            setError(errorJson.error || 'Error al convertir la imagen');
          } catch {
            // Si no es JSON, mostrar el texto
            console.log("No es JSON, mostrando texto de error");
            setError(errorText || 'Error al convertir la imagen');
          }
        } catch (readError) {
          console.log("Error al leer la respuesta:", readError);
          setError(err.response.statusText || 'Error al convertir la imagen');
        }
      } else {
        console.log("No hay respuesta de error");
        setError('Error al conectar con el servidor');
      }
      
      setConvertedFile(null);
    } finally {
      setLoading(false);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setConvertedFile(null);
    setTargetFormat('');
    console.log("Formulario limpiado");
  };
  
  // Formatea el tamaño en bytes a una representación legible
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtener la extensión del archivo actual
  const getCurrentFileExtension = () => {
    if (!file) return '';
    const fileName = file.name.toLowerCase();
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  };

  // Filtrar formatos disponibles (no mostrar el formato actual)
  const getAvailableFormats = () => {
    const currentExt = getCurrentFileExtension();
    return supportedFormats.filter(format => 
      !(format.value === currentExt || 
        (currentExt === 'jpg' && format.value === 'jpeg') || 
        (currentExt === 'jpeg' && format.value === 'jpg'))
    );
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Convertidor de Imágenes
          </Typography>
          
          <Typography variant="body1" paragraph>
            Selecciona una imagen para convertirla entre diferentes formatos (JPG, PNG, WebP, etc.)
          </Typography>
          
          {pingResult && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Status: {pingResult}
            </Typography>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Subir imagen
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
                    id="imageFile"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/gif,image/tiff"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="imageFile">
                    <Button
                      component="span"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                    >
                      Seleccionar imagen
                    </Button>
                  </label>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Arrastra y suelta o selecciona una imagen
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
                    
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                      <InputLabel id="target-format-label">Formato destino</InputLabel>
                      <Select
                        labelId="target-format-label"
                        id="target-format"
                        value={targetFormat}
                        label="Formato destino"
                        onChange={handleFormatChange}
                        disabled={loading}
                      >
                        {getAvailableFormats().map((format) => (
                          <MenuItem key={format.value} value={format.value}>
                            {format.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <Image />}
                        onClick={handleFileUpload}
                        disabled={loading || !targetFormat}
                      >
                        {loading ? 'Convirtiendo...' : 'Convertir imagen'}
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
                      ¡Conversión completada! Tu imagen convertida está lista para descargar.
                    </Typography>
                    
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img 
                        src={convertedFile.url} 
                        alt="Vista previa" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'contain',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '4px'
                        }} 
                      />
                    </Box>
                    
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
                      La imagen convertida aparecerá aquí
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

export default ImageConverter; 