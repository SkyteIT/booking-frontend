// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: '#0077b6',        // app primary blue
      light: '#00B4D8',       // app accent blue
      dark: '#005a8d',        // app primary dark blue
      contrastText: '#ffffff', // --primary-foreground
    },
    secondary: {
      main: '#F3F4F6',        // app neutral surface
      light: '#F9FAFB',       // app neutral background
      dark: '#E5E7EB',        // app border
      contrastText: '#111827', // app main text
    },
    error: {
      main: '#DC2626',        // --destructive
      contrastText: '#ffffff', // --destructive-foreground
    },
    warning: {
      main: '#F59E0B',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0077b6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',     // app background
      paper: '#ffffff',       // app card
    },
    text: {
      primary: '#111827',     // app main text
      secondary: '#6B7280',   // app muted text
    },
    
    divider: '#E5E7EB',       // app border
  },
  

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,             // --font-size
    h1: {
      fontSize: '2rem',       // --text-2xl equivalent
      fontWeight: 500,        // --font-weight-medium
      lineHeight: 1.5,
    },
    h2: {
      fontSize: '1.5rem',     // --text-xl equivalent
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: '1.25rem',    // --text-lg equivalent
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: '1rem',       // --text-base
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,        // --font-weight-normal
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      // use palette.text.secondary by default
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,        // --font-weight-medium
      lineHeight: 1.5,
      textTransform: 'none',  // Prevents ALL CAPS
    },
    caption: {
      fontSize: '0.875rem',
      // use palette.text.secondary by default
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
          backgroundColor: '#ffffff',   // app background
          // let theme.palette.text.primary control text color
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',          // --radius
          padding: '8px 18px',
          boxShadow: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0077b6',   // app primary
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#005a8d', // app primary dark
          },
        },
        outlinedPrimary: {
          borderColor: '#E5E7EB',       // app border
          color: '#0077b6',
          '&:hover': {
            backgroundColor: '#F3F4F6', // app neutral surface
          },
        },
      },
    },
    
      // theme.ts
   

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',   // app card
          // color inherited from theme.palette.text.primary
          borderRadius: '8px',          // --radius
          border: '1px solid #E5E7EB',  // app border
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
          backgroundColor: '#F9FAFB',   // app input background
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 400,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#E5E7EB',       // app border
        },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00B4D8',     // app accent blue
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0077b6',     // app primary
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',   // app background
          // foreground color inherited from theme
          boxShadow: '0px 1px 0px #E5E7EB', // app border
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          backgroundColor: '#F3F4F6',   // app neutral chip
          color: '#0077b6',             // app primary text
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E5E7EB',       // app border
        },
      },
    },
  },
});

export default theme;