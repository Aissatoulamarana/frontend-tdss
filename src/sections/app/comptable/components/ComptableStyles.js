import { alpha } from '@mui/material/styles';

/**
 * Styles pour les tables du dashboard comptable
 * Ces styles garantissent une bonne visibilité en mode sombre
 */
export const getTableStyles = (isDarkMode, theme) => ({
  minWidth: 720,
  '& .MuiTableCell-head': {
    color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
    backgroundColor: isDarkMode ? alpha(theme.palette.primary.main, 0.15) : theme.palette.background.neutral,
    fontWeight: 700,
    fontSize: '0.875rem',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${isDarkMode ? theme.palette.divider : theme.palette.background.neutral}`
  }
});

/**
 * Styles pour les légendes des graphiques
 * Ces styles améliorent l'organisation et la visibilité des légendes
 */
export const getChartLegendStyles = (isDarkMode, theme) => ({
  floating: false,
  position: 'bottom',
  horizontalAlign: 'center',
  fontSize: '14px',
  fontWeight: 600,
  offsetY: 10,
  markers: {
    radius: 8,
    width: 12,
    height: 12,
    offsetX: -5
  },
  itemMargin: {
    horizontal: 15,
    vertical: 5
  },
  labels: {
    colors: isDarkMode ? '#ffffff' : theme.palette.text.primary,
    useSeriesColors: false
  }
});
