import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PR_LABS_CONFIG } from '../../config/prlabs';

const ChatContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  minHeight: '120px',
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column-reverse',
}));

const Message = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  maxWidth: '70%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const PRLabsChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prlabs/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          prompt: message,
          model: selectedModel
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error apropiadamente
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer maxWidth="lg">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/prlabs')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="bold">
            Chat con IA
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Interactúa con diferentes modelos de IA
          </Typography>
        </Box>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Modelo</InputLabel>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            label="Modelo"
          >
            {PR_LABS_CONFIG.FEATURES.find(f => f.id === 'chat-models').models.map(model => (
              <MenuItem key={model} value={model}>
                {model.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Messages */}
      <MessageContainer>
        <Box display="flex" flexDirection="column">
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser} elevation={1}>
              <Typography>{msg.content}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Message>
          ))}
          <div ref={messageEndRef} />
        </Box>
      </MessageContainer>

      {/* Input */}
      <InputContainer>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={!message.trim() || loading}
              startIcon={<SendIcon />}
            >
              Enviar
            </Button>
          </Grid>
        </Grid>
      </InputContainer>
    </ChatContainer>
  );
};

export default PRLabsChat; 