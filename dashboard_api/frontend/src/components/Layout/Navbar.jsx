import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import { Notifications, Settings } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, color: 'text.primary' }}
        >
          Marketing Intelligence Console
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="large" color="default">
            <Notifications />
          </IconButton>
          <IconButton size="large" color="default">
            <Settings />
          </IconButton>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 