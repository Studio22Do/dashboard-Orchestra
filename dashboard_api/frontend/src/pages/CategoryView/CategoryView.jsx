import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Chip,
    Tabs,
    Tab,
    Divider,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Breadcrumbs,
    Link,
    Skeleton,
    Tooltip,
} from "@mui/material";
import {
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    FilterList as FilterListIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    GridView as GridViewIcon,
    ViewList as ViewListIcon,
    Tune as TuneIcon,
    Code as CodeIcon,
    Bolt,
    Chat as ChatIcon,
    ShoppingCart as ShoppingCartIcon,
    Sort as SortIcon,
    ViewModule,
    ViewComfy,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchApps,
    selectApps,
    selectCategories,
    selectAppsLoading,
    purchaseApp,
    toggleFavoriteApp,
    selectCanUseApp,
    selectUserRequests,
} from "../../redux/slices/appsSlice";
import AppDetailDrawer from "../../components/AppDetailDrawer/AppDetailDrawer";
import { styled } from "@mui/material/styles";

// Estilos personalizados
const CategoryContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
}));

const SearchInput = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#272038",
        "&:hover fieldset": {
            borderColor: "#3a3045",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#837cf2",
        },
    },
    "& .MuiInputBase-input": {
        color: "white",
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.7)",
    },
}));

// Estilo de tarjeta similar a AppCard
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    },
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: "#272038",
    color: "white",
    borderRadius: "12px",
    border: "1px solid #3a3045",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 140,
    backgroundSize: "cover",
    objectFit: "cover",
}));

const CategoryView = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const dispatch = useDispatch();
    
    // Estados locales
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [viewMode, setViewMode] = useState("grid");
    const [gridLayout, setGridLayout] = useState("2"); // '2', '6', '8'
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    // Estados de Redux
    const apps = useSelector(selectApps);
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectAppsLoading);

    // Cargar apps al montar el componente
    useEffect(() => {
        dispatch(fetchApps());
    }, [dispatch]);

    // Obtener la categoría desde el estado o parámetros
    const categoryFromState = category || "Creative & Content";

    // Filtrar apps por categoría
    const categoryApps = useMemo(() => {
        if (!apps || !Array.isArray(apps)) {
            return [];
        }
        return apps.filter((app) => app.category === categoryFromState);
    }, [apps, categoryFromState]);

    // Obtener subcategorías únicas
    const subcategories = useMemo(() => {
        if (!categoryApps || !Array.isArray(categoryApps)) {
            return [];
        }
        const unique = [...new Set(categoryApps.map((app) => app.subcategory))];
        return unique.filter(Boolean);
    }, [categoryApps]);

    // Filtrar y ordenar apps
    const filteredApps = useMemo(() => {
        if (!categoryApps || !Array.isArray(categoryApps)) {
            return [];
        }
        
        let result = [...categoryApps];

        // Filtrar por búsqueda
        if (searchQuery) {
            result = result.filter(
                (app) =>
                    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrar por subcategoría
        if (selectedSubcategory !== "all" && selectedSubcategory) {
            result = result.filter(
                (app) => app.subcategory === selectedSubcategory
            );
        }

        // Ordenar
        if (sortBy === "popular") {
            result.sort((a, b) =>
                a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1
            );
        } else if (sortBy === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
            );
        } else if (sortBy === "alphabetical") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [categoryApps, searchQuery, selectedSubcategory, sortBy]);

    // Función para obtener el ancho de las cards según el layout
    const getCardWidth = () => {
        switch (gridLayout) {
            case '2':
                return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(50% - 12px)' };
            case '6':
                return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(33.333% - 16px)' };
            case '8':
                return { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)', lg: 'calc(25% - 18px)' };
            default:
                return { xs: '100%', sm: 'calc(50% - 12px)' };
        }
    };

    // Manejar favoritos
    const toggleFavorite = async (appId, event) => {
        event.stopPropagation();
        dispatch(toggleFavoriteApp(appId));
    };

    // Manejar compra
    const handlePurchase = (appId, event) => {
        event.stopPropagation();
        dispatch(purchaseApp(appId));
    };

    // Manejar click en app
    const handleAppClick = (app) => {
        setSelectedApp(app);
        setDrawerOpen(true);
    };

    // Obtener el nombre de la categoría para mostrar
    const getCategoryDisplayName = () => {
        switch (categoryFromState) {
            
            case "Social Listening":
                return "Social Listening";
            case "Creative & Content":
                return "Creative & Content";
            case "Web & SEO":
                return "Web & SEO";
            default:
                return categoryFromState;
        }
    };

    // Obtener ícono para la categoría
    const getCategoryIcon = () => {
        switch (categoryFromState) {
            
            case "Social Listening":
                return <ChatIcon />;
            case "Creative & Content":
                return <CodeIcon />;
            case "Web & SEO":
                return <Bolt />;
            default:
                return <CodeIcon />;
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#1a1625", color: "white" }}>
            {/* Header */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    bgcolor: "#1a1625",
                    borderBottom: "1px solid #3a3045",
                    p: 2,
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconButton
                                color="inherit"
                                onClick={() => navigate("/")}
                                aria-label="Volver al dashboard"
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "#837cf2",
                                        borderRadius: 1,
                                        width: 32,
                                        height: 32,
                                    }}
                                >
                                    {getCategoryIcon()}
                                </Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {getCategoryDisplayName()}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconButton
                                color="inherit"
                                onClick={() =>
                                    setViewMode(
                                        viewMode === "grid" ? "list" : "grid"
                                    )
                                }
                                aria-label={
                                    viewMode === "grid"
                                        ? "Ver como lista"
                                        : "Ver como cuadrícula"
                                }
                            >
                                {viewMode === "grid" ? (
                                    <ViewListIcon />
                                ) : (
                                    <GridViewIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            alignItems: { xs: "stretch", md: "center" },
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: { xs: "100%", md: 400 },
                            }}
                        >
                            <SearchIcon
                                sx={{
                                    position: "absolute",
                                    left: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "rgba(255, 255, 255, 0.6)",
                                }}
                            />
                            <SearchInput
                                placeholder="Buscar aplicaciones..."
                                variant="outlined"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <Box sx={{ width: 28 }} />,
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                width: { xs: "100%", md: "auto" },
                            }}
                        >
                            {/* Botones de filtro por cuadrícula */}
                            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                                <Tooltip title="2 columnas">
                                    <IconButton
                                        onClick={() => setGridLayout('2')}
                                        sx={{
                                            color: gridLayout === '2' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                                            backgroundColor: gridLayout === '2' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: gridLayout === '2' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        <ViewListIcon />
                                    </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="3 columnas">
                                    <IconButton
                                        onClick={() => setGridLayout('6')}
                                        sx={{
                                            color: gridLayout === '6' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                                            backgroundColor: gridLayout === '6' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: gridLayout === '6' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        <ViewComfy />
                                    </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="4 columnas">
                                    <IconButton
                                        onClick={() => setGridLayout('8')}
                                        sx={{
                                            color: gridLayout === '8' ? '#837cf2' : 'rgba(255, 255, 255, 0.7)',
                                            backgroundColor: gridLayout === '8' ? 'rgba(131, 124, 242, 0.1)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: gridLayout === '8' ? 'rgba(131, 124, 242, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        <ViewModule />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <FormControl
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <InputLabel
                                    id="sort-select-label"
                                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                >
                                    Ordenar
                                </InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Ordenar"
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        bgcolor: "#272038",
                                        color: "white",
                                        ".MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3a3045",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#837cf2",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#837cf2",
                                            },
                                        ".MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                    }}
                                >
                                    <MenuItem value="popular">Popular</MenuItem>
                                    <MenuItem value="newest">
                                        Más reciente
                                    </MenuItem>
                                    <MenuItem value="alphabetical">
                                        Alfabético
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <InputLabel
                                    id="filter-select-label"
                                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                >
                                    Estado
                                </InputLabel>
                                <Select
                                    labelId="filter-select-label"
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    label="Estado"
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        bgcolor: "#272038",
                                        color: "white",
                                        ".MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3a3045",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#837cf2",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#837cf2",
                                            },
                                        ".MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                    }}
                                >
                                    <MenuItem value="all">Todas</MenuItem>
                                    <MenuItem value="purchased">
                                        Compradas
                                    </MenuItem>
                                    <MenuItem value="not-purchased">
                                        No compradas
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <IconButton
                                color="inherit"
                                sx={{ display: { xs: "flex", md: "none" } }}
                                onClick={() =>
                                    setViewMode(
                                        viewMode === "grid" ? "list" : "grid"
                                    )
                                }
                                aria-label={
                                    viewMode === "grid"
                                        ? "Ver como lista"
                                        : "Ver como cuadrícula"
                                }
                            >
                                {viewMode === "grid" ? (
                                    <ViewListIcon />
                                ) : (
                                    <GridViewIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Breadcrumbs */}
            <Box sx={{ px: 3, py: 1 }} >
                <Breadcrumbs aria-label="breadcrumb" sx={{ color: "grey.500" }}>
                    <Link
                        color="inherit"
                        onClick={() => navigate("/")}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                    >
                        Dashboard
                    </Link>
                    <Typography color="white">
                        {getCategoryDisplayName()}
                    </Typography>
                </Breadcrumbs>
            </Box>

            {/* Subcategorías - Solo mostrar si hay más de una subcategoría */}
            {subcategories.length > 1 && (
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderBottom: "1px solid #3a3045",
                        overflowX: "auto",
                    }}
                >
                    <Tabs
                        value={selectedSubcategory}
                        onChange={(_, newValue) =>
                            setSelectedSubcategory(newValue)
                        }
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            "& .MuiTab-root": {
                                color: "rgba(255, 255, 255, 0.7)",
                                "&.Mui-selected": {
                                    color: "#837cf2",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#837cf2",
                            },
                        }}
                    >
                        {subcategories.map((sub) => (
                            <Tab
                                key={sub}
                                value={sub}
                                label={sub === "all" ? "Todas" : sub}
                            />
                        ))}
                    </Tabs>
                </Box>
            )}

            {/* Contenido principal */}
            <CategoryContainer maxWidth="xl">
                {loading ? (
                    // Skeleton loader
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '24px' }}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Box 
                                key={item} 
                                sx={{ 
                                    width: getCardWidth(), 
                                    boxSizing: 'border-box' 
                                }}
                            >
                                <StyledCard>
                                    <Skeleton variant="rectangular" height={140} />
                                    <Box sx={{ p: 2 }}>
                                        <Skeleton variant="text" height={24} width="60%" />
                                        <Skeleton variant="text" height={20} width="40%" />
                                        <Skeleton variant="text" height={20} width="80%" />
                                    </Box>
                                </StyledCard>
                            </Box>
                        ))}
                    </Box>
                ) : filteredApps.length === 0 ? (
                    // Mensaje de no resultados
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 8,
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: "#272038",
                                borderRadius: "50%",
                                p: 2,
                                mb: 2,
                            }}
                        >
                            <SearchIcon
                                sx={{ fontSize: 40, color: "#837cf2" }}
                            />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            No se encontraron resultados
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ maxWidth: "md", mb: 3 }}
                        >
                            No hay aplicaciones que coincidan con tu búsqueda.
                            Intenta con otros términos o filtros.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedSubcategory("all");
                                setFilterStatus("all");
                                setSortBy("popular");
                            }}
                            sx={{
                                borderColor: "#837cf2",
                                color: "#837cf2",
                                "&:hover": {
                                    borderColor: "#6c64d3",
                                    backgroundColor: "rgba(131, 124, 242, 0.1)",
                                },
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Box>
                ) : (
                    // Grid de apps con estilo AppCard
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '24px' }}>
                        {filteredApps.map((app) => (
                            <Box
                                key={app.id}
                                sx={{ 
                                    width: getCardWidth(), 
                                    boxSizing: 'border-box' 
                                }}
                            >
                                <StyledCard
                                    onClick={() => handleAppClick(app)}
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Estrellita de favoritos */}
                                    <IconButton
                                        onClick={(e) => toggleFavorite(app.id, e)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            zIndex: 2,
                                            color: app.is_favorite ? '#FFD600' : 'rgba(255,255,255,0.5)',
                                            background: 'rgba(30,30,40,0.7)',
                                            '&:hover': { color: '#FFD600', background: 'rgba(30,30,40,0.9)' }
                                        }}
                                        size="small"
                                    >
                                        {app.is_favorite ? <StarIcon /> : <StarBorderIcon />}
                                    </IconButton>

                                    <StyledCardMedia
                                        component="img"
                                        image={
                                            app.imageUrl || app.image_url || "/app-placeholder.svg"
                                        }
                                        title={app.title}
                                        onError={(e) => {
                                            // Si la imagen falla, usar el placeholder SVG
                                            e.target.src = "/app-placeholder.svg";
                                        }}
                                    />
                                    
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div" noWrap>
                                                {app.title}
                                            </Typography>
                                            <Chip 
                                                label={app.category} 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {app.description}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            API: {app.apiName}
                                        </Typography>
                                    </CardContent>
                                    
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            size="small" 
                                            fullWidth 
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(app.route);
                                            }}
                                            sx={{
                                                bgcolor: "#837cf2",
                                                "&:hover": {
                                                    bgcolor: "#6c64d3",
                                                },
                                            }}
                                        >
                                            Usar ahora
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            </Box>
                        ))}
                    </Box>
                )}
            </CategoryContainer>

            {/* Reemplazamos el Dialog por el AppDetailDrawer */}
            <AppDetailDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                app={selectedApp}
            />
        </Box>
    );
};

export default CategoryView;
