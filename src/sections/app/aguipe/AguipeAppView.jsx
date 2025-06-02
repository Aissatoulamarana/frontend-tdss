'use client';

import { Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Components
import { AguipeStats } from './components/AguipeStats';
import { AguipeCharts } from './components/AguipeCharts';
import { AguipeTables } from './components/AguipeTables';

// ----------------------------------------------------------------------

export default function AguipeAppView() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* En-tête */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Tableau de bord AGUIPE</Typography>
        </Stack>

        {/* Section des statistiques */}
        <AguipeStats />

        {/* Section des graphiques */}
        <AguipeCharts />

        {/* Section des tableaux */}
        <AguipeTables />
      </Stack>
    </Container>
  );
}
