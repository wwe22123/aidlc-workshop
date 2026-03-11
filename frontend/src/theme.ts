import { createTheme } from '@mui/material';

// Restaurant premium dark theme
// Inspired by upscale restaurant/cafe one-page templates
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#c9a96e', light: '#dfc08a', dark: '#a88a4e' },
    secondary: { main: '#e74c3c', light: '#ff6b5a', dark: '#c0392b' },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b0a89a',
    },
    divider: 'rgba(201,169,110,0.2)',
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.05em' },
    h5: { fontWeight: 600, letterSpacing: '0.03em' },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#0f0f0f' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(201,169,110,0.15)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid rgba(201,169,110,0.12)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #c9a96e 0%, #a88a4e 100%)',
          color: '#0f0f0f',
          fontWeight: 700,
          '&:hover': {
            background: 'linear-gradient(135deg, #dfc08a 0%, #c9a96e 100%)',
          },
        },
        outlined: {
          borderColor: '#c9a96e',
          color: '#c9a96e',
          '&:hover': {
            borderColor: '#dfc08a',
            backgroundColor: 'rgba(201,169,110,0.08)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#b0a89a',
          '&.Mui-selected': { color: '#c9a96e' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#c9a96e' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(201,169,110,0.3)' },
            '&:hover fieldset': { borderColor: '#c9a96e' },
            '&.Mui-focused fieldset': { borderColor: '#c9a96e' },
          },
          '& .MuiInputLabel-root': { color: '#b0a89a' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#1a1a1a', border: '1px solid rgba(201,169,110,0.15)' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#1a1a1a' },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorSecondary: { backgroundColor: '#e74c3c' },
      },
    },
  },
});

export default theme;
