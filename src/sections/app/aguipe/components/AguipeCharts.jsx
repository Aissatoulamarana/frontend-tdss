'use client';

import { useState } from 'react';
import { Card, CardHeader, Box, Stack, Button, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Les fonctions de formatage ne sont pas utilisées dans ce composant
import { DatePicker } from '@mui/x-date-pickers';
import dynamic from 'next/dynamic';

// Chargement dynamique du composant Chart pour éviter les problèmes de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Déclarations',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 21],
  },
  {
    name: 'Paiements',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 27],
  },
  {
    name: 'Factures',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 25],
  },
];

const CHART_CATEGORIES = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
];

// ----------------------------------------------------------------------

export function AguipeCharts() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const chartOptions = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    stroke: {
      width: [0, 2, 2],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: CHART_CATEGORIES,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function formatYAxis(y) {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} opérations`;
          }
          return y;
        },
      },
      theme: isDarkMode ? 'light' : 'dark',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ],
  };

  return (
    <Card>
      <CardHeader 
        title="Activité mensuelle" 
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <DatePicker
              label="Début"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="Fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
            <Button variant="contained" size="small">
              Appliquer
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Box sx={{ height: 400, position: 'relative' }}>
          <Chart
            type="line"
            series={CHART_DATA}
            options={chartOptions}
            height="100%"
            loading={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
