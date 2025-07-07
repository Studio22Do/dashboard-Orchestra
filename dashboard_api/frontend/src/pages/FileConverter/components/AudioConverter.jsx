import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  AudioFile,
  Download,
  Delete,
  PlayArrow,
  Stop,
  VolumeUp,
  Refresh,
  Info
} from '@mui/icons-material';

const AudioConverter = ({ setError }) => {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Formatos soportados para audio
  const supportedFormats = {
    input: ['wav', 'ogg', 'ac3', 'aac', 'mp3', 'flac', 'm4a'],
    output: ['mp3', 'wav', 'ogg', 'aac', 'flac']
  };

  const formatLabels = {
    mp3: 'MP3 (MPEG Audio)',
    wav: 'WAV (Waveform Audio)',
    ogg: 'OGG (Ogg Vorbis)',
    aac: 'AAC (Advanced Audio Coding)',
    ac3: 'AC3 (Dolby Digital)',
    flac: 'FLAC (Free Lossless)',
    m4a: 'M4A (MPEG-4 Audio)'
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const validateFile = (file) => {
    const extension = getFileExtension(file.name);
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!supportedFormats.input.includes(extension)) {
      throw new Error(`Formato no soportado: .${extension}. Formatos permitidos: ${supportedFormats.input.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`El archivo es demasiado grande. Máximo permitido: 50MB`);
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    try {
      validateFile(selectedFile);
      setFile(selectedFile);
      setConvertedFile(null);
      setError(null);
      
      // Auto-seleccionar formato basado en input
      const extension = getFileExtension(selectedFile.name);
      if (extension !== 'mp3' && supportedFormats.output.includes('mp3')) {
        setTargetFormat('mp3');
      } else if (extension === 'mp3' && supportedFormats.output.includes('wav')) {
        setTargetFormat('wav');
      }
    } catch (err) {
      setError(err.message);
      setFile(null);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo de audio');
      return;
    }

    const inputFormat = getFileExtension(file.name);
    if (inputFormat === targetFormat) {
      setError('El formato de origen y destino son iguales');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);

      const response = await fetch('/api/file-converter/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al convertir el archivo');
      }

      const blob = await response.blob();
      const convertedFileName = `${file.name.split('.')[0]}.${targetFormat}`;
      
      setConvertedFile({
        blob,
        name: convertedFileName,
        size: blob.size,
        originalFile: file.name,
        originalFormat: inputFormat,
        targetFormat: targetFormat,
        timestamp: new Date().toLocaleString()
      });

      // Agregar al historial
      setConversionHistory(prev => [{
        id: Date.now(),
        originalFile: file.name,
        convertedFile: convertedFileName,
        originalFormat: inputFormat,
        targetFormat: targetFormat,
        originalSize: file.size,
        convertedSize: blob.size,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]); // Mantener solo los últimos 5

    } catch (err) {
      const errorMessage = err.message || 'Error al convertir el archivo';
      
      // Detectar si es un problema de API no disponible
      if (errorMessage.includes('502') || errorMessage.includes('unreachable') || errorMessage.includes('API provider')) {
        setError('⚠️ Servicio de conversión temporalmente no disponible. La API externa está experimentando problemas. Por favor intenta nuevamente en unos minutos.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = convertedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setConvertedFile(null);
    setError(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      {/* Banner informativo sobre el estado de la API */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>⚠️ Estado de la API:</strong> El servicio de conversión de audio está experimentando problemas temporales (Error 502). 
          Esta funcionalidad estará disponible cuando el proveedor de la API resuelva los problemas de infraestructura.
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          📅 Última verificación: {new Date().toLocaleString()} • 
          🔄 Reintenta en unos minutos
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel de subida de archivos */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3,
              border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
              backgroundColor: dragActive ? '#f3f7ff' : 'transparent',
              transition: 'all 0.3s ease'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CloudUpload sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Subir Archivo de Audio
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Arrastra tu archivo aquí o haz clic para seleccionar
              </Typography>
              
              <Button
                variant="contained"
                component="label"
                startIcon={<AudioFile />}
                sx={{ mb: 2 }}
              >
                Seleccionar Archivo
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept={supportedFormats.input.map(ext => `.${ext}`).join(',')}
                  onChange={handleFileInput}
                />
              </Button>

              <Typography variant="caption" display="block" color="text.secondary">
                Formatos soportados: {supportedFormats.input.join(', ').toUpperCase()}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Tamaño máximo: 50MB
              </Typography>
            </Box>
          </Paper>

          {/* Archivo seleccionado */}
          {file && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AudioFile sx={{ mr: 2, color: 'primary.main' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getFileSize(file.size)} • {formatLabels[getFileExtension(file.name)]}
                  </Typography>
                </Box>
                <Tooltip title="Remover archivo">
                  <IconButton onClick={resetConverter} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Reproductor de audio simple */}
              <Box sx={{ mb: 3 }}>
                <audio
                  ref={audioRef}
                  src={URL.createObjectURL(file)}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePlayPause} color="primary">
                    {isPlaying ? <Stop /> : <PlayArrow />}
                  </IconButton>
                  <VolumeUp color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Vista previa del audio original
                  </Typography>
                </Box>
              </Box>

              {/* Selector de formato */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Convertir a</InputLabel>
                <Select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  label="Convertir a"
                >
                  {supportedFormats.output.map(format => (
                    <MenuItem 
                      key={format} 
                      value={format}
                      disabled={format === getFileExtension(file.name)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AudioFile fontSize="small" />
                        {formatLabels[format]}
                        {format === getFileExtension(file.name) && (
                          <Chip label="Actual" size="small" color="primary" />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Botón de conversión */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleConvert}
                disabled={loading || !targetFormat}
                startIcon={<Refresh />}
                sx={{ height: 48 }}
              >
                {loading ? 'Convirtiendo...' : `Convertir a ${targetFormat.toUpperCase()}`}
              </Button>

              {loading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Procesando archivo de audio...
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Archivo convertido */}
          {convertedFile && (
            <Paper sx={{ p: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                ✅ Conversión Completada
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AudioFile sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    {convertedFile.name}
                  </Typography>
                  <Typography variant="body2">
                    {getFileSize(convertedFile.size)} • {formatLabels[convertedFile.targetFormat]}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${convertedFile.originalFormat.toUpperCase()} → ${convertedFile.targetFormat.toUpperCase()}`} 
                  color="primary" 
                />
                <Chip 
                  label={`${getFileSize(file.size)} → ${getFileSize(convertedFile.size)}`} 
                  variant="outlined" 
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleDownload}
                startIcon={<Download />}
                sx={{ mt: 2, backgroundColor: 'success.dark' }}
              >
                Descargar Archivo Convertido
              </Button>
            </Paper>
          )}
        </Grid>

        {/* Panel lateral con información */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                Formatos Soportados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Conversión entre formatos de audio populares
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Entrada:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {supportedFormats.input.map(format => (
                    <Chip key={format} label={format.toUpperCase()} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Salida:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {supportedFormats.output.map(format => (
                    <Chip key={format} label={format.toUpperCase()} size="small" color="primary" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Historial de conversiones */}
          {conversionHistory.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Historial Reciente
                </Typography>
                <List dense>
                  {conversionHistory.map((item, index) => (
                    <Box key={item.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <AudioFile color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {item.originalFormat.toUpperCase()} → {item.targetFormat.toUpperCase()}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {item.timestamp}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < conversionHistory.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AudioConverter; 