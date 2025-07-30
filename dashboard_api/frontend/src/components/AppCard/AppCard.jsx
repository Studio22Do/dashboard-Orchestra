import { 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Button, 
  Typography, 
  Chip, 
  Box, 
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseApp, toggleFavoriteApp, selectCanUseApp } from '../../redux/slices/appsSlice';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const AppCard = ({ id, title, description, imageUrl, category, route, apiName, is_favorite, showFavorite }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Nueva lógica basada en requests
  const canUseApp = useSelector(state => selectCanUseApp(state, id));

  const handleAction = () => {
    if (canUseApp) {
      navigate(route);
    } else {
      dispatch(purchaseApp(id));
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavoriteApp(id));
  };

  const getButtonText = () => {
    return canUseApp ? 'Abrir App' : 'Agregar';
  };

  const getButtonVariant = () => {
    return canUseApp ? "contained" : "outlined";
  };

  const getButtonColor = () => {
    return canUseApp ? "primary" : "success";
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Estrellita de favoritos */}
      {showFavorite && (
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            color: is_favorite ? '#FFD600' : 'rgba(255,255,255,0.5)',
            background: 'rgba(30,30,40,0.7)',
            '&:hover': { color: '#FFD600', background: 'rgba(30,30,40,0.9)' }
          }}
          size="small"
        >
          {is_favorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      )}
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Chip 
            label={category} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ ml: 1, fontSize: '0.7rem' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          API: {apiName}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          fullWidth 
          variant={getButtonVariant()}
          color={getButtonColor()}
          onClick={handleAction}
        >
          {getButtonText()}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AppCard; 
