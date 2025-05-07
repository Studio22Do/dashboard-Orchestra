import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab,
  Alert,
  AlertTitle,
  Grid
} from '@mui/material';
import {
  FileUpload,
  Compress,
  Image,
  PictureAsPdf,
  AudioFile,
  VideoFile
} from '@mui/icons-material';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import RarToZip from './components/RarToZip';
import ImageConverter from './components/ImageConverter';
import PdfToWord from './components/PdfToWord';

const FileConverter = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Convertidor de Archivos', href: '/file-converter' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Convertidor de Archivos Todo en Uno
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Convierte fácilmente archivos entre diferentes formatos
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Compress />} 
            label="RAR a ZIP" 
            iconPosition="start"
          />
          <Tab 
            icon={<Image />} 
            label="Convertidor de Imágenes" 
            iconPosition="start"
          />
          <Tab 
            icon={<PictureAsPdf />} 
            label="PDF a Word" 
            iconPosition="start"
          />
          <Tab 
            icon={<AudioFile />} 
            label="Convertidor de Audio" 
            iconPosition="start"
            disabled
          />
          <Tab 
            icon={<VideoFile />} 
            label="Convertidor de Video" 
            iconPosition="start"
            disabled
          />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <RarToZip setError={setError} />
        )}
        
        {activeTab === 1 && (
          <ImageConverter setError={setError} />
        )}
        
        {activeTab === 2 && (
          <PdfToWord setError={setError} />
        )}
        
        {activeTab > 2 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">
              Esta funcionalidad estará disponible próximamente
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Estamos trabajando para ofrecerte más opciones de conversión
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default FileConverter; 