'use client';

import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';
import { sumBy } from 'src/utils/helper';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
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

import { STORAGE_KEY } from 'src/auth/context/jwt/constant'

import { FactureAnalytic } from '../factures-analytics';
import { FactureTableFilters } from '../factures-table-filters';
import { FactureTableRow } from '../factures-table-row';
import { FactureTableToolbar } from '../factures-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'facture', label: 'Numero Facture' },
  { id: 'numero', label: 'Numero Déclaration' },

  { id: 'price', label: 'Montant' },
  { id: 'createDate', label: 'Date ' },
  { id: 'statut', label: 'Statut' },

  { id: '' },
];

// ----------------------------------------------------------------------

export function FactureListView() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();
  const [options, setOptions] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [selectedBanque, setSelectedBanque] = useState(null); // Etat pour la banque sélectionnée

  const filters = useSetState({
    name: '',
    service: [],
    statut: 'all',
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
    filters.state.statut !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (statut) => tableData.filter((item) => item.statut === statut).length;

  const getTotalAmount = (statut) =>
    sumBy(
      tableData.filter((item) => item.statut === statut),
      (facture) => facture.montant
    );

  const getPercentByStatus = (statut) => (getInvoiceLength(statut) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Toutes',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'paid',
      label: 'Payées',
      color: 'success',
      count: getInvoiceLength('paid'),
    },
    {
      value: 'En attente',
      label: 'En attente',
      color: 'warning',
      count: getInvoiceLength('En attente'),
    },
  ];

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Suppression reussie!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

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
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.factures.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ statut: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    console.log('ID de la banque sélectionnée dans l\'enfant:', selectedBanque?.value);
  }, [selectedBanque]);


  const handlePaidRow = useCallback(
    async (id) => {
      if (!selectedBanque) {
        toast.error("Veuillez sélectionner une banque avant de valider le paiement.");
        return;
      }

      const access_token = sessionStorage.getItem(STORAGE_KEY);
      const data = {
        banque_id: selectedBanque?.value
      }
      console.log("Données envoyées:", data);
      console.log("Token d'accès:", access_token);

      try {
        // Appel à l'API backend pour valider la déclaration
        const response = await axios.post(API.paidFacture(id), data, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}` // 🔥 Envoi du token
          },

        });

        if (response.data.success) {
          console.log('Facture payée:', response.data.message);
          toast.success('Facture payée avec succès !');
          router.push(paths.dashboard.factures.list);
        } else {
          console.error('Erreur lors du paiement:', response.data.error);
          toast.error('Une erreur est survenue.');
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
        alert('Erreur lors de la communication avec le serveur.');
      }
    },
    [router, selectedBanque] // S'assurer de la dépendance à selectedBanque
  );



  useEffect(() => {
    const fetchBank = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.listBank());
        const banks = response.data.map((bank) => ({
          value: bank.id,
          label: bank.name,
        }));
        console.log(banks);
        setOptions(banks);
      } catch (error) {
        console.error('Erreur lors de la récupération des banques :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBank();
  }, []);

  useEffect(() => {
    // Fonction pour récupérer les données
    const fetchFactures = async () => {
      try {
        const response = await axios.get(API.listFactures()); // Remplacez l'URL par celle de votre backend
        setTableData(response.data); // Assurez-vous que votre API renvoie un tableau
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []); // La dépendance vide signifie que cette fonction est appelée une fois au montage

  if (loading) {
    console.info('Loading factures...');
  }

  if (error) {
    console.error(`Error: ${  error}`);
  }

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Listes des Factures"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Factures', href: paths.dashboard.factures.root },
            { name: 'Listes des factures' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Stack spacing={4}>
          <Grid2 container spacing={3} sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FactureAnalytic
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
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FactureAnalytic
                title="Payées"
                percent={2.6}
                total={18765}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [15, 18, 12, 51, 68, 11, 39, 37],
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 4 }}>
              <FactureAnalytic
                title="En attente"
                percent={2.6}
                total={18765}
                chart={{
                  colors: [theme.vars.palette.error.main],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [18, 19, 31, 8, 16, 37, 12, 33],
                }}
              />
            </Grid2>
          </Grid2>
        </Stack>

        <Card sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
          <Tabs
            value={filters?.state?.statut || []}
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
                      ((tab.value === 'all' || tab.value === filters.state.statut) && 'filled') ||
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

          <FactureTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: INVOICE_SERVICE_OPTIONS.map((option) => option.name) }}
          />

          {canReset && (
            <FactureTableFilters
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }} lg={12}>
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
                  <Tooltip title="Envoyer">
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

                  <Tooltip title="Payer">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="mdi:credit-card" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444, minWidth: 1000 }}>
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
                      <FactureTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onPaidRow={() => handlePaidRow(row.id)}
                        Options={options}
                        setOptions={setOptions}
                        selectedBanque={selectedBanque}
                        setSelectedBanque={setSelectedBanque}
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
        title="Payer"
        content={
          <>
            Etes vous sûr de vouloir payer <strong> {table.selected.length} </strong> factures?
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDeleteRows();
              confirm.onTrue();
            }}
          >
            Payer
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, statut, service, startDate, endDate } = filters;

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

  if (statut !== 'all') {
    inputData = inputData.filter((facture) => facture.statut === statut);
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