import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Box, 
  Tabs, 
  Tab,
  Divider,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Search, ArrowBack, ViewModule, ViewComfy, ViewList } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import AppCard from '../../components/AppCard/AppCard';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/reduxHooks';
import { selectPurchasedApps, fetchPurchasedApps } from '../../redux/slices/appsSlice';

const AppCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const purchasedApps = useAppSelector(selectPurchasedApps);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Cargar apps compradas cuando se visita la página
  useEffect(() => {
    dispatch(fetchPurchasedApps());
  }, [dispatch]);

  // Obtener categorías únicas de las apps compradas
  const CATEGORIES = ['All', ...Array.from(new Set(purchasedApps.map(app => app.category)))];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [gridLayout, setGridLayout] = useState('2'); // '2', '6', '8'

  // Verificar si hay una categoría preseleccionada (desde Dashboard)
  useEffect(() => {
    const preselectedCategory = location.state?.preselectedCategory;
    if (preselectedCategory && CATEGORIES.includes(preselectedCategory)) {
      setActiveCategory(preselectedCategory);
    }
  }, [location.state, CATEGORIES]);

  // Filtrar apps según búsqueda y categoría actual
  const filteredApps = purchasedApps.filter(app => {
    const matchesSearch = app.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Función para obtener el ancho de las cards según el layout
  const getCardWidth = () => {
    switch (gridLayout) {
      case '2':
        return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(50% - 12px)' };
      case '6':
        return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(33.333% - 16px)' };
      case '8':
        return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)', lg: 'calc(25% - 18px)' };
      default:
        return { xs: '100%', sm: 'calc(50% - 12px)' };
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100%', px: 0, py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 2, md: 6 } }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          {activeCategory}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ px: { xs: 2, md: 6 } }}>
        Explora tus aplicaciones agregadas para {activeCategory === 'All' ? 'todas las categorías' : activeCategory.toLowerCase()}
      </Typography>

      <Box sx={{ mb: 4, px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Buscar herramientas..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          {/* Botones de filtro por cuadrícula */}
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Tooltip title="2 columnas">
              <IconButton
                onClick={() => setGridLayout('2')}
                sx={{
                  color: gridLayout === '2' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: gridLayout === '2' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: gridLayout === '2' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ViewList />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="3 columnas">
              <IconButton
                onClick={() => setGridLayout('6')}
                sx={{
                  color: gridLayout === '6' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: gridLayout === '6' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: gridLayout === '6' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ViewComfy />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="4 columnas">
              <IconButton
                onClick={() => setGridLayout('8')}
                sx={{
                  color: gridLayout === '8' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: gridLayout === '8' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: gridLayout === '8' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ViewModule />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs 
          value={activeCategory}
          onChange={(_, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {CATEGORIES.map(category => (
            <Tab 
              key={category} 
              label={category} 
              value={category} 
              sx={{ 
                textTransform: 'none',
                fontWeight: activeCategory === category ? 'bold' : 'normal'
              }} 
            />
          ))}
        </Tabs>
        
        <Divider />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '24px', px: '50px' }}>
        {filteredApps.length > 0 ? (
          filteredApps
            .filter(app => app && (app.id || app.app_id))
            .map(app => (
              <Box key={app.app_id || app.id} sx={{ width: getCardWidth(), boxSizing: 'border-box'}}>
                <AppCard {...app} showFavorite={true} is_favorite={app.is_favorite} />
              </Box>
            ))
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary">
              Aún no has agregado ninguna aplicación. ¡Explora el Dashboard y agrega tus favoritas!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Notificación para toolbox */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppCatalog; 