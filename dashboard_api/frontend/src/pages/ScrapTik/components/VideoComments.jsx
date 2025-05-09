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
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import { Comment, PlayArrow, Person } from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { selectAuth } from '../../../redux/slices/authSlice';

const VideoComments = ({ setError }) => {
  const { token } = useAppSelector(selectAuth);
  const [videoIdOrUrl, setVideoIdOrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!videoIdOrUrl) {
      setError && setError('Por favor ingresa el ID o URL del video');
      return;
    }
    setLoading(true);
    setComments([]);
    try {
      const params = videoIdOrUrl.startsWith('http')
        ? { url: videoIdOrUrl }
        : { video_id: videoIdOrUrl };
      const response = await axios.get('/api/tiktok/video-comments', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments(response.data?.comments || []);
      setError && setError(null);
    } catch (err) {
      setError && setError(err.response?.data?.message || 'Error al buscar comentarios');
      setComments([]);
    } finally {
      setLoading(false);
    }
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
                  label="ID o URL del video"
                  placeholder="Ej: 7294298719665622305 o https://www.tiktok.com/@user/video/7294298719665622305"
                  value={videoIdOrUrl}
                  onChange={(e) => setVideoIdOrUrl(e.target.value)}
                  InputProps={{
                    startAdornment: <PlayArrow sx={{ mr: 1, color: 'action.active' }} />,
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
                  {loading ? <CircularProgress size={24} /> : 'Buscar Comentarios'}
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
      {!loading && comments.length === 0 && videoIdOrUrl && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No se encontraron comentarios para este video</Typography>
        </Paper>
      )}
      <Stack spacing={3}>
        {comments.map((comment, idx) => (
          <Paper key={idx} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={comment.user?.avatar} alt={comment.user?.nickname} sx={{ mr: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {comment.user?.nickname || 'Usuario'}
              </Typography>
              <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                @{comment.user?.unique_id}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {comment.text}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Likes: {comment.digg_count || 0}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default VideoComments; 