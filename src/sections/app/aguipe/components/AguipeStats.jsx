'use client';

import { useTheme, alpha } from '@mui/material/styles';
import { fShortenNumber } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';
import { Card, Grid, Stack, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------
const STATS = [
  {
    title: 'Déclarations',
    total: 1285,
    icon: <Iconify icon="solar:document-text-bold" width={32} />,
    color: 'info',
    trend: 'up',
    percent: 12.5,
  },
  {
    title: 'Factures',
    total: 1024,
    icon: <Iconify icon="solar:receipt-bold" width={32} />,
    color: 'success',
    trend: 'up',
    percent: 8.2,
  },
  {
    title: 'Paiements',
    total: 956,
    icon: <Iconify icon="solar:wallet-money-bold" width={32} />,
    color: 'warning',
    trend: 'down',
    percent: 3.1,
  },
  {
    title: 'Taux de paiement',
    total: 93.2,
    suffix: '%',
    icon: <Iconify icon="solar:chart-bold" width={32} />,
    color: 'error',
    trend: 'up',
    percent: 1.8,
  },
];

// ----------------------------------------------------------------------

export function AguipeStats() {
  const theme = useTheme();

  return (
    <Grid container spacing={1}>
      {STATS.map((stat) => (
        <Grid item key={stat.title} xs={12} sm={6} md={3} spacing={3}>
          <Card
            sx={{
              p: 3,
              boxShadow: 0,
              color: `${stat.color}.darker`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4">
                  {fShortenNumber(stat.total)}
                  {stat.suffix}
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
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify
                icon={
                  stat.trend === 'up' ? 'eva:trending-up-fill' : 'eva:trending-down-fill'
                }
                color={stat.trend === 'up' ? 'success.main' : 'error.main'}
                width={20}
              />
              <Typography variant="body2" color={stat.trend === 'up' ? 'success.main' : 'error.main'}>
                {stat.percent}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs mois dernier
              </Typography>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
