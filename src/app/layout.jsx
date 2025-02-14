// src/app/layout.jsx
import 'src/global.css';

// ----------------------------------------------------------------------
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { CONFIG } from 'src/config-global';
import { LocalizationProvider } from 'src/locales';
// import { CheckoutProvider } from 'src/sections/checkout/context';
import { I18nProvider } from 'src/locales/i18n-provider';
import { detectLanguage } from 'src/locales/server';
import { primary } from 'src/theme/core/palette';
import { schemeConfig } from 'src/theme/scheme-config';
import { ThemeProvider } from 'src/theme/theme-provider';

import { MotionLazy } from 'src/components/animate/motion-lazy';
import { ProgressBar } from 'src/components/progress-bar';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { Snackbar } from 'src/components/snackbar';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
// ----------------------------------------------------------------------

const AuthProvider =
  (CONFIG.auth.method === 'auth0') || JwtAuthProvider;


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

export default async function RootLayout({ children }) {
  const lang = CONFIG.isStaticExport ? 'en' : await detectLanguage();
  return (
    <html lang={lang ?? 'en'} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={schemeConfig.defaultMode}
          modeStorageKey={schemeConfig.modeStorageKey}
        />
        <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
          <LocalizationProvider>
            <AuthProvider>
              <SettingsProvider settings={defaultSettings}>
                <ThemeProvider>
                  <MotionLazy>
                    {/* <CheckoutProvider> */}
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer />
                    {children}
                    {/* </CheckoutProvider> */}
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </AuthProvider>
          </LocalizationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}