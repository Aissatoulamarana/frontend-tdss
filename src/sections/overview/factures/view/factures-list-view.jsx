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
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'src/utils/axios';
import { CircularProgress } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Typography from '@mui/material/Typography';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import TextField from '@mui/material/TextField';
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
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { FactureAnalytic } from '../factures-analytics';
import { FactureTableFilters } from '../factures-table-filters';
import { FactureTableRow } from '../factures-table-row';
import { FactureTableToolbar } from '../factures-table-toolbar';
import { PayeurForm } from '../form-factures';

import { useMockedUser } from 'src/auth/hooks';
import dayjs from 'dayjs';

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

/**
 * @typedef {{ totalCount: number; countByStatus: Record<string, number> }} Summary
 */

// ----------------------------------------------------------------------

export function FactureListView() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'created_on' });

  const confirm = useBoolean();
  const [options, setOptions] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [selectedBanque, setSelectedBanque] = useState(null); // Etat pour la banque sélectionnée
  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  /** @type {[Summary, Function]} */
  const [summary, setSummary] = useState({ totalCount: 0, countByStatus: {} });
  // …

  const filters = useSetState({
    number: '',
    declaration_number: '',
    service: [],
    status: 'all',
    date_before: null,
    date_after: null,
  });

  const dateError = fIsAfter(filters.state.date_before, filters.state.date_after);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.number ||
    !!filters.state.declaration_number ||
    filters.state.service.length > 0 ||
    filters.state.status !== 'all' ||
    (!!filters.state.date_before && !!filters.state.date_after);

  const notFound = pagination.count === 0 && canReset;

  const fetchTotalCount = () =>
    axios.get(API.listFactures(), { params: { limit: 1 } }).then((res) => res.data.count);

  const fetchCount = (status) =>
    axios.get(API.listFactures(), { params: { limit: 1, status } }).then((res) => res.data.count);

  useEffect(() => {
    Promise.all([fetchTotalCount(), fetchCount('paid'), fetchCount('unpaid')]).then(
      ([totalCount, paidCount, unpaidCount]) => {
        setSummary({
          totalCount,
          countByStatus: { all: totalCount, paid: paidCount, unpaid: unpaidCount },
        });
      }
    );
  }, []);

  const getInvoiceLength = (status) => summary.countByStatus[status];

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (facture) => facture.amount
    );

  const getPercentByStatus = (status) =>
    summary.totalCount > 0 ? (getInvoiceLength(status) / summary.totalCount) * 100 : 0;

  const TABS = [
    {
      value: 'all',
      label: 'Toutes',
      color: 'white',
      count: summary.totalCount,
    },
    {
      value: 'paid',
      label: 'Payées',
      color: 'success',
      count: getInvoiceLength('paid'),
    },
    {
      value: 'unpaid',
      label: 'En attente',
      color: 'warning',
      count: getInvoiceLength('unpaid'),
    },
  ];

  const handleDeleteRow = useCallback(
    (slug) => {
      const deleteRow = tableData.filter((row) => row.slug !== slug);

      toast.success('Suppression reussie!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.slug));

    toast.success('Suppression reussie!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.factures.details(slug));
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

  useEffect(() => {}, [selectedBanque]);

  const handlePaidRow = useCallback(
    async (slug) => {
      // if (!selectedBanque) {
      //   toast.error("Veuillez sélectionner une banque avant de valider le paiement.");
      //   return;
      // }

      try {
        // Appel à l'API backend pour valider la déclaration
        const response = await axios.post(API.paidFacture(slug));

        if (response.data.success) {
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
    [router] // S'assurer de la dépendance à selectedBanque
  );

  // const handlePaid = useCallback(
  //   async (slug) => {
  //     if (!selectedBanque) {
  //       toast.error("Veuillez sélectionner une banque avant de valider le paiement.");
  //       return;
  //     }

  //     const data = {
  //       banque_id: selectedBanque?.value,
  //       facture_ids: dataFiltered.map((row) => row.slug)
  //     }

  //     try {
  //       // Appel à l'API backend pour valider la déclaration
  //       const response = await axios.post(API.PaidFactures(), data);

  //       if (response.data.success) {
  //         toast.success('Factures payées avec succès !');
  //         router.push(paths.dashboard.factures.list);
  //       } else {
  //         console.error('Erreur lors du paiement:', response.data.error);
  //         toast.error('Une erreur est survenue.');
  //       }
  //     } catch (error) {
  //       console.error('Erreur réseau ou serveur:', error);
  //       alert('Erreur lors de la communication avec le serveur.');
  //     }
  //   },
  //   [router, selectedBanque] // S'assurer de la dépendance à selectedBanque
  // );

  const handleChangeBanque = (event, newValue) => {
    setSelectedBanque(newValue);
  };

  useEffect(() => {
    // Fonction pour récupérer les données
    const fetchFactures = async () => {
      try {
        setLoading(true); // Démarre le chargement
        const offset = table.page * table.rowsPerPage;
        const params = {
          limit: table.rowsPerPage,
          offset: offset,
          ...(filters.state.status !== 'all' ? { status: filters.state.status } : {}),
          ...(filters.state.number ? { number: filters.state.number } : {}),
          ...(filters.state.declaration_number
            ? { declaration_number: filters.state.declaration_number }
            : {}),
          ...(filters.state.date_before && filters.state.date_after && !dateError
            ? {
                date_before: dayjs(filters.state.date_before).format('YYYY-MM-DD '),
                date_after: dayjs(filters.state.date_after).format('YYYY-MM-DD '),
              }
            : {}),
        };
        const response = await axios.get(API.listFactures(), { params }); // Remplacez l'URL par celle de votre backend
        setTableData(response.data.results); // Assurez-vous que votre API renvoie un tableau
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
      } catch (err) {
        setError(
          err.message || err.details || err.error || 'Erreur lors du chargement des données.'
        );
        toast(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, [
    table.page,
    table.rowsPerPage,
    filters.state.status,
    filters.state.date_before,
    filters.state.date_after,
    filters.state.number,
    filters.state.declaration_number,
  ]); // La dépendance vide signifie que cette fonction est appelée une fois au montage

  if (loading) {
    console.info('Loading factures...');
  }

  if (error) {
    console.error(`Error: ${error}`);
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

        {/* <Stack spacing={4}> */}
        <Grid2 container spacing={3} sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FactureAnalytic
              title="Total"
              total={summary.totalCount}
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
              percent={getPercentByStatus('paid')}
              total={getInvoiceLength('paid')}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [15, 18, 12, 51, 68, 11, 39, 37],
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <FactureAnalytic
              title="En attente"
              percent={getPercentByStatus('unpaid')}
              total={getInvoiceLength('unpaid')}
              chart={{
                colors: [theme.vars.palette.error.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
            />
          </Grid2>
        </Grid2>
        {/* </Stack> */}

        <Card sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
          <Tabs
            value={filters?.state?.status || []}
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

          <FactureTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: tableData.map((option) => option.name) }}
          />

          {canReset && (
            <FactureTableFilters
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={pagination.count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }} lg={12}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={pagination.count}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.slug)
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
                    <IconButton
                      color="primary"
                      onClick={() => {
                        confirm.onTrue();
                        // Ouvre la première boîte de dialogue
                      }}
                    >
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
                  rowCount={pagination.count}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.slug)
                    )
                  }
                />
                {loading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={100}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 6,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {tableData.map((row) => (
                      <FactureTableRow
                        key={row.slug}
                        user={user}
                        row={row}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={() => table.onSelectRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                        // onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.slug)}
                        onPaidRow={() => handlePaidRow(row.slug)}
                        Options={options}
                        setOptions={setOptions}
                        selectedBanque={selectedBanque}
                        setSelectedBanque={setSelectedBanque}
                      />
                    ))}

                    {tableData.length > 0 && tableData.length < table.rowsPerPage && (
                      <TableEmptyRows
                        height={table.dense ? 56 : 76}
                        emptyRows={table.rowsPerPage - tableData.length}
                      />
                    )}

                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={pagination.count}
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
              confirm.onTrue();

              setOpenFirstDialog(true); // Ouvre la première boîte de dialogue
            }}
          >
            Suivant
          </Button>
        }
      />
      <ConfirmDialog
        fullWidth
        open={openFirstDialog}
        onClose={() => setOpenFirstDialog(false)} // Ferme la première boîte de dialogue
        title="Payer"
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography sx={{ mb: 2 }}>
              Sélectionnez la banque avec laquelle vous voulez payer cette facture
            </Typography>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              loading={loading}
              value={selectedBanque}
              onChange={handleChangeBanque}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rechercher ou sélectionner une banque"
                  placeholder="Taper pour rechercher"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
              sx={{ width: '100%' }}
            />
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="success"
            disabled={!selectedBanque}
            onClick={() => {
              setOpenFirstDialog(false); // Ferme la première boîte de dialogue
              setOpenSecondDialog(true); // Ouvre la deuxième boîte de dialogue
            }}
          >
            Suivant
          </Button>
        }
      />
      <ConfirmDialog
        open={openSecondDialog}
        onClose={() => setOpenSecondDialog(false)} // Ferme la deuxième boîte de dialogue
        title="Veuillez fournir les informations suivantes"
        content={<PayeurForm id={dataFiltered.map((row) => row.slug)} />}
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setOpenSecondDialog(false); // Ferme la deuxième boîte de dialogue
              handlePaid(); // Action pour "Payer"
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
      (facture) =>
        facture.numero.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        facture.declaration_ref.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((facture) => facture.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((facture) => fIsBetween(facture.created_at, startDate, endDate));
    }
  }

  return inputData;
}
