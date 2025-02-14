'use client';

import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Grid2 } from '@mui/material';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { sumBy } from 'src/utils/helper';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { DeclarationTableRow } from '../declaration-table-row';
import { DeclarationSummary } from '../declaration-analytic';
import { InvoiceTableToolbar } from '../declaration-table-toolbar';
import { InvoiceTableFiltersResult } from '../declaration-table-filters';
import axios from 'axios';
import API from 'src/utils/api';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Déclaration' },
  { id: 'Number', label: 'Nombre Personnel' },
  { id: 'createDate', label: 'Date de Création' },
  { id: 'price', label: 'Facture' },
  { id: 'status', label: 'Status' },

  { id: '' },
];

// ----------------------------------------------------------------------

export function DeclarationListView() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  const filters = useSetState({
    name: '',
    service: [],
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.service.length > 0 ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Toutes',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'submit',
      label: 'Soumise',
      color: 'warnning',
      count: getInvoiceLength('soumise'),
    },
    {
      value: 'success',
      label: 'Validées',
      color: 'success',
      count: getInvoiceLength('validée'),
    },
    {
      value: 'warning',
      label: 'Brouillon',
      color: 'warning',
      count: getInvoiceLength('brouillon'),
    },

    {
      value: 'reject',
      label: 'Rejetées',
      color: 'error',
      count: getInvoiceLength('rejetée'),
    },
  ];
  const handleDeleteRow = async (id) => {
    try {
      const response = await axios.delete(API.supprimerDeclaration(id));
      if (response.data.success) {
        console.log('Déclaration supprimée:', response.data.message);
        alert('Déclaration supprimée avec succès !');
      } else {
        console.error('Erreur lors de la suppression:', response.data.error);
        alert('Erreur : ' + response.data.error);
      }
    } catch (error) {
      console.error('Erreur réseau ou serveur:', error);
      alert('Une erreur est survenue lors de la communication avec le serveur.');
    }
  };

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Suppression reussie!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.declaration.edit(id));
    },
    [router]
  );

  const handleValidateRow = useCallback(
    async (id) => {
      try {
        // Appel à l'API backend pour valider la déclaration
        const response = await axios.post(API.validateDeclaration(id));

        if (response.data.success) {
          // Si succès, rediriger ou mettre à jour l'interface utilisateur
          console.log('Déclaration validée:', response.data.message);
          toast.success('declaration validée avec success !');
          router.push(paths.dashboard.declaration.list);
        } else {
          console.error('Erreur lors de la validation:', response.data.error);
          toast.error('Une erreur est survenue.');
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
        alert('Erreur lors de la communication avec le serveur.');
      }
    },
    [router]
  );

  const handleFacturer = useCallback(
    async (id) => {
      try {
        // Appel à l'API backend pour rejeter la déclaration
        const response = await axios.post(API.facturerDeclaration(id));
        if (response.data.success) {
          // Si succès, rediriger ou mettre à jour l'interface utilisateur
          console.log('Déclaration facturée:', response.data.message);
          toast.success('Déclaration facturée avec succès !');
          router.push(paths.dashboard.factures.list);
        } else {
          console.error('Erreur lors de la facturation:', response.data.error);
          toast.error('Une erreur est survenue.');
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
        toast.error('Erreur lors de la communication avec le serveur.');
      }
    },
    [router]
  );

  const handleRejetter = useCallback(
    async (id) => {
      try {
        // Appel à l'API backend pour rejeter la déclaration
        const response = await axios.post(API.rejetterDeclaration(id));
        if (response.data.success) {
          // Si succès, rediriger ou mettre à jour l'interface utilisateur
          console.log('Déclaration rejetée:', response.data.message);
          toast.success('Déclaration rejetée avec succès !');
          router.push(paths.dashboard.declaration.list);
        } else {
          console.error('Erreur lors du rejet :', response.data.error);
          toast.error('Une erreur est survenue.');
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
        toast.error('Erreur lors de la communication avec le serveur.');
      }
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.declaration.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    // Fonction pour récupérer les données
    const fetchDeclarations = async () => {
      try {
        const response = await axios.get(API.listDeclarations());
        setTableData(response.data); // Assurez-vous que votre API renvoie un tableau
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, []); // La dépendance vide signifie que cette fonction est appelée une fois au montage

  if (loading) {
    console.info('Loading declarations...');
  }

  if (error) {
    console.error('Error: ' + error);
  }

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Listes des Déclarations"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Déclaration', href: paths.dashboard.declaration.root },
            { name: 'Listes des déclarations' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.declaration.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nouvelle Déclaration
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Grid2 container spacing={3} sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <DeclarationSummary
              title="Total"
              total={tableData.length}
              percent={100}
              chart={{
                colors: [theme.vars.palette.info.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [20, 41, 63, 33, 28, 35, 50, 46],
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <DeclarationSummary
              title="Facturée"
              total={getInvoiceLength('facturée')}
              percent={getPercentByStatus('facturée')}
              chart={{
                // colors: [theme.vars.palette.success.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [15, 18, 12, 51, 68, 11, 39, 37],
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 6, md: 3 }}>
            <DeclarationSummary
              title="En attente"
              total={getInvoiceLength('pending')}
              percent={getPercentByStatus('pending')}
              chart={{
                colors: [theme.vars.palette.warning.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <DeclarationSummary
              title="Brouillon"
              total={getInvoiceLength('brouillon')}
              percent={getPercentByStatus('draft')}
              chart={{
                colors: [theme.vars.palette.error.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
            />
          </Grid2>
        </Grid2>

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: INVOICE_SERVICE_OPTIONS.map((option) => option.name) }}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Facturer">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Telecharger">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Imprimer">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Supprimer">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <DeclarationTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onValidateRow={() => handleValidateRow(row.id)}
                        onFactureRow={() => handleFacturer(row.id)}
                        onRejetRow={() => handleRejetter(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Etes vous sûr de vouloir supprimer <strong> {table.selected.length} </strong>{' '}
            declarations?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => fIsBetween(invoice.createDate, startDate, endDate));
    }
  }

  return inputData;
}
