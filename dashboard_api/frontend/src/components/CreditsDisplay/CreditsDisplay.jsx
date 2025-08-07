import React, { useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreditsBalance, selectCreditsBalance, selectCreditsLoading } from '../../redux/slices/creditsSlice';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';

const CreditsDisplay = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const credits = useSelector(selectCreditsBalance);
  const loading = useSelector(selectCreditsLoading);
  const mode = process.env.REACT_APP_MODE || 'beta_v1';

  useEffect(() => {
    // Solo cargar créditos si está autenticado y en beta_v2
    if (isAuthenticated && mode === 'beta_v2') {
      dispatch(fetchCreditsBalance());
    }
  }, [dispatch, isAuthenticated, mode]);

  // No mostrar en beta_v1 (demo)
  if (mode === 'beta_v1') {
    return null;
  }

  // No mostrar si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="text.secondary">
          Cargando...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccountBalanceWallet sx={{ fontSize: 20, color: 'primary.main' }} />
      <Chip
        label={`${credits} puntos`}
        size="small"
        color={credits > 10 ? 'success' : credits > 5 ? 'warning' : 'error'}
        variant="outlined"
        onClick={() => {}} // Agregar onClick vacío para evitar error
        sx={{
          '& .MuiChip-label': {
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
};

export default CreditsDisplay;
