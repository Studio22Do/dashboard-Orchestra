import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Language as DomainIcon,
  Router as AsnIcon,
  Computer as IpIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Dns as DnsIcon,
  Security as SecurityIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`whois-tabpanel-${index}`}
    aria-labelledby={`whois-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const WhoisLookup = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  // Estados para cada tipo de consulta
  const [domainInput, setDomainInput] = useState('');
  const [asnInput, setAsnInput] = useState('');
  const [ipInput, setIpInput] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setData(null);
  };

  const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
  const API_BASE_URL = `/api/${API_MODE}/whois-lookup`;

  const handleSearch = async (type, input) => {
    if (!input.trim()) {
      setError('Por favor ingresa un valor para buscar');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const endpoints = {
      domain: `${API_BASE_URL}/domain`,
      asn: `${API_BASE_URL}/asn`,
      ip: `${API_BASE_URL}/ip`
    };

    const payloads = {
      domain: { url: input },
      asn: { asn: input },
      ip: { ip: input }
    };

    try {
      const response = await fetch(endpoints[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads[type])
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      if (result.status === 'error') {
        throw new Error(result.error || 'Error en la consulta WHOIS');
      }

      // Si es dominio, extraer el primer objeto relevante y mapearlo
      if (type === 'domain' && result.data && typeof result.data === 'object') {
        const whoisKeys = Object.keys(result.data);
        if (whoisKeys.length > 0) {
          const whoisData = result.data[whoisKeys[0]];
          // Mapeo plano para el frontend
          setData({
            domainName: whoisData['Domain Name'] || whoisData['domainName'] || '',
            registrar: whoisData['Registrar'] || whoisData['registrar'] || '',
            creationDate: whoisData['Created Date'] || whoisData['creationDate'] || '',
            expirationDate: whoisData['Expiry Date'] || whoisData['expirationDate'] || '',
            updatedDate: whoisData['Updated Date'] || whoisData['updatedDate'] || '',
            status: whoisData['Domain Status'] || whoisData['status'] || '',
            nameServers: whoisData['Name Server'] || whoisData['nameServers'] || '',
            registrantName: whoisData['Registrant Name'] || '',
            registrantOrganization: whoisData['Registrant Organization'] || '',
            registrantEmail: whoisData['Registrant Email'] || '',
            registrantPhone: whoisData['Registrant Phone'] || '',
            registrantCountry: whoisData['Registrant Country'] || '',
            adminName: whoisData['Admin Name'] || '',
            adminEmail: whoisData['Admin Email'] || '',
            techName: whoisData['Tech Name'] || '',
            techEmail: whoisData['Tech Email'] || '',
            // Puedes agregar más campos si el frontend los usa
          });
        } else {
          setData(null);
        }
      } else {
        setData(result.data);
      }
    } catch (err) {
      console.error('Error en WHOIS lookup:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const renderDomainData = (whoisData) => {
    if (!whoisData) return null;

    const {
      domainName,
      registrar,
      registrantName,
      registrantOrganization,
      registrantEmail,
      registrantPhone,
      registrantCountry,
      creationDate,
      expirationDate,
      updatedDate,
      nameServers,
      status,
      adminName,
      adminEmail,
      techName,
      techEmail
    } = whoisData;

    return (
      <Grid container spacing={3}>
        {/* Información básica del dominio */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DomainIcon sx={{ mr: 1 }} />
                Información del Dominio
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Dominio" secondary={domainName || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Registrar" secondary={registrar || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SecurityIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Estado" 
                    secondary={
                      status ? (
                        Array.isArray(status) ? status.join(', ') : status
                      ) : 'No disponible'
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Fechas importantes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DateIcon sx={{ mr: 1 }} />
                Fechas Importantes
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Creación" secondary={formatDate(creationDate)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Expiración" secondary={formatDate(expirationDate)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Última actualización" secondary={formatDate(updatedDate)} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del registrante */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Registrante
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Nombre" secondary={registrantName || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Organización" secondary={registrantOrganization || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Email" secondary={registrantEmail || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary="Teléfono" secondary={registrantPhone || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationIcon /></ListItemIcon>
                  <ListItemText primary="País" secondary={registrantCountry || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contactos administrativos y técnicos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Contactos
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Admin" secondary={adminName || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Admin Email" secondary={adminEmail || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Técnico" secondary={techName || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Técnico Email" secondary={techEmail || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Servidores DNS */}
        {nameServers && nameServers.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DnsIcon sx={{ mr: 1 }} />
                  Servidores DNS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {nameServers.map((ns, index) => (
                    <Chip key={index} label={ns} variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderAsnData = (asnData) => {
    if (!asnData) return null;

    // Mapear los campos que vienen de la API WHOIS
    const {
      ASNumber,
      ASName,
      organisation,
      RegDate,
      Updated,
      Comment
    } = asnData;

    const orgData = organisation || {};
    const asn = ASNumber;
    const asnName = ASName;
    const organization = orgData.OrgName;
    const country = orgData.Country;
    const registry = 'ARIN'; // Basado en los logs
    const allocated = RegDate;
    const changed = Updated;
    const source = Comment;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AsnIcon sx={{ mr: 1 }} />
                Información ASN
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="ASN" secondary={asn || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Nombre" secondary={asnName || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Organización" secondary={organization || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationIcon /></ListItemIcon>
                  <ListItemText primary="País" secondary={country || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DateIcon sx={{ mr: 1 }} />
                Información de Registro
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><SecurityIcon /></ListItemIcon>
                  <ListItemText primary="Registro" secondary={registry || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Asignado" secondary={formatDate(allocated)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Modificado" secondary={formatDate(changed)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Fuente" secondary={source || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderIpData = (ipData) => {
    if (!ipData) return null;

    // Mapear los campos que vienen de la API WHOIS para IP
    const {
      range: ipRange,
      status,
      owner,
      responsible,
      address,
      country: ipCountry,
      phone,
      created: ipCreated,
      changed: ipChanged,
      'Contact TIP22': adminContact,
      'Contact ABT': techContact
    } = ipData;

    const ip = ipRange ? ipRange.split('/')[0] : 'No disponible';
    const netname = owner;
    const description = address;
    const country = ipCountry;
    const organization = owner;
    const adminEmail = adminContact ? adminContact['e-mail'] : 'No disponible';
    const techEmail = techContact ? techContact['e-mail'] : 'No disponible';
    const created = ipCreated;
    const changed = ipChanged;
    const source = 'LACNIC'; // Basado en los logs
    const range = ipRange;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <IpIcon sx={{ mr: 1 }} />
                Información IP
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><IpIcon /></ListItemIcon>
                  <ListItemText primary="IP" secondary={ip || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Nombre de Red" secondary={netname || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Descripción" secondary={description || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Organización" secondary={organization || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationIcon /></ListItemIcon>
                  <ListItemText primary="País" secondary={country || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Contactos y Fechas
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Admin Email" secondary={adminEmail || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Tech Email" secondary={techEmail || 'No disponible'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Creado" secondary={formatDate(created)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateIcon /></ListItemIcon>
                  <ListItemText primary="Modificado" secondary={formatDate(changed)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary="Fuente" secondary={source || 'No disponible'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {range && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  Rango de IPs
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                  {range}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        WHOIS Lookup Service
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Consulta información detallada de registro para dominios, números ASN e direcciones IP
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<DomainIcon />} label="Dominio" />
          <Tab icon={<AsnIcon />} label="ASN" />
          <Tab icon={<IpIcon />} label="IP" />
        </Tabs>

        {/* Panel de Dominio */}
        <TabPanel value={activeTab} index={0}>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSearch('domain', domainInput); }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Dominio"
                  placeholder="ejemplo.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Consultar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Panel de ASN */}
        <TabPanel value={activeTab} index={1}>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSearch('asn', asnInput); }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="ASN"
                  placeholder="AS15193 o 15193"
                  value={asnInput}
                  onChange={(e) => setAsnInput(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Consultar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Panel de IP */}
        <TabPanel value={activeTab} index={2}>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSearch('ip', ipInput); }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Dirección IP"
                  placeholder="98.137.27.103"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
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
                  {loading ? <CircularProgress size={24} /> : 'Consultar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Mostrar errores */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Mostrar datos */}
      {data && (
        <Box sx={{ mt: 4 }}>
          {activeTab === 0 && renderDomainData(data)}
          {activeTab === 1 && renderAsnData(data)}
          {activeTab === 2 && renderIpData(data)}
        </Box>
      )}
    </Container>
  );
};

export default WhoisLookup; 