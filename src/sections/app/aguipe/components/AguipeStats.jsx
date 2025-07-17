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
    <Grid container spacing={2}>
      {STATS_CONFIG.map((stat) => (
        <Grid item key={stat.key} xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              boxShadow: 0,
              color: `${stat.color}.darker`,
              height: '100%',
            }}
          >
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4">
                  {stat.format(stats[stat.key])}
                </Typography>
              </div>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `${stat.color}.main`,
                  bgcolor: (theme) => alpha(theme.palette[stat.color].main, 0.16),
                }}
              >
                {stat.icon}
              </Box>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
