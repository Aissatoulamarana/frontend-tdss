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
import { label } from 'yet-another-react-lightbox';
import { translate } from 'pdf-lib';

export function ReportPermit() {
  const [permits, setPermits] = useState([]);
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
    job: '',
    name: '',
    nationality: '',
    sexe: '',
    permit_type: 'all',
  });

  const dateError = fIsBetween(filters.state.startDate, filters.state.endDate);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        offset,
        limit: 100,
      };
      const resp = await axios.get(API.reportsPermits());
      const newData = resp?.data || [];

      if (newData.length < 100) {
        setHasMore(false);
      }
      setPermits(newData);
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
    inputData: permits,
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
    processing: 'En traitement',
    submitted: 'Soumis',
    validated: 'Validé',
    rejected: 'Rejeté',
    printed: 'Imprimé',
    delivered: 'Délivré',
  };

  const SEXE_TRANSLATIONS = {
    male: 'Homme',
    female: 'Femme',
  };

  const columns = [
    { key: 'reference', label: 'Reference' },
    { key: 'card_number', label: 'N Carte' },
    { key: 'passport_number', label: 'Passeport' },
    { key: 'first', label: 'Prénom' },
    { key: 'last', label: 'Nom' },
    { key: 'nationality', label: 'Nationalité' },
    { key: 'sexe', label: 'Sexe', translate: SEXE_TRANSLATIONS },
    { key: 'company', label: 'Entreprise' },
    { key: 'job', label: 'Fonction' },
    { key: 'permit_type', label: 'Permis' },
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

  const statusOptions = Array.from(new Set(permits.map((d) => d?.status).filter(Boolean))).map(
    (s) => ({ value: s, label: STATUS_TRANSLATIONS[s] || s })
  );

  const sexeOptions = Array.from(new Set(permits.map((d) => d?.sexe).filter(Boolean))).map((s) => ({
    value: s,
    label: SEXE_TRANSLATIONS[s] || s,
  }));

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Rapport des permits"
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
        sexeOptions={sexeOptions}
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
          title="Rapports des permits"
          tableData={paginatedData}
          totalCount={dataFiltered.length}
          loading={loading}
          table={table}
          notFound={notFound}
          headLabel={[
            { id: 'reference', label: 'Reference' },
            { id: 'card_number', label: 'N Carte' },
            { id: 'passport_number', label: 'Passeport' },
            { id: 'first', label: 'Prénom' },
            { id: 'last', label: 'Nom' },
            { id: 'nationality', label: 'Nationalité' },
            { id: 'sexe', label: 'Sexe' },
            { id: 'company', label: 'Entreprise' },
            { id: 'job', label: 'Fonction' },
            { id: 'permit_type', label: 'Permis' },
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
  const { name, number, company, status, startDate, endDate, sexe, job, permit_type, nationality } =
    filters;

  let filteredData = [...inputData];

  // Filtrage par numéro
  if (number) {
    filteredData = filteredData.filter(
      (permit) =>
        permit?.reference?.toLowerCase().includes(number.toLowerCase()) ||
        permit?.card_number?.toLowerCase().includes(number.toLowerCase()) ||
        permit?.passport_number?.toLowerCase().includes(number.toLowerCase())
    );
  }

  // filtrage par nom
  if (name) {
    const lowerName = name.toLowerCase();
    filteredData = filteredData?.filter(
      (permit) =>
        (permit?.last && permit.last.toLowerCase().includes(lowerName)) ||
        (permit?.first && permit.first.toLowerCase().includes(lowerName))
    );
  }

  // Filtrage par entreprise
  if (company) {
    filteredData = filteredData.filter((permit) =>
      permit?.client?.toLowerCase().includes(company?.toLowerCase())
    );
  }

  // filtrage par fonction
  if (job) {
    filteredData = filteredData.filter((permit) =>
      permit?.job?.toLowerCase().includes(job?.toLowerCase())
    );
  }

  //filtrage par nationalité
  if (nationality) {
    filteredData = filteredData.filter((permit) =>
      permit?.nationality?.toLowerCase().includes(nationality?.toLowerCase())
    );
  }

  //filtrage par type de permis
  if (permit_type !== 'all') {
    filteredData = filteredData.filter((permit) => permit?.permit_type === permit_type);
  }

  // Filtrage par statut
  if (status !== 'all') {
    filteredData = filteredData.filter((permit) => permit?.status === status);
  }

  //filtrage par sexe
  if (sexe !== 'all') {
    filteredData = filteredData.filter((permit) => permit?.sexe === sexe);
  }

  // Filtrage par date
  const sDate = startDate instanceof Date ? startDate : startDate ? new Date(startDate) : null;
  const eDate = endDate instanceof Date ? endDate : endDate ? new Date(endDate) : null;
  if (!dateError && sDate && eDate) {
    filteredData = filteredData.filter((permit) => {
      // Parser created_on en Date (gère le format ISO avec Z)
      const created = permit?.created_on ? new Date(permit.created_on) : null;
      if (!created || isNaN(created)) return false; // ignore si date invalide côté back
      // Utilise ta fonction utilitaire fIsBetween si elle accepte Dates
      return fIsBetween(created, sDate, eDate);
    });
  }

  return filteredData;
}
