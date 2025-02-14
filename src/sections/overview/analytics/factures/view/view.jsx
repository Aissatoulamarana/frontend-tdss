'use client';

import { Grid2 } from '@mui/material';

import { _appInvoices } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { FactureNew } from '../facture-new-invoice';
import { FactureOverview } from '../facture-overview';
import { FactureWidgetSummary } from '../facture-bloc';
import { FactureCurrentDownload } from '../facture-current';
import { FactureWebsiteVisits } from '../facture-website-visits';

// ----------------------------------------------------------------------

export function AnalyticsFactureView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 6, md: 4 }}>
          <FactureWidgetSummary
            title="Montant Total Facturé"
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

        <Grid2 size={{ xs: 6, md: 4 }}>
          <FactureWidgetSummary
            title="Factures Payées"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={
              <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`} />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 4 }}>
          <FactureWidgetSummary
            title="En Attente de paiement"
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
        <Grid2 size={{ xs: 6, md: 12 }}>
          <FactureOverview />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 12 }}>
          <FactureWebsiteVisits
            title="Statistiques factures "
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

        <Grid2 size={{ xs: 6, md: 6 }}>
          <FactureNew
            title="Dernières factures"
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
        <Grid2 size={{ xs: 6, md: 6 }}>
          <FactureCurrentDownload
            title=" Facture Par Categorie"
            chart={{
              series: [
                { label: 'Nouvelles', value: 3500 },
                { label: 'Renouvellement', value: 2500 },
                { label: 'Migration', value: 1500 },
              ],
            }}
          />
        </Grid2>
      </Grid2>
    </DashboardContent>
  );
}