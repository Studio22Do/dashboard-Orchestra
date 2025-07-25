import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  CircularProgress,
  Paper,
  Divider,
  Avatar,
  Chip,
  Stack,
  Tab,
  Tabs,
  CardMedia,
  CardActions,
  IconButton
} from '@mui/material';
import { 
  Tag, 
  Search, 
  Visibility,
  TrendingUp,
  PlayArrow,
  Favorite,
  Comment,
  Share
} from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const HashtagSearch = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [hashtag, setHashtag] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashtagInfo, setHashtagInfo] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!hashtag) {
      setError && setError('Por favor ingresa un hashtag');
      return;
    }
    setLoading(true);
    setHashtagInfo(null);
    try {
      const response = await axios.get('/api/tiktok/hashtag-info', {
        params: { hashtag },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setHashtagInfo(response.data);
      setError && setError(null);
    } catch (err) {
      setError && setError(err.response?.data?.message || 'Error al buscar hashtag');
      setHashtagInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Buscar Hashtag"
                  placeholder="Ej: bts, dance, funny (sin #)"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  InputProps={{
                    startAdornment: <Tag sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Buscar Hashtag'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hashtagInfo && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            #{hashtagInfo.challengeInfo?.challenge?.title || hashtag}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Videos
              </Typography>
              <Typography variant="h6">
                {formatNumber(Number(hashtagInfo.challengeInfo?.statsV2?.videoCount) || 0)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Vistas
              </Typography>
              <Typography variant="h6">
                {formatNumber(Number(hashtagInfo.challengeInfo?.statsV2?.viewCount) || 0)}
              </Typography>
            </Box>
          </Stack>
          {hashtagInfo.challengeInfo?.challenge?.desc && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {hashtagInfo.challengeInfo.challenge.desc}
            </Typography>
          )}
        </Paper>
      )}

      {!loading && !hashtagInfo && hashtag && (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="h6">No se encontró información para este hashtag</Typography>
          <Typography variant="body2" color="text.secondary">
            Verifica que el hashtag sea correcto o intenta con otro.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default HashtagSearch; 