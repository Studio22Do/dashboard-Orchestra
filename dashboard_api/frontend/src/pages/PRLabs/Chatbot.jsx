import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton
} from '@mui/material';
import { Send, SmartToy, ArrowBack } from '@mui/icons-material';
import { prlabsService } from '../../services/prlabs';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await prlabsService.chat(input, model);
      const botMessage = {
        text: response.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/prlabs')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          <SmartToy sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Chatbot
        </Typography>
      </Box>

      <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <FormControl sx={{ mb: 2 }}>
            <InputLabel>Modelo</InputLabel>
            <Select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              label="Modelo"
            >
              <MenuItem value="gpt-4">GPT-4</MenuItem>
              <MenuItem value="deepseek">DeepSeek</MenuItem>
              <MenuItem value="mixtral">Mixtral</MenuItem>
            </Select>
          </FormControl>

          <Paper 
            sx={{ 
              flex: 1, 
              mb: 2, 
              p: 2, 
              overflow: 'auto',
              backgroundColor: '#f5f5f5'
            }}
          >
            <List>
              {messages.map((message, index) => (
                <Box key={index}>
                  <ListItem 
                    sx={{ 
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper 
                      sx={{ 
                        p: 2, 
                        maxWidth: '70%',
                        backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#fff'
                      }}
                    >
                      <ListItemText 
                        primary={message.text}
                        secondary={new Date(message.timestamp).toLocaleTimeString()}
                      />
                    </Paper>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Paper>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !input.trim()}
              sx={{ minWidth: '100px' }}
            >
              {loading ? <CircularProgress size={24} /> : <Send />}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chatbot; 