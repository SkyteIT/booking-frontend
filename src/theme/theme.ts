// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',        // --primary
      light: '#3B82F6',       // --blue-500
      dark: '#1D4ED8',        // --blue-700
      contrastText: '#ffffff', // --primary-foreground
    },
    secondary: {
      main: '#F1F5F9',        // --secondary
      light: '#EFF6FF',       // --accent
      dark: '#E2E8F0',        // --border
      contrastText: '#0F172A', // --secondary-foreground
    },
    error: {
      main: '#DC2626',        // --destructive
      contrastText: '#ffffff', // --destructive-foreground
    },
    background: {
      default: '#ffffff',     // --background
      paper: '#ffffff',       // --card
    },
    text: {
      primary: '#0F172A',     // --foreground
      secondary: '#64748B',   // --muted-foreground
    },
    divider: '#E2E8F0',       // --border
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,             // --font-size
    h1: {
      fontSize: '2rem',       // --text-2xl equivalent
      fontWeight: 500,        // --font-weight-medium
      lineHeight: 1.5,
      color: '#0F172A',
    },
    h2: {
      fontSize: '1.5rem',     // --text-xl equivalent
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#0F172A',
    },
    h3: {
      fontSize: '1.25rem',    // --text-lg equivalent
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#0F172A',
    },
    h4: {
      fontSize: '1rem',       // --text-base
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#0F172A',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,        // --font-weight-normal
      lineHeight: 1.5,
      color: '#0F172A',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#64748B',       // --muted-foreground
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,        // --font-weight-medium
      lineHeight: 1.5,
      textTransform: 'none',  // Prevents ALL CAPS
    },
    caption: {
      fontSize: '0.875rem',
      color: '#64748B',
    },
  },

  shape: {
    borderRadius: 8,          // --radius: 0.5rem = 8px
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        body: {
          backgroundColor: '#ffffff',   // --background
          color: '#0F172A',             // --foreground
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',          // --radius
          padding: '10px 24px',
          boxShadow: 'none',
          fontWeight: 500,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#2563EB',   // --primary
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1D4ED8', // --blue-700
          },
        },
        outlinedPrimary: {
          borderColor: '#E2E8F0',       // --border
          color: '#2563EB',
          '&:hover': {
            backgroundColor: '#EFF6FF', // --accent
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',   // --card
          color: '#0F172A',             // --card-foreground
          borderRadius: '8px',          // --radius
          border: '1px solid #E2E8F0',  // --border
          boxShadow: '0px 4px 16px rgba(0,0,0,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 28px rgba(0,0,0,0.10)',
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8FAFC',   // --input-background
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 400,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#E2E8F0',       // --border
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6',     // --blue-500
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',     // --primary
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',   // --background
          color: '#0F172A',             // --foreground
          boxShadow: '0px 1px 0px #E2E8F0', // --border
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          backgroundColor: '#EFF6FF',   // --accent
          color: '#1E40AF',             // --accent-foreground
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',       // --border
        },
      },
    },
  },
});

export default theme;