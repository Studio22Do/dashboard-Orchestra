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

const ApiPerformance = () => {
  // Datos de ejemplo - En producción vendrían de una API
  const apiData = [
    {
      name: 'Instagram Statistics API',
      status: 'success',
      responseTime: '245ms',
      uptime: '99.9%',
      lastCheck: '2 min ago'
    },
    {
      name: 'YouTube Downloader',
      status: 'warning',
      responseTime: '850ms',
      uptime: '98.5%',
      lastCheck: '5 min ago'
    },
    {
      name: 'SEO Analyzer',
      status: 'success',
      responseTime: '150ms',
      uptime: '99.8%',
      lastCheck: '1 min ago'
    },
    {
      name: 'Google Trends API',
      status: 'error',
      responseTime: '1.2s',
      uptime: '95.5%',
      lastCheck: '3 min ago'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return null;
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
          {apiData.map((api) => (
            <TableRow key={api.name}>
              <StyledTableCell>
                <Typography variant="body2">{api.name}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <StatusIcon status={api.status}>
                  {getStatusIcon(api.status)}
                  <Typography variant="body2">
                    {api.status === 'success' ? 'Operativo' :
                     api.status === 'warning' ? 'Lento' : 'Error'}
                  </Typography>
                </StatusIcon>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.responseTime}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.uptime}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body2">{api.lastCheck}</Typography>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApiPerformance; 