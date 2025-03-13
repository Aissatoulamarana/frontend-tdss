'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { schemeConfig } from './scheme-config';
import { RTL } from './with-settings/right-to-left';

// ----------------------------------------------------------------------

export function ThemeProvider({ children }) {
  const settings = useSettingsContext();

  const theme = createTheme(settings);

  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RTL direction={settings.direction}>
          {children}
        </RTL>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
