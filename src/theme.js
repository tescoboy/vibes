import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B0000', // Deep theatrical red
      light: '#AB2626',
      dark: '#5C0000',
    },
    secondary: {
      main: '#DAA520', // Stage gold
      light: '#FFD700',
      dark: '#B8860B',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Roboto", "Arial", sans-serif',
    h1: {
      fontFamily: 'Playfair Display',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Playfair Display',
      fontWeight: 600,
    },
    button: {
      fontFamily: 'Roboto',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
}); 