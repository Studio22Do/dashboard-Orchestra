import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Alert 
} from '@mui/material';
import { 
  PersonOutline, 
  Tag, 
  Comment, 
  Notifications, 
  Photo
} from '@mui/icons-material';

import ProfileSearch from './components/ProfileSearch';
import HashtagSearch from './components/HashtagSearch';
import PostComments from './components/PostComments';
import UserMentions from './components/UserMentions';
import UserPosts from './components/UserPosts';

const InstagramRealtime = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Instagram Realtime
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitoreo en tiempo real de perfiles, hashtags, comentarios y menciones en Instagram
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonOutline />} label="Perfiles" />
          <Tab icon={<Photo />} label="Posts" />
          <Tab icon={<Tag />} label="Hashtags" />
          <Tab icon={<Comment />} label="Comentarios" />
          <Tab icon={<Notifications />} label="Menciones" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <ProfileSearch setError={setError} />}
        {activeTab === 1 && <UserPosts setError={setError} />}
        {activeTab === 2 && <HashtagSearch setError={setError} />}
        {activeTab === 3 && <PostComments setError={setError} />}
        {activeTab === 4 && <UserMentions setError={setError} />}
      </Box>
    </Container>
  );
};

export default InstagramRealtime; 