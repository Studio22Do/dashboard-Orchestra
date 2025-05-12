import React from "react";
import { Box, Typography, Grid, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowForward } from "@mui/icons-material";
import ToolCard from "../ToolCard/ToolCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Contenedor principal de la categoría
const CategoryContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),

    width: "100%",
}));

// Contenedor del título con icono
const CategoryTitle = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    "& .category-icon": {
        marginRight: theme.spacing(1.5),
        color: "white",
        fontSize: 28,
    },
}));

// Contenedor de herramientas con posición relativa para los botones de desplazamiento
const ToolsContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    padding: `0 ${theme.spacing(4)}`,
    maxWidth: "100%",
    marginTop: theme.spacing(3),
}));

// Contenedor de cada tarjeta
const CardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.5),
    height: "100%",
    position: "relative",
    zIndex: 0,
}));

// Contenedor del título y botón Ver todas
const TitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
    width: "100%",
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(2),
}));

// Botón Ver todas estilizado
const ViewAllButton = styled(Button)(({ theme }) => ({
    color: "white",
    fontWeight: 500,
    fontSize: "0.9rem",
    textTransform: "none",
    "&:hover": {
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
    },
    "& .MuiButton-endIcon": {
        transition: "transform 0.2s ease",
    },
    "&:hover .MuiButton-endIcon": {
        transform: "translateX(3px)",
    },
    zIndex: 20,
    position: "relative",
}));

const StyledSwiper = styled(Swiper)(({ theme }) => ({
    padding: theme.spacing(2),
    "& .swiper-button-next, & .swiper-button-prev": {
        color: "white",
        fontSize: "34px",

        width: "68px",
        height: "80%",
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "23%",
        zIndex: 20,
        "&:after": {
            fontSize: "24px",
        },
    },
    "& .swiper-button-next": {
        right: "-68px",
    },
    "& .swiper-button-prev": {
        left: "-65px",
    },

    overflow: "visible",
    width: "95%",
}));

const CategorySection = ({ title, icon: Icon, tools, onViewAll }) => {
    const hasMultipleTools = tools.length > 3;

    return (
        <CategoryContainer>
            <TitleContainer>
                <CategoryTitle>
                    {Icon && <Icon className="category-icon" />}
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 500,
                            color: "white",
                            fontSize: "1.4rem",
                        }}
                    >
                        {title}
                    </Typography>
                </CategoryTitle>

                <ViewAllButton endIcon={<ArrowForward />} onClick={onViewAll}>
                    Ver todas
                </ViewAllButton>
            </TitleContainer>

            {hasMultipleTools ? (
                <ToolsContainer>
                    <StyledSwiper
                        slidesPerView={3}
                        spaceBetween={20}
                        navigation={true}
                        modules={[Navigation]}
                        className="mySwiper"
                        watchSlidesProgress={true}
                    >
                        {tools.map((tool) => (
                            <SwiperSlide key={tool.id}>
                                <CardContainer>
                                    <ToolCard
                                        title={tool.title}
                                        icon={tool.icon}
                                        onClick={tool.onClick}
                                    />
                                </CardContainer>
                            </SwiperSlide>
                        ))}
                    </StyledSwiper>
                </ToolsContainer>
            ) : (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {tools.map((tool) => (
                        <Grid item xs={12} sm={6} md={4} key={tool.id}>
                            <ToolCard
                                title={tool.title}
                                icon={tool.icon}
                                onClick={tool.onClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </CategoryContainer>
    );
};

export default CategorySection;
