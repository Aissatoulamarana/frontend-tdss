'use client';

import { Grid2 } from '@mui/material';

import { _appInvoices } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { Paiement } from '../paiement';
import { PaiementNew } from '../paiement-new';
import { PaiementSummary } from '../paiement-summary';
import { PaiementOverview } from '../paiement-overview';
import { PaiementCurrentVisits } from '../paiement-current';

// ----------------------------------------------------------------------

export function AnalyticPaiementView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <PaiementSummary
            title="Montant Total Payé"
            percent={2.6}
            total={714000}
            icon={
              <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-people.svg`} />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 6 }}>
          <PaiementSummary
            title="En Attente d'encaissement"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={
              <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`} />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 6 }}>
          <PaiementCurrentVisits
            title="Montant collectés par banque"
            chart={{
              series: [
                { label: 'Banque A', value: 3500 },
                { label: 'Banque B', value: 2500 },
                { label: 'Banque C', value: 1500 },
              ],
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <Paiement
            title="Montant Collectés par type de déclaration"
            chart={{
              series: [
                { label: 'Nouvelles', value: 3500 },
                { label: 'Renouvellement', value: 2500 },
                { label: 'Migration', value: 1500 },
              ],
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <PaiementOverview
            title="Statistiques Paiements "
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Total', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Payées', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'En attente', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 12 }}>
          <PaiementNew
            title="Derniers Paiements"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Numero de la facture ' },
              { id: 'Numero', label: 'Numéro de la déclaration' },
              { id: 'Montant', label: 'Montant' },
              { id: 'Status', label: 'Statut' },
              { id: '' },
            ]}
          />
        </Grid2>
      </Grid2>
    </DashboardContent>
  );
}