'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { _appAuthors, _appRelated, _appInvoices, _appInstalled } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { svgColorClasses } from 'src/components/svg-color';

import { AppAreaInstalled } from '../app-area-installed';
import { AppCurrentDownload } from '../app-current-download';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopInstalledCountries } from '../app-top-installed-countries';
import { AppTopRelated } from '../app-top-related';
import { AppWidget } from '../app-widget';
import { AppWidgetSummary } from '../app-widget-summary';



// ----------------------------------------------------------------------

export function ComptableAppView() {
 

  const theme = useTheme();
  

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Employés déclarés"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Total Paiement"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title=" En attente de paiement"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Total Factures"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppCurrentDownload
            title="Catégorie de déclaration"
            subheader=""
            chart={{
              series: [
                { label: 'Permis A', value: 12244 },
                { label: 'Permis B', value: 53345 },
                { label: 'Permis C', value: 44313 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 8 }}>
          <AppAreaInstalled
            title="Déclarations"
            subheader="(+43%) Depuis l'année dernière"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    { name: 'Permis A', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Permis B', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Permis C', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    { name: 'Permis A', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Permis B', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Permis C', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    { name: 'Permis A', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis B', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis C', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 8 }}>
          <AppNewInvoice
            title="Dernières Déclarations"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Déclaration ' },
              { id: 'Total', label: 'Total Employés' },
              { id: 'price', label: 'Montant' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopRelated title="Entreprises" list={_appRelated} />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopInstalledCountries title="Pays" list={_appInstalled} />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopAuthors title="Top Utilisateurs" list={_appAuthors} />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>
      </Grid>


    </DashboardContent>
  );
}