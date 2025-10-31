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
  Grid,
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PR_LABS_CONFIG, getChatCost } from '../../config/prlabs';
import { useDispatch } from 'react-redux';
import { setBalance } from '../../redux/slices/creditsSlice';

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

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp <= now;
  } catch {
    return true;
  }
};

const PRLabsChat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const inputSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: 56,
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiInputBase-input': {
      height: 56,
      padding: '0 16px',
      boxSizing: 'border-box'
    }
  };

  const selectContainerSx = {
    '& .MuiInputBase-root': {
      height: 56,
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0
    }
  };

  const actionButtonSx = {
    height: 56,
    borderRadius: 2,
    fontWeight: 600,
    textTransform: 'none'
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      // Evitar llamadas 401 y guiar al usuario
      console.warn('[CHAT] Token ausente o expirado');
      alert('Tu sesión ha expirado. Inicia sesión nuevamente para continuar.');
      return;
    }

    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const API_VERSION = 'beta_v2';
      // Usar la variable de entorno para la URL base de la API
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/${API_VERSION}/prlabs/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: message,
          model: selectedModel
        })
      });

      if (response.status === 401) {
        alert('Sesión expirada (401). Inicia sesión nuevamente.');
        return;
      }

      const data = await response.json();
      // Actualizar créditos si viene en la respuesta
      if (data && data.credits_info && typeof data.credits_info.remaining === 'number') {
        dispatch(setBalance(data.credits_info.remaining));
      }
      
      const aiMessage = {
        content: data.choices?.[0]?.message?.content || 'Respuesta recibida',
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCost = getChatCost(selectedModel, false);

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
            Interactúa con diferentes modelos de IA##
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2} flexWrap={{ xs: 'wrap', md: 'nowrap' }}>
          <FormControl
            variant="outlined"
            sx={{
              minWidth: { xs: '100%', md: 220 },
              flex: { xs: '1 1 100%', md: '0 0 auto' },
              ...selectContainerSx
            }}
          >
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
          <Tooltip title="Puntos por mensaje (éxito). Algunos modelos premium cuestan 2 puntos.">
            <Chip color="secondary" label={`Puntos: ${currentCost}`} sx={{ height: 40, borderRadius: 2, fontWeight: 600 }} />
          </Tooltip>
        </Box>
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
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              sx={inputSx}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: { xs: '100%', md: 160 } }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!message.trim() || loading}
              startIcon={<SendIcon />}
              fullWidth
              sx={actionButtonSx}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </Box>
        </Box>
      </InputContainer>
    </ChatContainer>
  );
};

export default PRLabsChat; 