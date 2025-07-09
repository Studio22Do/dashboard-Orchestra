import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const categories = [
  { id: 'latest', label: 'Últimas Noticias' },
  { id: 'world', label: 'Mundo' },
  { id: 'business', label: 'Negocios' },
  { id: 'technology', label: 'Tecnología' },
  { id: 'entertainment', label: 'Entretenimiento' },
  { id: 'sports', label: 'Deportes' },
  { id: 'science', label: 'Ciencia' },
  { id: 'health', label: 'Salud' }
];

const NewsCard = ({ article }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {article.image && (
      <CardMedia
        component="img"
        height="200"
        image={article.image}
        alt={article.title}
        sx={{ objectFit: 'cover' }}
      />
    )}
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="div">
        {article.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {article.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip 
          label={article.source} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(article.published).toLocaleDateString()}
        </Typography>
      </Box>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button 
        size="small" 
        fullWidth 
        variant="outlined"
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Leer más
      </Button>
    </Box>
  </Card>
);

const GoogleNews = () => {
  const [selectedCategory, setSelectedCategory] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Cargar idiomas disponibles
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('/api/google-news/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        let response;
        if (searchQuery) {
          response = await axios.get(`/api/google-news/search`, {
            params: { keyword: searchQuery, lr: language }
          });
        } else if (selectedCategory === 'latest') {
          response = await axios.get(`/api/google-news/latest`, {
            params: { lr: language }
          });
        } else {
          response = await axios.get(`/api/google-news/category/${selectedCategory}`, {
            params: { lr: language }
          });
        }
        setNews(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, searchQuery, language]);

  const handleSearch = (event) => {
    event.preventDefault();
    // La búsqueda se activará por el useEffect
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Google News
        </Typography>

        {/* Barra de búsqueda y selector de idioma */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={language}
                label="Idioma"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Tabs de categorías */}
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={category.label}
              value={category.id}
            />
          ))}
        </Tabs>

        {/* Grid de noticias */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {news.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default GoogleNews; 