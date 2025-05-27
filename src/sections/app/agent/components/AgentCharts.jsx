import { useState, useEffect } from 'react';
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

// ----------------------------------------------------------------------

// Contexte utilisateur simulé (à remplacer par un vrai contexte d'authentification)
const CURRENT_USER = {
  id: 'AGENT-001',
  name: 'Jean Dupont',
  company: 'Entreprise ABC',
  role: 'agent',
};

// Données mockées pour le développement
const ALL_PERMIT_CATEGORIES = [
  { category: 'Permis A', value: 25, agentId: 'AGENT-001' },
  { category: 'Permis B', value: 18, agentId: 'AGENT-001' },
  { category: 'Permis C', value: 12, agentId: 'AGENT-001' },
  { category: 'Permis D', value: 8, agentId: 'AGENT-002' },
  { category: 'Permis E', value: 5, agentId: 'AGENT-003' },
];

const ALL_DECLARATION_SERIES = [
  {
    year: 2023,
    data: [
      { month: 'Jan', value: 5, agentId: 'AGENT-001' },
      { month: 'Fév', value: 8, agentId: 'AGENT-001' },
      { month: 'Mar', value: 12, agentId: 'AGENT-001' },
      { month: 'Avr', value: 10, agentId: 'AGENT-001' },
      { month: 'Mai', value: 15, agentId: 'AGENT-001' },
      { month: 'Juin', value: 0, agentId: 'AGENT-001' },
      { month: 'Juil', value: 0, agentId: 'AGENT-001' },
      { month: 'Août', value: 0, agentId: 'AGENT-001' },
      { month: 'Sep', value: 0, agentId: 'AGENT-001' },
      { month: 'Oct', value: 0, agentId: 'AGENT-001' },
      { month: 'Nov', value: 0, agentId: 'AGENT-001' },
      { month: 'Déc', value: 0, agentId: 'AGENT-001' },
    ],
  },
  {
    year: 2022,
    data: [
      { month: 'Jan', value: 3, agentId: 'AGENT-001' },
      { month: 'Fév', value: 5, agentId: 'AGENT-001' },
      { month: 'Mar', value: 8, agentId: 'AGENT-001' },
      { month: 'Avr', value: 12, agentId: 'AGENT-001' },
      { month: 'Mai', value: 10, agentId: 'AGENT-001' },
      { month: 'Juin', value: 15, agentId: 'AGENT-001' },
      { month: 'Juil', value: 18, agentId: 'AGENT-001' },
      { month: 'Août', value: 14, agentId: 'AGENT-001' },
      { month: 'Sep', value: 12, agentId: 'AGENT-001' },
      { month: 'Oct', value: 10, agentId: 'AGENT-001' },
      { month: 'Nov', value: 8, agentId: 'AGENT-001' },
      { month: 'Déc', value: 6, agentId: 'AGENT-001' },
    ],
  },
  {
    year: 2021,
    data: [
      { month: 'Jan', value: 2, agentId: 'AGENT-001' },
      { month: 'Fév', value: 4, agentId: 'AGENT-001' },
      { month: 'Mar', value: 6, agentId: 'AGENT-001' },
      { month: 'Avr', value: 8, agentId: 'AGENT-001' },
      { month: 'Mai', value: 10, agentId: 'AGENT-001' },
      { month: 'Juin', value: 12, agentId: 'AGENT-001' },
      { month: 'Juil', value: 14, agentId: 'AGENT-001' },
      { month: 'Août', value: 12, agentId: 'AGENT-001' },
      { month: 'Sep', value: 10, agentId: 'AGENT-001' },
      { month: 'Oct', value: 8, agentId: 'AGENT-001' },
      { month: 'Nov', value: 6, agentId: 'AGENT-001' },
      { month: 'Déc', value: 4, agentId: 'AGENT-001' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AgentPermitCategoryChart() {
  const [permitCategories, setPermitCategories] = useState([]);
  const { palette, customShadows } = useTheme();
  const isDarkMode = palette.mode === 'dark';

  // Filtrer les catégories de permis pour n'afficher que celles de l'agent connecté
  useEffect(() => {
    const filteredCategories = ALL_PERMIT_CATEGORIES.filter(cat => cat.agentId === CURRENT_USER.id);
    setPermitCategories(filteredCategories);
  }, []);

  const chartOptions = {
    chart: {
      width: 400,
      background: 'transparent',
    },
    colors: isDarkMode ? [
      '#66d9ef',
      '#f7d2c4',
      '#8bc34a',
      '#ff9800',
      '#03a9f4',
    ] : [
      '#00A76F',
      '#FFAB00',
      '#00B8D9',
      '#FF5630',
      '#05C3FF',
    ],
    labels: permitCategories.map(i => i.category),
    stroke: { show: false },
    legend: {
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => `${value}`,
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${sum}`;
              },
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
          Répartition par Catégorie
        </Typography>
      </Box>
      <Box sx={{ p: 3, pt: 1 }} dir="ltr">
        <Chart
          type="donut"
          series={permitCategories.map(i => i.value)}
          options={chartOptions}
          height={300}
        />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function AgentDeclarationChart() {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [chartData, setChartData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Filtrer les données de déclaration pour n'afficher que celles de l'agent connecté
  useEffect(() => {
    // Récupérer les années disponibles pour l'agent
    const years = ALL_DECLARATION_SERIES.map(series => series.year.toString());
    setAvailableYears(years);

    // Filtrer les données pour l'année sélectionnée et l'agent connecté
    const selectedSeries = ALL_DECLARATION_SERIES.find(series => series.year.toString() === selectedYear);
    if (selectedSeries) {
      const filteredData = selectedSeries.data.filter(item => item.agentId === CURRENT_USER.id);
      setChartData(filteredData.map(item => item.value));
    } else {
      setChartData([]);
    }
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const chartOptions = {
    chart: {
      stacked: false,
      zoom: { enabled: false },
      background: 'transparent',
      foreColor: isDarkMode ? theme.palette.text.primary : undefined,
    },
    colors: [isDarkMode ? theme.palette.primary.light : theme.palette.primary.main],
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      labels: {
        style: {
          colors: isDarkMode ? theme.palette.text.secondary : undefined,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? theme.palette.text.secondary : undefined,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} déclarations`,
      },
      theme: isDarkMode ? 'dark' : 'light',
    },
    grid: {
      borderColor: isDarkMode ? theme.palette.divider : undefined,
    },
    plotOptions: {
      area: {
        fillTo: 'end',
        opacity: isDarkMode ? 0.2 : 0.1,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.3,
        },
      },
    },
  };

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <Iconify icon="mdi:chart-line" width={24} sx={{ mr: 1 }} />
          Évolution des déclarations
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
          series={[{ name: 'Déclarations', data: chartData }]}
          options={chartOptions}
          height={320}
        />
      </Box>
    </Card>
  );
}