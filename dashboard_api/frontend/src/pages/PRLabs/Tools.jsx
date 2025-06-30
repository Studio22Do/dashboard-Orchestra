import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip
} from '@mui/material';
import {
  Build,
  Translate,
  Code,
  FormatColorText,
  Psychology,
  AutoAwesome
} from '@mui/icons-material';

const Tools = () => {
  const tools = [
    {
      id: 'translator',
      title: 'Traductor',
      description: 'Traduce texto entre diferentes idiomas con alta precisión',
      icon: <Translate />,
      tags: ['Idiomas', 'Traducción', 'Multilingüe']
    },
    {
      id: 'code-generator',
      title: 'Generador de Código',
      description: 'Genera código en diferentes lenguajes de programación',
      icon: <Code />,
      tags: ['Programación', 'Desarrollo', 'Automatización']
    },
    {
      id: 'text-improver',
      title: 'Mejorador de Texto',
      description: 'Mejora la calidad y claridad de tus textos',
      icon: <FormatColorText />,
      tags: ['Escritura', 'Edición', 'Gramática']
    },
    {
      id: 'ai-assistant',
      title: 'Asistente IA',
      description: 'Asistente inteligente para diversas tareas',
      icon: <Psychology />,
      tags: ['IA', 'Asistente', 'Productividad']
    },
    {
      id: 'content-generator',
      title: 'Generador de Contenido',
      description: 'Crea contenido original para diferentes plataformas',
      icon: <AutoAwesome />,
      tags: ['Contenido', 'Marketing', 'Creatividad']
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        <Build sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Herramientas
      </Typography>

      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tool.icon}
                  <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                    {tool.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {tool.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tool.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Usar Herramienta
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Tools; 