'use client';

import { Grid2 } from '@mui/material';

import { _appInvoices } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { DeclarationNew } from '../declaration-new-invoice';
import { DeclarationWebsiteVisits } from '../declaration-website';
import { DeclarationWidgetSummary } from '../declaration-summary';
import { DeclarationCurrentVisits } from '../declaration-current-visits';
import { DeclarationCurrentDownload } from '../declaration-current-download';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <DeclarationWidgetSummary
            title="Nombres Employés déclarés"
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

        <Grid2 size={{ xs: 6, md: 3 }}>
          <DeclarationWidgetSummary
            title="Nombres d'employés déclarés"
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

        <Grid2 size={{ xs: 6, md: 3 }}>
          <DeclarationWidgetSummary
            title="Paiements"
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

        <Grid2 size={{ xs: 6, md: 3 }}>
          <DeclarationWidgetSummary
            title="Factures"
            percent={3.6}
            total={234}
            color="error"
            icon={
              <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`} />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 6 }}>
          <DeclarationCurrentVisits
            title="Déclarations"
            chart={{
              series: [
                { label: 'Permis A', value: 3500 },
                { label: 'Permis B', value: 2500 },
                { label: 'Permis C', value: 1500 },
              ],
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <DeclarationCurrentDownload
            title=" Types Déclarations"
            chart={{
              series: [
                { label: 'Nouvelles', value: 3500 },
                { label: 'Renouvellement', value: 2500 },
                { label: 'Migration', value: 1500 },
              ],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 12 }}>
          <DeclarationWebsiteVisits
            title="Déclarations"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Facturé', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Validées', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'En attente', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: 'Rejeté', data: [40, 10, 7, 6, 20, 17, 24, 10, 14] },
              ],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 6, md: 6 }}>
          <DeclarationNew
            title="Statistiques des Entreprises"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Entreprise ' },
              { id: 'Permis A', label: 'Permis A' },
              { id: 'Permis B', label: 'Permis B' },
              { id: 'Permis C', label: 'Permis C' },
              { id: 'Total', label: 'Total Employés' },
              { id: '' },
            ]}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, md: 6 }}>
          <DeclarationNew
            title="Statistiques Par Nationalités"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Nationalité ' },
              { id: 'Permis A', label: 'Permis A' },
              { id: 'Permis B', label: 'Permis B' },
              { id: 'Permis C', label: 'Permis C' },
              { id: 'Total', label: 'Total Employés' },
              { id: '' },
            ]}
          />
        </Grid2>
      </Grid2>
    </DashboardContent>
  );
}