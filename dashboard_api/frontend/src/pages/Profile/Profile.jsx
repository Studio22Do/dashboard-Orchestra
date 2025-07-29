import { Box, Card, CardContent, Typography, Avatar, Divider, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { selectUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Visibility, VisibilityOff, Save } from '@mui/icons-material';

const Profile = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  // Estado para edición de datos personales
  const [editMode, setEditMode] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    website: user?.website || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  // Función para obtener iniciales
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Handlers edición
  const handleEditChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    // Aquí iría la lógica para guardar cambios (API)
    setEditMode(false);
  };

  // Handlers contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  const handleToggleShow = (field) => {
    setPasswordData((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para cambiar contraseña (API)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      {/* Breadcrumbs y volver */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.7)' }}>
        <Button variant="text" size="small" onClick={() => navigate('/')} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          &lt; Volver
        </Button>
        <span>/</span>
        <span>Mi Perfil</span>
      </Box>

      {/* Header del perfil */}
      <Card sx={{ mb: 4, overflow: 'visible', bgcolor: '#272038', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}
              src={user?.avatar}
            >
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {personalData.name || 'Usuario'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {personalData.email || 'usuario@ejemplo.com'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Rol: {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Plan: <b style={{ color: '#837cf2' }}>{user?.plan?.toUpperCase() || 'BASIC'}</b>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Información personal editable */}
      <Card sx={{ mb: 4, bgcolor: '#272038', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Información Personal</Typography>
            <Button variant={editMode ? 'contained' : 'outlined'} onClick={() => editMode ? handleSave() : setEditMode(true)}>
              {editMode ? 'Guardar' : 'Editar'}
            </Button>
          </Box>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); if (editMode) handleSave(); }} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField
              label="Nombre"
              name="name"
              value={personalData.name}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Email"
              name="email"
              value={personalData.email}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Teléfono"
              name="phone"
              value={personalData.phone}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Empresa"
              name="company"
              value={personalData.company}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Sitio Web"
              name="website"
              value={personalData.website}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Ubicación"
              name="location"
              value={personalData.location}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Biografía"
              name="bio"
              value={personalData.bio}
              onChange={handleEditChange}
              disabled={!editMode}
              fullWidth
              multiline
              minRows={2}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625', gridColumn: '1/-1' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Cambio de contraseña */}
      <Card sx={{ mb: 4, bgcolor: '#272038', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Cambiar Contraseña</Typography>
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 400 }}>
            <TextField
              label="Contraseña actual"
              name="currentPassword"
              type={passwordData.showCurrent ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleShow('showCurrent')} edge="end" size="small">
                      {passwordData.showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Nueva contraseña"
              name="newPassword"
              type={passwordData.showNew ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleShow('showNew')} edge="end" size="small">
                      {passwordData.showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type={passwordData.showConfirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleShow('showConfirm')} edge="end" size="small">
                      {passwordData.showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{ input: { color: 'white' }, bgcolor: '#1a1625' }}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#837cf2', '&:hover': { bgcolor: '#AC9DFB' } }}>
              <Save sx={{ mr: 1 }} fontSize="small" /> Actualizar contraseña
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile; 