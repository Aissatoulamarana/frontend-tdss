import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export function ComptableWidgetSummary({
  title,
  total,
  icon,
  color = 'primary',
  isCurrency = false,
  loading = false,
  sx,
  percent = 0,
  currency = 'XOF',
  isRevenue = false,
  ...other
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const displayPercent = Number(percent) || 0;

  if (loading) {
    return (
      <Card
        sx={{
          height: 120,
          p: 2,
          ...sx,
        }}
        {...other}
      >
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={32} />
        </Stack>
      </Card>
    );
  }

  // Fonction de formatage qui tient compte de la devise
  const formatValue = (value, isCurrencyValue = false, isRevenue = false) => {
    if (!isCurrencyValue) {
      return formatLargeNumber(value);
    }

    // Si c'est le revenu, on applique le formatage de devise avec format court
    if (isRevenue) {
      // D'abord, on formate le nombre en version courte
      const formattedNumber = formatLargeNumber(value);

      // On récupère le symbole de la devise
      const currencySymbol =
        {
          XOF: 'FCFA',
          EUR: '€',
          GNF: 'FG',
        }[currency] || 'FG';

      // On combine le nombre formaté avec le symbole de la devise
      return `${formattedNumber} ${currencySymbol}`;
    }

    // Pour les autres montants monétaires (non-soumis à conversion)
    return fCurrency(value, { minimumFractionDigits: 0 });
  };

  const formatLargeNumber = (num) => {
    if (!num) return '0';
    const value = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;

    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`; // Billiards
    }
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`; // Milliards
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`; // Millions
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`; // Milliers
    }
    return `${value}`;
  };

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {isCurrency ? formatValue(total, true, isRevenue) : formatValue(total)}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
            color: (theme) => theme.palette[color].dark,
          }}
        >
          <Iconify icon={icon} width={24} height={24} />
        </Box>
      </Stack>
    </Card>
  );
}

ComptableWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isCurrency: PropTypes.bool,
  loading: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  title: PropTypes.string,
  total: PropTypes.number,
};
