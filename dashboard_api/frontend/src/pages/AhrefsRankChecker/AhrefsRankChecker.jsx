import { useState } from 'react';
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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search,
  TrendingUp,
  Link,
  Public,
  Language,
  BrokenImage,
  KeyboardArrowRight,
  OpenInNew,
  Error,
  Keyboard
} from '@mui/icons-material';

const AhrefsRankChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [additionalData, setAdditionalData] = useState({
    topBacklinks: [],
    brokenLinks: {
      inbound: [],
      outbound: []
    },
    relatedKeywords: []
  });
  const [loadingAdditional, setLoadingAdditional] = useState({
    backlinks: false,
    broken: false,
    keywords: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Por favor ingresa una URL para analizar');
      return;
    }
    
    setLoading(true);
    setError(null);
    setRankData(null);
    setAdditionalData({
      topBacklinks: [],
      brokenLinks: {
        inbound: [],
        outbound: []
      },
      relatedKeywords: []
    });
    
    try {
      // Llamada a authority
      const authorityResponse = await fetch('/api/ahrefs-dr/authority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const authorityData = await authorityResponse.json();
      console.log('Ahrefs Authority API response (frontend):', authorityData);
      
      if (!authorityResponse.ok || authorityData.error) {
        throw new Error(authorityData.error || 'Error al verificar el ranking del dominio');
      }

      // Mapear la respuesta de la API a nuestro formato de UI
      setRankData({
        domainRating: authorityData.domainRating || 0,
        ahrefsRank: authorityData.urlRating || 0,
        backlinks: {
          total: authorityData.backlinks || 0,
          dofollow: authorityData.dofollowBacklinks || 0,
          nofollow: authorityData.backlinks - (authorityData.dofollowBacklinks || 0) || 0,
          unique: authorityData.backlinks || 0
        },
        referringDomains: {
          total: authorityData.refdomains || 0,
          dofollow: authorityData.dofollowRefdomains || 0,
          nofollow: authorityData.refdomains - (authorityData.dofollowRefdomains || 0) || 0
        }
      });

      // Una vez que tenemos los datos principales, cargamos los datos adicionales
      loadAdditionalData(url);
      
    } catch (err) {
      console.error('Error checking domain rank:', err);
      setError(err.message || 'Error al verificar el ranking del dominio');
    } finally {
      setLoading(false);
    }
  };

  const loadAdditionalData = async (url) => {
    // Cargar backlinks
    setLoadingAdditional(prev => ({ ...prev, backlinks: true }));
    try {
      const backlinksResponse = await fetch('/api/ahrefs-dr/backlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const backlinksData = await backlinksResponse.json();
      if (backlinksResponse.ok && !backlinksData.error) {
        setAdditionalData(prev => ({
          ...prev,
          topBacklinks: backlinksData.backlinks || []
        }));
      }
    } catch (error) {
      console.warn('Error loading backlinks:', error);
    } finally {
      setLoadingAdditional(prev => ({ ...prev, backlinks: false }));
    }

    // Cargar broken links
    setLoadingAdditional(prev => ({ ...prev, broken: true }));
    try {
      const brokenResponse = await fetch('/api/ahrefs-dr/broken-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const brokenData = await brokenResponse.json();
      if (brokenResponse.ok && !brokenData.error) {
        setAdditionalData(prev => ({
          ...prev,
          brokenLinks: {
            inbound: brokenData.inbound || [],
            outbound: brokenData.outbound || []
          }
        }));
      }
    } catch (error) {
      console.warn('Error loading broken links:', error);
    } finally {
      setLoadingAdditional(prev => ({ ...prev, broken: false }));
    }

    // Cargar keywords relacionadas
    setLoadingAdditional(prev => ({ ...prev, keywords: true }));
    try {
      const keywordsResponse = await fetch('/api/ahrefs-dr/keyword-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keyword: url.replace(/^https?:\/\//, '').split('/')[0],
          se: 'google',
          country: 'us'
        })
      });
      const keywordsData = await keywordsResponse.json();
      if (keywordsResponse.ok && !keywordsData.error) {
        setAdditionalData(prev => ({
          ...prev,
          relatedKeywords: keywordsData.keywords || []
        }));
      }
    } catch (error) {
      console.warn('Error loading keywords:', error);
    } finally {
      setLoadingAdditional(prev => ({ ...prev, keywords: false }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ahrefs DR & Rank Checker
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Verifica el Domain Rating y métricas de cualquier sitio web
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="URL"
                  placeholder="https://ejemplo.com"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <Search color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Analizar URL'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Analizando URL...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && rankData && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Domain Rating (DR)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      {rankData.domainRating}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={rankData.domainRating} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ahrefs Rank
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Public sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h4">
                      #{rankData.ahrefsRank.toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`Top ${((rankData.ahrefsRank / 1000000) * 100).toFixed(2)}%`}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Backlinks
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total" 
                        secondary={rankData.backlinks.total.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dofollow" 
                        secondary={rankData.backlinks.dofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nofollow" 
                        secondary={rankData.backlinks.nofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Únicos" 
                        secondary={rankData.backlinks.unique.toLocaleString()} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dominios Referentes
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total" 
                        secondary={rankData.referringDomains.total.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dofollow" 
                        secondary={rankData.referringDomains.dofollow.toLocaleString()} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nofollow" 
                        secondary={rankData.referringDomains.nofollow.toLocaleString()} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>


          </Grid>
        </Paper>
      )}

      {!loading && rankData && (
        <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Top Backlinks" icon={<Link />} iconPosition="start" />
              <Tab label="Enlaces Rotos" icon={<BrokenImage />} iconPosition="start" />
              <Tab label="Palabras Clave" icon={<Keyboard />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Top Backlinks Tab */}
          {activeTab === 0 && (
            <Box>
              {loadingAdditional.backlinks ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : additionalData.topBacklinks.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>URL</TableCell>
                        <TableCell>DR</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {additionalData.topBacklinks.map((backlink, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography noWrap sx={{ maxWidth: 300 }}>
                              {backlink.url}
                            </Typography>
                          </TableCell>
                          <TableCell>{backlink.domain_rating || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={backlink.type || 'dofollow'} 
                              color={backlink.type === 'nofollow' ? 'default' : 'primary'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Abrir enlace">
                              <IconButton 
                                size="small" 
                                href={backlink.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <OpenInNew />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" align="center" py={3}>
                  No se encontraron backlinks
                </Typography>
              )}
            </Box>
          )}

          {/* Broken Links Tab */}
          {activeTab === 1 && (
            <Box>
              {loadingAdditional.broken ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Enlaces Rotos Entrantes
                  </Typography>
                  {additionalData.brokenLinks.inbound.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>URL Origen</TableCell>
                            <TableCell>URL Destino</TableCell>
                            <TableCell>Código</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {additionalData.brokenLinks.inbound.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: 300 }}>
                                  {link.source_url}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: 300 }}>
                                  {link.target_url}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={link.status_code} 
                                  color="error" 
                                  size="small" 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary" align="center" py={2}>
                      No se encontraron enlaces rotos entrantes
                    </Typography>
                  )}

                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Enlaces Rotos Salientes
                  </Typography>
                  {additionalData.brokenLinks.outbound.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>URL Origen</TableCell>
                            <TableCell>URL Destino</TableCell>
                            <TableCell>Código</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {additionalData.brokenLinks.outbound.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: 300 }}>
                                  {link.source_url}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography noWrap sx={{ maxWidth: 300 }}>
                                  {link.target_url}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={link.status_code} 
                                  color="error" 
                                  size="small" 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary" align="center" py={2}>
                      No se encontraron enlaces rotos salientes
                    </Typography>
                  )}
                </>
              )}
            </Box>
          )}

          {/* Keywords Tab */}
          {activeTab === 2 && (
            <Box>
              {loadingAdditional.keywords ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : additionalData.relatedKeywords.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Palabra Clave</TableCell>
                        <TableCell>Volumen</TableCell>
                        <TableCell>Dificultad</TableCell>
                        <TableCell>CPC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {additionalData.relatedKeywords.map((keyword, index) => (
                        <TableRow key={index}>
                          <TableCell>{keyword.keyword}</TableCell>
                          <TableCell>{keyword.volume?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={keyword.difficulty || 0} 
                                sx={{ width: 100, mr: 1 }}
                              />
                              {keyword.difficulty || 0}%
                            </Box>
                          </TableCell>
                          <TableCell>${keyword.cpc || '0.00'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" align="center" py={3}>
                  No se encontraron palabras clave relacionadas
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AhrefsRankChecker; 