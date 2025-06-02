import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Grid,
    Box,
    CircularProgress,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Tabs,
    Tab,
    Breadcrumbs,
    Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
    selectAllApps,
    selectAppsLoading,
    fetchAllApps,
    toggleFavoriteApp,
    selectPurchasedApps,
    purchaseApp
} from "../../redux/slices/appsSlice";
import AppDetailDrawer from "../../components/AppDetailDrawer/AppDetailDrawer";

// Estilos personalizados
const CategoryContainer = styled(Container)(({ theme }) => ({
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

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#272038",
    color: "white",
    borderRadius: "12px",
    border: "1px solid #3a3045",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 6px 12px rgba(131, 124, 242, 0.2)",
    },
    height: "100%",
    display: "flex",
    flexDirection: "column",
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 200,
    backgroundSize: "cover",
}));

const StyledBadge = styled(Chip)(({ theme, variant }) => ({
    backgroundColor:
        variant === "purchased"
            ? "#4caf50"
            : variant === "available"
            ? "#837cf2"
            : "#3a3045",
    color: "white",
    margin: "2px",
}));

const CategoryView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const allApps = useAppSelector(selectAllApps) || [];
    const loading = useAppSelector(selectAppsLoading);
    const purchasedApps = useAppSelector(selectPurchasedApps);

    // Obtener la categoría desde el estado de ubicación
    const categoryFromState = location.state?.preselectedCategory || "";

    // Estados
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [filterStatus, setFilterStatus] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [selectedApp, setSelectedApp] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Cargar apps al montar el componente
    useEffect(() => {
        if (allApps.length === 0) {
            dispatch(fetchAllApps());
        }
    }, [dispatch, allApps.length]);

    // Filtrar apps por categoría
    const categoryApps = useMemo(() => {
        // Caso especial para Social Listening/Social Media
        if (categoryFromState === "Social Media") {
            return allApps.filter(
                (app) =>
                    app.category === "Social Media" ||
                    app.category === "Social Listening"
            );
        }
        return allApps.filter((app) => app.category === categoryFromState);
    }, [allApps, categoryFromState]);

    // Obtener subcategorías únicas
    const subcategories = useMemo(() => {
        const subcats = [
            ...new Set(
                categoryApps.map((app) => app.subcategory).filter(Boolean)
            ),
        ];
        return ["all", ...subcats];
    }, [categoryApps]);

    // Filtrar y ordenar apps
    const filteredApps = useMemo(() => {
        let result = [...categoryApps];

        // Filtrar por búsqueda
        if (searchQuery) {
            result = result.filter(
                (app) =>
                    app.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    app.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    app.apiName
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Filtrar por subcategoría
        if (selectedSubcategory !== "all" && selectedSubcategory) {
            result = result.filter(
                (app) => app.subcategory === selectedSubcategory
            );
        }

        // Filtrar por estado
        if (filterStatus === "purchased") {
            result = result.filter((app) => app.isPurchased);
        } else if (filterStatus === "not-purchased") {
            result = result.filter((app) => !app.isPurchased);
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
    }, [categoryApps, searchQuery, selectedSubcategory, filterStatus, sortBy]);

    // Manejar favoritos
    const toggleFavorite = async (appId, event) => {
        event.stopPropagation();
        const isPurchased = purchasedApps.some(a => a.id === appId || a.app_id === appId);
        if (!isPurchased) {
            // Espera a que la app esté realmente agregada
            const result = await dispatch(purchaseApp(appId));
            if (purchaseApp.fulfilled.match(result)) {
                await dispatch(toggleFavoriteApp(appId));
            } else {
                // Opcional: muestra un error al usuario
                return;
            }
        } else {
            dispatch(toggleFavoriteApp(appId));
        }
    };

    // Manejar compra
    const handlePurchase = (appId, event) => {
        event.stopPropagation();
        // Aquí iría la lógica para comprar
    };

    // Manejar click en app
    const handleAppClick = (app) => {
        setSelectedApp(app);
        setDrawerOpen(true);
    };

    // Obtener el nombre de la categoría para mostrar
    const getCategoryDisplayName = () => {
        switch (categoryFromState) {
            case "Social Media":
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
            case "Social Media":
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
            <Box sx={{ px: 3, py: 1 }}>
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
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                                <StyledCard>
                                    <Box
                                        sx={{ height: 200, bgcolor: "#3a3045" }}
                                    />
                                    <CardContent>
                                        <Box
                                            sx={{
                                                height: 24,
                                                width: "70%",
                                                bgcolor: "#3a3045",
                                                mb: 1,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                height: 16,
                                                width: "100%",
                                                bgcolor: "#3a3045",
                                                mb: 1,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                height: 16,
                                                width: "90%",
                                                bgcolor: "#3a3045",
                                                mb: 2,
                                            }}
                                        />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Box
                                                sx={{
                                                    height: 24,
                                                    width: 60,
                                                    bgcolor: "#3a3045",
                                                    borderRadius: 1,
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    height: 24,
                                                    width: 80,
                                                    bgcolor: "#3a3045",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ mt: "auto", p: 2 }}>
                                        <Box
                                            sx={{
                                                height: 36,
                                                width: 120,
                                                bgcolor: "#3a3045",
                                                borderRadius: 1,
                                            }}
                                        />
                                    </Box>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
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
                    // Grid de apps
                    <Grid container spacing={3}>
                        {filteredApps.map((app) => (
                            <Grid
                                item
                                xs={12}
                                sm={viewMode === "list" ? 12 : 6}
                                md={viewMode === "list" ? 12 : 4}
                                lg={viewMode === "list" ? 12 : 3}
                                key={app.id}
                            >
                                <StyledCard
                                    onClick={() => handleAppClick(app)}
                                    sx={{
                                        flexDirection:
                                            viewMode === "list"
                                                ? "row"
                                                : "column",
                                        cursor: "pointer",
                                    }}
                                >
                                    <StyledCardMedia
                                        image={
                                            app.imageUrl ||
                                            "https://via.placeholder.com/400x200"
                                        }
                                        title={app.title}
                                        sx={{
                                            width:
                                                viewMode === "list"
                                                    ? "30%"
                                                    : "100%",
                                            height:
                                                viewMode === "list"
                                                    ? "auto"
                                                    : 200,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width:
                                                viewMode === "list"
                                                    ? "70%"
                                                    : "100%",
                                            flex: 1,
                                        }}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    component="h3"
                                                    gutterBottom
                                                >
                                                    {app.title}
                                                </Typography>
                                                <Tooltip
                                                    title={
                                                        app.is_favorite
                                                            ? "Quitar de favoritos"
                                                            : "Añadir a favoritos"
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) =>
                                                            toggleFavorite(
                                                                app.id,
                                                                e
                                                            )
                                                        }
                                                        sx={{
                                                            color: app.is_favorite
                                                                ? "yellow"
                                                                : "white",
                                                        }}
                                                    >
                                                        {app.is_favorite ? (
                                                            <StarIcon />
                                                        ) : (
                                                            <StarBorderIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {app.description}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {app.subcategory && (
                                                    <StyledBadge
                                                        label={app.subcategory}
                                                        size="small"
                                                    />
                                                )}
                                                <StyledBadge
                                                    label={`API: ${app.apiName}`}
                                                    size="small"
                                                />
                                                <StyledBadge
                                                    label={
                                                        app.isPurchased
                                                            ? "Comprada"
                                                            : "Disponible"
                                                    }
                                                    size="small"
                                                    variant={
                                                        app.isPurchased
                                                            ? "purchased"
                                                            : "available"
                                                    }
                                                />
                                            </Box>
                                        </CardContent>

                                        <CardActions
                                            sx={{ p: 2, pt: 0, mt: "auto" }}
                                        >
                                            {app.isPurchased ? (
                                                <Button
                                                    variant="contained"
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
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    startIcon={
                                                        <ShoppingCartIcon />
                                                    }
                                                    onClick={(e) =>
                                                        handlePurchase(
                                                            app.id,
                                                            e
                                                        )
                                                    }
                                                    sx={{
                                                        bgcolor: "#837cf2",
                                                        "&:hover": {
                                                            bgcolor: "#6c64d3",
                                                        },
                                                    }}
                                                >
                                                    Comprar
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Box>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
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
