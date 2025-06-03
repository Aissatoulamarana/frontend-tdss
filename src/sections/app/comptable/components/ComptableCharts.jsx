import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

import { Chart } from 'src/components/chart';
import { fCurrency } from 'src/utils/format-number';

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

export function ComptableFacturationChart() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [selectedYear, setSelectedYear] = useState('2023');
  
  const availableYears = ['2021', '2022', '2023'];
  
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const chartData = MONTHLY_INVOICE_DATA.map(item => item.value);
  
  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    xaxis: {
      categories: MONTHLY_INVOICE_DATA.map(item => item.month),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        formatter: (value) => fCurrency(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
      },
      theme: isDarkMode ? 'light' : 'dark',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: true },
      },
    },
    markers: {
      size: 5,
      strokeColors: theme.palette.background.paper,
      fillOpacity: 1,
      strokeOpacity: 1,
      hover: {
        size: 7,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.3,
      },
    },
  };

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <Iconify icon="mdi:chart-line" width={24} sx={{ mr: 1 }} />
          Évolution des facturations
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="year-select-label">Année</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            label="Année"
            onChange={handleYearChange}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Chart
          type="area"
          series={[{ name: 'Facturations', data: chartData }]}
          options={chartOptions}
          height={320}
        />
      </Box>
    </Card>
  );
}
