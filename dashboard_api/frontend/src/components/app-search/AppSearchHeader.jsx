import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const Container = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 0,
  paddingTop: 20,
  paddingBottom: 0,
});

const SearchField = styled(TextField)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  marginTop: 10,
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: '#837CF3',
    },
    '&:hover fieldset': {
      borderColor: '#a89af7',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    padding: '12px 16px',
  },
}));

const AppSearchHeader = ({ searchQuery, setSearchQuery }) => (
  <Container>
    <Typography
      sx={{
        color: '#fff',
        fontSize: 15,
        fontWeight: 400,
        textAlign: 'center',
        m: 0,
        p: 0,
      }}
    >
      Explora nuestra colección de aplicaciones.
    </Typography>
    <SearchField
      placeholder="Buscar Apps..."
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search sx={{ color: '#837CF3' }} />
          </InputAdornment>
        ),
      }}
    />
  </Container>
);

AppSearchHeader.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default AppSearchHeader; 