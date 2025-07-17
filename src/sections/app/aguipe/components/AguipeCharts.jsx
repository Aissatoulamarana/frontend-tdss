'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Box, CardContent, Skeleton, Typography } from '@mui/material';
import { fNumber } from 'src/utils/format-number';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Fonction pour formater les données du graphique
const formatChartData = (statistiques = {}) => {
  // Vérifier si les données sont vides
  const hasData = statistiques?.declaration || statistiques?.facture || statistiques?.payment;
  
  if (!hasData) {
    return [];
  }

  return [
    {
      name: 'Déclarations',
      data: Array.isArray(statistiques.declaration) 
        ? statistiques.declaration 
        : Object.values(statistiques.declaration || {}),
    },
    {
      name: 'Factures',
      data: Array.isArray(statistiques.facture) 
        ? statistiques.facture 
        : Object.values(statistiques.facture || {}),
    },
    {
      name: 'Paiements',
      data: Array.isArray(statistiques.payment) 
        ? statistiques.payment 
        : Object.values(statistiques.payment || {}),
    },
  ];
};

export function AguipeCharts({ statistique_shart = {}, loading = false }) {
  const theme = useTheme();
  const chartData = formatChartData(statistique_shart);
  const hasData = chartData.length > 0 && chartData.some(serie => serie.data.length > 0);

  const chartOptions = useChart({
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    xaxis: {
      categories: MONTHS,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fNumber(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ],
    noData: {
      text: 'Aucune donnée disponible',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: theme.palette.text.secondary,
        fontSize: '14px',
        fontFamily: theme.typography.fontFamily,
      }
    }
  });

  if (loading) {
    return (
      <Card>
        <CardHeader title="Chargement des statistiques..." />
        <Box sx={{ p: 3, pb: 1 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Statistiques mensuelles"
        subheader="Évolution des déclarations, factures et paiements"
      />
      <CardContent>
        <Box sx={{ height: 400, minWidth: '100%' }}>
          {hasData ? (
            <Chart
              type="bar"
              series={chartData}
              options={chartOptions}
              height="100%"
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body1">Aucune donnée disponible pour la période sélectionnée</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
