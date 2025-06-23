import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber, fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function ComptableWidgetSummary({ title, total, icon, color = 'primary', isCurrency = false, sx, ...other }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        color: theme.palette.common.white,
        bgcolor: isDarkMode 
          ? theme.palette[color].dark
          : theme.palette[color].main,
        borderRadius: 2,
        border: `1px solid ${theme.palette[color].main}`,
        transition: 'all 0.3s ease-in-out',
        height: 120, // Hauteur fixe pour tous les widgets
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
          bgcolor: isDarkMode 
            ? theme.palette[color].main
            : theme.palette[color].dark,
        },
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.common.white,
                fontWeight: 600,
                mb: 0.5,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: 0.9,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.common.white,
                fontWeight: 800,
                fontSize: '1.8rem',
                lineHeight: 1.2,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {isCurrency ? fCurrency(total) : fShortenNumber(total)}
            </Typography>
          </div>

          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.common.white,
              bgcolor: alpha(theme.palette.common.white, 0.2),
              border: `2px solid ${alpha(theme.palette.common.white, 0.5)}`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                bgcolor: alpha(theme.palette.common.white, 0.25),
                boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
              }
            }}
          >
            {icon}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

ComptableWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isCurrency: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  title: PropTypes.string,
  total: PropTypes.number,
};
