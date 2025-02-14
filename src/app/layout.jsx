
//src/app/layout.jsx

import 'src/global.css';

// ----------------------------------------------------------------------

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { schemeConfig } from 'src/theme/scheme-config';
import { ThemeProvider } from 'src/theme/theme-provider';


import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------


import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from 'src/locales/server';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { Snackbar } from 'src/components/snackbar';

// import { CheckoutProvider } from 'src/sections/checkout/context';
import { I18nProvider } from 'src/locales/i18n-provider';
import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
// ----------------------------------------------------------------------

const AuthProvider =  
(CONFIG.auth.method === 'auth0' && Auth0Provider) || JwtAuthProvider;



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

                <ProgressBar />
                <SettingsDrawer />
                {children}

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
