import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

const StatusIcon = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    fontSize: 20,
    marginRight: theme.spacing(1),
    color: status === 'success' ? theme.palette.success.main :
           status === 'warning' ? theme.palette.warning.main :
           theme.palette.error.main
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const ApiPerformance = ({ apiData = [] }) => {
  // Si no hay datos, mostrar mensaje
  if (!apiData || apiData.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de rendimiento de APIs disponibles
        </Typography>
      </Box>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <CheckCircle />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Operativo';
      case 'warning':
        return 'Lento';
      case 'error':
        return 'Error';
      default:
        return 'Operativo';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>API</StyledTableCell>
            <StyledTableCell>Estado</StyledTableCell>
            <StyledTableCell>Tiempo Respuesta</StyledTableCell>
            <StyledTableCell>Uptime</StyledTableCell>
            <StyledTableCell>Última Revisión</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiData.map((api, index) => (
            <TableRow key={api.name || index}>
              <StyledTableCell>
                <Typography variant="body2">{api.name}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <StatusIcon status={api.status}>
                  {getStatusIcon(api.status)}
                  <Typography variant="body2">
                    {getStatusText(api.status)}
                  </Typography>
                </StatusIcon>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.responseTime || 'N/A'}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.uptime || 'N/A'}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.lastCheck || 'N/A'}</Typography>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApiPerformance; 