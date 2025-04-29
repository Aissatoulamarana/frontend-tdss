'use client';

import  Grid  from '@mui/material/Grid2';
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
import axios from 'src/utils/axios';
import { useState, useEffect, useCallback } from 'react';

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

import { PaiementAnalytic } from '../paiement-analytic';
import { PaiementTableFiltersResult } from '../paiement-table-filters';
import { PaiementTableRow } from '../paiement-table-row';
import { PaiementTableToolbar } from '../paiement-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id:'reference', label: 'Reference Paiement'},
  { id: 'invoiceNumber', label: 'Numero Facture' },
  // { id: 'numero', label: 'Numero Déclaration' },
  { id: 'type', label: 'Methode de Paiement' },
  { id: 'status', label: 'Entreprise' },
  { id: 'price', label: 'Montant' },
  { id: 'createDate', label: 'Date ' },

  { id: '' },
];

// ----------------------------------------------------------------------

export function PaiementListView() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
    const [pagination, setPagination] = useState({
      count: 0,
      next: null,
      previous: null,
    });

  const filters = useSetState({
    name: '',
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
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = pagination.count === 0 && canReset;

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

  ];

  
  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.paiements.details(slug));
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
    const fetchFactures = async () => {
      try {
        const offset = table.page * table.rowsPerPage;
        const limit = table.rowsPerPage;
        const params = {
          offset, limit}
        const response = await axios.get(API.listPaiments(), {params}); // Remplacez l'URL par celle de votre backend
        setTableData(response.data.results); // Assurez-vous que votre API renvoie un tableau
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        })
      } catch (err) {
        setError(err.message || err.details || err.error || 'Erreur lors du chargement des données.');
        toast.error(error)
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, [table.page, table.rowsPerPage]); // La dépendance vide signifie que cette fonction est appelée une fois au montage

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
          heading="Listes des Paiements"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Paiements', href: paths.dashboard.paiements.list },
            { name: 'Listes des paiements' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* <Stack spacing={4}> */}
          <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
            <Grid size={{ xs: 6, md: 4 }}>
              <PaiementAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                chart={{
                  colors: [theme.vars.palette.info.main],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [20, 41, 63, 33, 28, 35, 50, 46],
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <PaiementAnalytic
                title="Total En Dollars"
                percent={2.6}
                total={18765}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [15, 18, 12, 51, 68, 11, 39, 37],
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <PaiementAnalytic
                title="Total En GNF"
                percent={2.6}
                total={18765}
                chart={{
                  colors: [theme.vars.palette.error.main],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [18, 19, 31, 8, 16, 37, 12, 33],
                }}
              />
            </Grid>
          </Grid>
        {/* </Stack> */}

        <Card sx={{ mb: { xs: 3, md: 5 } }} lg={12}>
          <Tabs
            // value={filters?.state?.status || []}
            // onChange={handleFilterStatus}
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

          <PaiementTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: dataFiltered?.map((option) => option.name) }}
          />

          {canReset && (
            <PaiementTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={pagination.count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }} lg={12}>
          

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

                <TableBody>
                  {tableData
                    .map((row) => (
                      <PaiementTableRow
                        key={row.slug}
                        row={row}
                        selected={table.selected.includes(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                        
                      />
                    ))}
               {tableData.length > 0 && 
                tableData.lenght < table.rowsPerPage && (
                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={table.rowsPerPage - tableData.length}
                  />
                )}
                  <TableNoData notFound={notFound} />
                </TableBody>
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

     
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name,  startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (paiement) =>
        paiement.reference.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        paiement.payer.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        paiement.payment_method.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

 


  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((paiement) => fIsBetween(paiement.date_paiement, startDate, endDate));
    }
  }

  return inputData;
}