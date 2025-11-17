'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { DeclarationNew } from '../analytics/declaration/declaration-new-invoice';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import API from 'src/utils/api';
import { useSetState } from 'src/hooks/use-set-state';
import { DeclarationreportFilters } from './components/declaration-filters';
import { DecReportToolbar } from './components/declaration-table-toolbar';
import { fIsBetween } from 'src/utils/format-time';
import { ExportDialog } from './components/export-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { exportToPDF, exportToCSV, exportToExcel, exportToZip } from 'src/utils/export-helpers';
import { toast } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import { fDate } from 'src/utils/format-time';
import dayjs from 'dayjs';

export function RapportDeclaration() {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [count, setCount] = useState(0);
  const [isDeclaration, setIsDeclaration] = useState(true);
  const exportDialog = useBoolean();

  const table = useTable({ defaultOrderBy: 'created_on' });

  const filters = useSetState({
    number: '',
    company: '',
    status: 'all',
    created_on_before: null,
    created_on_after: null,
  });

  const dateError = fIsBetween(filters.state.created_on_before, filters.state.created_on_after);

  // Fonction pour construire les paramètres
  const buildParams = (page = 0, limit = table.rowsPerPage) => {
    const params = {
      limit,
      offset: page * limit,
    };

    // Ajouter les filtres seulement s'ils sont définis
    if (filters.state.number) {
      params.number = filters.state.number;
    }
    if (filters.state.company) {
      params.company = filters.state.company;
    }
    if (filters.state.status !== 'all') {
      params.status = filters.state.status;
    }

    if (filters.state.created_on_before && !dateError) {
      params.created_on_before = dayjs(filters.state.created_on_before).format('YYYY-MM-DD');
    }
    if (filters.state.created_on_after && !dateError) {
      params.created_on_after = dayjs(filters.state.created_on_after).format('YYYY-MM-DD');
    }

    return params;
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = buildParams(table.page);
      const resp = await axios.get(API.reportsDeclaration(), { params });
      const data = resp?.data.results || [];

      setDeclarations(data);
      setCount(resp?.data.count || 0);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Erreur lors du chargement';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer TOUTES les données pour l'export
  const fetchAllDataForExport = async () => {
    try {
      const allData = [];
      let page = 0;
      const limit = count; // Taille de page pour l'export
      let hasMore = true;

      while (hasMore) {
        const params = buildParams(page, limit);
        const resp = await axios.get(API.reportsDeclaration(), { params });
        const data = resp?.data.results || [];

        allData.push(...data);

        // Vérifier s'il y a encore des données
        if (data.length < limit || allData.length >= (resp?.data.count || 0)) {
          hasMore = false;
        } else {
          page++;
        }
      }

      return allData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données pour export:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReport();
  }, [
    table.page,
    table.rowsPerPage,
    filters.state.number,
    filters.state.company,
    filters.state.status,
    filters.state.created_on_before,
    filters.state.created_on_after,
  ]);

  const canReset =
    !!filters.state.number ||
    !!filters.state.company ||
    filters.state.status !== 'all' ||
    (!!filters.state.created_on_before && !!filters.state.created_on_after);

  const notFound = !loading && declarations.length === 0 && canReset;

  // Fonction pour exporter toutes les données avec les filtres
  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      // Récupérer TOUTES les données avec les mêmes filtres
      const exportData = await fetchAllDataForExport();

      if (exportData.length === 0) {
        toast.error('Aucune donnée à exporter avec les filtres actuels');
        return;
      }

      switch (format) {
        case 'pdf':
          await exportToPDF(exportData, 'rapport-declarations.pdf');
          break;
        case 'csv':
          exportToCSV(exportData, 'rapport-declarations.csv');
          break;
        case 'excel':
          exportToExcel(exportData, 'rapport-declarations.xlsx');
          break;
        case 'zip':
          await exportToZip(exportData, 'rapport-declarations.zip');
          break;
        default:
          console.error('Format non supporté');
      }

      exportDialog.onFalse();
      toast.success(`Export réussi: ${exportData.length} déclarations exportées`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      const errorMessage =
        error?.response?.data?.error || error?.message || "Erreur lors de l'export";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const statusOptions = [
    { value: 'submitted', label: 'Soumise' },
    { value: 'validated', label: 'Validée' },
    { value: 'rejected', label: 'Rejetée' },
    { value: 'billed', label: 'Facturée' },
    { value: 'unsubmitted', label: 'Non soumise' },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Rapport des déclarations"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Rapports' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={exportDialog.onTrue}
            disabled={count === 0}
          >
            Exporter
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DecReportToolbar
        filters={filters}
        dateError={dateError}
        options={{ status: statusOptions }}
        isDeclaration={isDeclaration}
      />

      {canReset && (
        <DeclarationreportFilters
          filters={filters}
          totalResults={count}
          sx={{ p: 2.5, pt: 0 }}
          isDeclaration={isDeclaration}
        />
      )}

      <Grid2 size={{ xs: 12, md: 12 }}>
        <DeclarationNew
          title="Rapports des déclarations"
          tableData={declarations}
          totalCount={count}
          loading={loading}
          table={table}
          notFound={notFound}
          headLabel={[
            { id: 'number', label: 'Numéro' },
            { id: 'company', label: 'Entreprise' },
            { id: 'nber_employees', label: 'Employés' },
            { id: 'created_on', label: 'Date de Création' },
            { id: 'status', label: 'Statut' },
          ]}
        />
      </Grid2>

      <ExportDialog
        open={exportDialog.value}
        onClose={exportDialog.onFalse}
        onExport={handleExport}
        isExporting={isExporting}
        totalItems={count}
      />
    </DashboardContent>
  );
}
