import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { AgentWidgetSummary, getAgentSummaryData } from './AgentWidgetSummary';
import { AgentPermitCategoryChart, AgentDeclarationChart } from './AgentCharts';
import { AgentRecentDeclarations, AgentRecentEmployees } from './AgentTables';
import { AgentActionButton } from './AgentActionButton';

// ----------------------------------------------------------------------

// Contexte utilisateur simulé (à remplacer par un vrai contexte d'authentification)
const CURRENT_USER = {
  id: 'AGENT-001',
  name: 'Jean Dupont',
  company: 'Entreprise ABC',
  role: 'agent',
};

// Obtenir la liste des entreprises de l'agent
const AGENT_COMPANIES = [
  'Entreprise ABC',
  'Société XYZ',
];

// ----------------------------------------------------------------------

export default function AgentDashboard() {
  const [companyFilter, setCompanyFilter] = useState('all');
  
  // Données des widgets de résumé filtrées par agent et entreprise
  const totalEmployees = getAgentSummaryData('totalEmployees', companyFilter);
  const totalPayments = getAgentSummaryData('totalPayments', companyFilter);
  const pendingPayments = getAgentSummaryData('pendingPayments', companyFilter);
  const totalInvoices = getAgentSummaryData('totalInvoices', companyFilter);

  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4">Tableau de Bord Agent</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="company-filter-label">Entreprise</InputLabel>
            <Select
              labelId="company-filter-label"
              value={companyFilter}
              label="Entreprise"
              onChange={handleCompanyFilterChange}
            >
              <MenuItem value="all">Toutes mes entreprises</MenuItem>
              {AGENT_COMPANIES.map(company => (
                <MenuItem key={company} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <AgentActionButton />
        </Box>
      </Box>

      {/* Widgets de résumé */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AgentWidgetSummary
            title="Employés déclarés"
            total={totalEmployees}
            color="primary"
            icon={<Iconify icon="mdi:account-group" width={36} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AgentWidgetSummary
            title="Total Paiement"
            total={totalPayments}
            color="info"
            icon={<Iconify icon="mdi:cash-multiple" width={36} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AgentWidgetSummary
            title="En attente de paiement"
            total={pendingPayments}
            color="warning"
            icon={<Iconify icon="mdi:clock-time-four" width={36} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AgentWidgetSummary
            title="Total Factures"
            total={totalInvoices}
            color="error"
            icon={<Iconify icon="mdi:file-document" width={36} />}
          />
        </Grid>

        {/* Graphiques */}
        <Grid item xs={12} md={6} lg={4}>
          <AgentPermitCategoryChart />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AgentDeclarationChart />
        </Grid>

        {/* Tableaux de données */}
        <Grid item xs={12} md={6} lg={8}>
          <AgentRecentDeclarations />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AgentRecentEmployees />
        </Grid>
      </Grid>
    </Container>
  );
}