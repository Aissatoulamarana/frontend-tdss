'use client';

import { useTheme, alpha } from '@mui/material/styles';
import { fShortenNumber, fPercent } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';
import { Card, Grid, Stack, Typography, Box, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

const STATS_CONFIG = [
  {
    key: 'total_declarations',
    title: 'Déclarations',
    icon: <Iconify icon="solar:document-text-bold" width={32} />,
    color: 'info',
    format: (value) => fShortenNumber(value || 0),
  },
  {
    key: 'total_facture',
    title: 'Factures',
    icon: <Iconify icon="solar:receipt-bold" width={32} />,
    color: 'success',
    format: (value) => fShortenNumber(value || 0),
  },
  {
    key: 'total_payment',
    title: 'Paiements',
    icon: <Iconify icon="solar:wallet-money-bold" width={32} />,
    color: 'warning',
    format: (value) => fShortenNumber(value || 0),
  },
  {
    key: 'taux_payment',
    title: 'Taux de paiement',
    icon: <Iconify icon="solar:chart-bold" width={32} />,
    color: 'error',
    format: (value) => fPercent((value || 0) * 100),
  },
];

// ----------------------------------------------------------------------

export function AguipeStats({ stats = {}, loading = false }) {
  const theme = useTheme();

  if (loading) {
    return (
      <Grid container spacing={2}>
        {STATS_CONFIG.map((stat) => (
          <Grid item key={stat.key} xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {STATS_CONFIG.map((stat) => (
        <Grid item key={stat.key} xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              transition: (theme) => theme.transitions.create(['transform', 'box-shadow'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.grey[500], 0.16)}`,
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem',
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: 'text.primary',
                  }}
                >
                  {stat.format(stats[stat.key])}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `${stat.color}.main`,
                  bgcolor: (theme) => alpha(theme.palette[stat.color].main, 0.08),
                  border: (theme) => `1px solid ${alpha(theme.palette[stat.color].main, 0.24)}`,
                  transition: (theme) => theme.transitions.create('all'),
                  '& svg': {
                    width: 28,
                    height: 28,
                  },
                }}
              >
                {stat.icon}
              </Box>
            </Stack>
            
            {/* Indicateur de couleur en bas de la carte */}
            <Box
              sx={{
                mt: 2,
                height: 4,
                borderRadius: 2,
                background: (theme) => `linear-gradient(90deg, ${theme.palette[stat.color].main} 0%, ${alpha(theme.palette[stat.color].main, 0.5)} 100%)`,
              }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
