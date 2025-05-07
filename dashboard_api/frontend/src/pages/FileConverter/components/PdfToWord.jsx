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
  PictureAsPdf
} from '@mui/icons-material';
import axios from 'axios';

const PdfToWord = ({ setError }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    console.log("Archivo seleccionado:", selectedFile);
    
    // Verificar que es un PDF
    if (selectedFile.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setConvertedFile(null);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo PDF');
      return;
    }
    
    setLoading(true);
    console.log("Iniciando conversión de", file.name, "a Word");
    
    try {
      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("FormData preparado:", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      
      // Realizar la solicitud
      console.log("Enviando solicitud a /api/file-converter/pdf-to-word...");
      const response = await axios.post('/api/file-converter/pdf-to-word', formData, {
        responseType: 'blob', // Importante para manejar archivos binarios
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Procesar la respuesta
      console.log("Respuesta recibida:", response);
      console.log("Headers:", response.headers);
      console.log("Status:", response.status);
      
      const contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const blob = new Blob([response.data], { type: contentType });
      const fileName = file.name.replace(/\.pdf$/i, '.docx');
      
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
      console.error('Error al convertir PDF:', err);
      
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
            setError(errorJson.error || 'Error al convertir el PDF');
          } catch {
            // Si no es JSON, mostrar el texto
            console.log("No es JSON, mostrando texto de error");
            setError(errorText || 'Error al convertir el PDF');
          }
        } catch (readError) {
          console.log("Error al leer la respuesta:", readError);
          setError(err.response.statusText || 'Error al convertir el PDF');
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

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Convertidor de PDF a Word
          </Typography>
          
          <Typography variant="body1" paragraph>
            Selecciona un archivo PDF para convertirlo a formato Word (.docx)
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Subir archivo PDF
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
                    id="pdfFile"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="pdfFile">
                    <Button
                      component="span"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                    >
                      Seleccionar PDF
                    </Button>
                  </label>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Arrastra y suelta o selecciona un archivo PDF
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
                        startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
                        onClick={handleFileUpload}
                        disabled={loading}
                      >
                        {loading ? 'Convirtiendo...' : 'Convertir a Word'}
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
                      ¡Conversión completada! Tu documento Word está listo para descargar.
                    </Typography>
                    
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Typography variant="h6" gutterBottom>
                        {convertedFile.fileName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Tamaño: {formatFileSize(convertedFile.size)}
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<Download />}
                        href={convertedFile.url}
                        download={convertedFile.fileName}
                        size="large"
                      >
                        Descargar Documento
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      El documento Word convertido aparecerá aquí
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

export default PdfToWord; 