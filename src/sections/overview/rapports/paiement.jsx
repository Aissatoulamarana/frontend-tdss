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
import { exportToCSVM, exportToExcelM, exportToZipM, exportToPDFM } from 'src/utils/export-helpers';
import { toast } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import { fDate } from 'src/utils/format-time';

export function ReportPaiement() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const exportDialog = useBoolean();

  const table = useTable({ defaultOrderBy: 'created_on' });

  const filters = useSetState({
    number: '',
    company: '',
    status: 'all',
    paymentMethod: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsBetween(filters.state.startDate, filters.state.endDate);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        offset,
        limit: 100,
      };
      const resp = await axios.get(API.reportsPaiement());
      const newData = resp?.data || [];

      if (newData.length < 100) {
        setHasMore(false);
      }
      setPaiements(newData);
      setOffset((prev) => prev + 100);
    } catch (error) {
      console.log(error);
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      toast.error(errors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const dataFiltered = applyFilter({
    inputData: paiements,
    filters: filters.state,
    dateError,
  });

  const startIndex = table.page * table.rowsPerPage;
  const endIndex = startIndex + table.rowsPerPage;
  const paginatedData = dataFiltered.slice(startIndex, endIndex);

  const canReset =
    !!filters.state.number ||
    !!filters.state.company ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = !dataFiltered.length && canReset;

  const STATUS_TRANSLATIONS = {
    pending: 'En  attente',
    validated: 'Validé',
  };

  const PAYMENT_METHOD = {
    transfer: 'Virement',
    cheque: 'Chèque',
    deposit: 'Dépôts',
  };

  const columns = [
    { key: 'number', label: 'Numéro' },
    { key: 'client', label: 'Entreprise' },
    { key: 'nber_factures', label: 'Factures' },
    { key: 'payment_method', label: 'Méthode de Paiement', translate: PAYMENT_METHOD },
    { key: 'amount', label: 'Montant', isCurrency: true },
    { key: 'created_on', label: 'Date de Création', isDate: true },
    { key: 'status', label: 'Statut', translate: STATUS_TRANSLATIONS },
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const exportData = dataFiltered;

      switch (format) {
        case 'pdf':
          await exportToPDFM(exportData, columns, 'paiemnts.pdf');
          break;
        case 'csv':
          exportToCSVM(exportData, columns, 'rapport-paiements.csv');
          break;
        case 'excel':
          exportToExcelM(exportData, columns, 'rapport-paiements.xlsx');
          break;
        case 'zip':
          await exportToZipM(exportData, columns, 'rapport-paiements.zip');
          break;
        default:
          console.error('Format non supporté');
      }

      exportDialog.onFalse();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur lors de l'export. Vérifiez la console pour plus de détails.");
    } finally {
      setIsExporting(false);
    }
  };

  const statusOptions = Array.from(new Set(paiements.map((d) => d?.status).filter(Boolean))).map(
    (s) => ({ value: s, label: STATUS_TRANSLATIONS[s] || s })
  );

  const paymentOptions = Array.from(
    new Set(paiements.map((d) => d?.payment_method).filter(Boolean))
  ).map((s) => ({ value: s, label: PAYMENT_METHOD[s] || s }));

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Rapport des paiements"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Rapports' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={exportDialog.onTrue}
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
        paymentOptions={paymentOptions}
      />

      {canReset && (
        <DeclarationreportFilters
          filters={filters}
          totalResults={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Grid2 size={{ xs: 12, md: 12 }}>
        <DeclarationNew
          title="Rapports des paiemnts"
          tableData={paginatedData}
          totalCount={dataFiltered.length}
          loading={loading}
          table={table}
          notFound={notFound}
          headLabel={[
            { id: 'number', label: 'Numéro' },
            { id: 'client', label: 'Entreprise' },
            { id: 'nber_factures', label: 'Factures' },
            { id: 'payment_method', label: 'Méthode de Paiement' },
            { id: 'amount', label: 'Montant' },
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
      />
    </DashboardContent>
  );
}

function applyFilter({ inputData, filters, dateError }) {
  const { number, company, status, startDate, endDate, paymentMethod } = filters;

  let filteredData = [...inputData];

  // Filtrage par numéro
  if (number) {
    filteredData = filteredData.filter((paiement) =>
      paiement?.number?.toLowerCase().includes(number.toLowerCase())
    );
  }

  // Filtrage par entreprise
  if (company) {
    filteredData = filteredData.filter((paiement) =>
      paiement?.client?.toLowerCase().includes(company?.toLowerCase())
    );
  }

  // Filtrage par statut
  if (status !== 'all') {
    filteredData = filteredData.filter((paiement) => paiement?.status === status);
  }

  //filtrage par methode de paiement
  if (paymentMethod !== 'all') {
    filteredData = filteredData.filter((paiement) => paiement?.payment_method === paymentMethod);
  }

  // Filtrage par date
  const sDate = startDate instanceof Date ? startDate : startDate ? new Date(startDate) : null;
  const eDate = endDate instanceof Date ? endDate : endDate ? new Date(endDate) : null;
  if (!dateError && sDate && eDate) {
    filteredData = filteredData.filter((paiement) => {
      // Parser created_on en Date (gère le format ISO avec Z)
      const created = paiement?.created_on ? new Date(paiement.created_on) : null;
      if (!created || isNaN(created)) return false; // ignore si date invalide côté back
      // Utilise ta fonction utilitaire fIsBetween si elle accepte Dates
      return fIsBetween(created, sDate, eDate);
    });
  }

  return filteredData;
}
