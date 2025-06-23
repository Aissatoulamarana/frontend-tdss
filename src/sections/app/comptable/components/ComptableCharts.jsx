import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { CardHeader, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { Chart } from 'src/components/chart';

// ----------------------------------------------------------------------

// Données mockées pour le développement
const INVOICE_STATUS_DATA = [
  { label: 'Payées', value: 65 },
  { label: 'En attente', value: 25 },
  { label: 'En retard', value: 10 },
];

const MONTHLY_INVOICE_DATA = [
  { month: 'Jan', value: 1200000 },
  { month: 'Fév', value: 1500000 },
  { month: 'Mar', value: 1800000 },
  { month: 'Avr', value: 1600000 },
  { month: 'Mai', value: 2100000 },
  { month: 'Juin', value: 1900000 },
  { month: 'Juil', value: 2200000 },
  { month: 'Août', value: 2000000 },
  { month: 'Sep', value: 2300000 },
  { month: 'Oct', value: 2500000 },
  { month: 'Nov', value: 2700000 },
  { month: 'Déc', value: 3000000 },
];

// ----------------------------------------------------------------------

export function ComptableStatusChart() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const chartOptions = {
    chart: {
      background: 'transparent',
    },
    colors: [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    labels: INVOICE_STATUS_DATA.map(i => i.label),
    stroke: {
      colors: [
        isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
      ],
    },
    legend: {
      floating: false,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 600,
      offsetY: 10,
      markers: {
        radius: 8,
        width: 12,
        height: 12,
        offsetX: -5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      },
      labels: {
        colors: isDarkMode ? '#ffffff' : theme.palette.text.primary,
        useSeriesColors: false
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: {
        fontSize: '14px',
        fontWeight: 600,
        colors: [
          isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
        ],
      },
      formatter: (value) => `${value}%`,
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `${value}%`,
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.85, // Réduire la taille globale du graphique
        donut: {
          size: '70%', // Réduire la taille du trou du donut
          labels: {
            value: {
              formatter: (value) => `${value}%`,
            },
            total: {
              formatter: () => {
                const total = INVOICE_STATUS_DATA.reduce((sum, item) => sum + item.value, 0);
                return `${total}%`;
              },
              label: 'Total',
              color: theme.palette.text.primary,
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <Iconify icon="mdi:chart-pie" width={24} sx={{ mr: 1 }} />
          Répartition des factures
        </Typography>
      </Box>
      <Box sx={{ p: 3, pt: 1 }} dir="ltr">
        <Chart
          type="donut"
          series={INVOICE_STATUS_DATA.map(i => i.value)}
          options={chartOptions}
          height={300}
        />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------


export function ComptableFacturationChart({ series, options, selectedYear, years, onYearChange }) {
  const theme = useTheme();
  
  // Utilisez les options passées en props ou définissez des valeurs par défaut
  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Nombre de factures',
        style: {
          color: theme.palette.text.secondary,
        },
      },
      labels: {
        formatter: (value) => Math.round(value) === value ? value : '',
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} facture${value > 1 ? 's' : ''}`,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    ...options, // Permet de surcharger les options par défaut
  };

  return (
    <Card>
      <CardHeader 
        title="Évolution des factures mensuelles"
        subheader="Nombre de factures par mois"
        action={
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="year-select-label">Année</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Année"
              onChange={(e) => onYearChange(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Chart
          type="area"
          series={series}
          options={chartOptions}
          height={320}
        />
      </Box>
    </Card>
  );
}