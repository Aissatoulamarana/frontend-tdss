'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';
import dayjs, { fIsBetween } from 'src/utils/format-time';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  useTable,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { PenaliteTableFiltersResult } from '../penalite-table-filters-result';
import { PENALITE_STATUS_OPTIONS } from '../penalite-filter-options';
import { PenaliteTableRow } from '../penalite-table-row';
import { PenaliteTableToolbar } from '../penalite-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'reference', label: 'Référence' },
  { id: 'type', label: 'Type' },
  { id: 'company', label: 'Entreprise' },
  { id: 'employee_name', label: "Nom de l'employé" },
  { id: 'amount', label: 'Montant' },
  { id: 'currency_sign', label: 'Devise' },
  { id: 'status', label: 'Statut' },
  { id: 'created_on', label: 'Date de création' },
  { id: 'infraction_date', label: "Date de l'infraction" },
  { id: '' },
];

// ----------------------------------------------------------------------

export function PenaliteListView() {
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'created_on' });
  const fetchRequestIdRef = useRef(0);

  const billConfirm = useBoolean();
  const cancelConfirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const filters = useSetState(
    {
      company: '',
      type: '',
      status: 'all',
      date_after: null,
      date_before: null,
    },
    { persistByPath: true }
  );

  const dateError = fIsBetween(filters.state.date_after, filters.state.date_before);

  useEffect(() => {
    if (filters.isHydrated && !filters.state.status) {
      filters.setState({ status: 'all' });
    }
  }, [filters.isHydrated, filters.setState, filters.state.status]);

  const sortedData = sortPenalties({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const canReset =
    !!filters.state.company ||
    !!filters.state.type ||
    filters.state.status !== 'all' ||
    !!filters.state.date_after ||
    !!filters.state.date_before;

  const notFound = !loading && pagination.count === 0;

  const buildPenaltyParams = useCallback(
    ({ includePagination = true, status = filters.state.status } = {}) => ({
      ...(includePagination
        ? {
            limit: table.rowsPerPage,
            offset: table.page * table.rowsPerPage,
          }
        : {}),
      ...(filters.state.company ? { company: filters.state.company.trim() } : {}),
      ...(filters.state.type ? { type: filters.state.type.trim() } : {}),
      ...(status && status !== 'all' ? { status: status.trim() } : {}),
      ...(!dateError && filters.state.date_after
        ? { date_after: dayjs(filters.state.date_after).format('YYYY-MM-DD') }
        : {}),
      ...(!dateError && filters.state.date_before
        ? { date_before: dayjs(filters.state.date_before).format('YYYY-MM-DD') }
        : {}),
    }),
    [
      dateError,
      filters.state.company,
      filters.state.type,
      filters.state.status,
      filters.state.date_after,
      filters.state.date_before,
      table.page,
      table.rowsPerPage,
    ]
  );

  const loadPenalties = useCallback(async () => {
    if (!filters.isHydrated) return;

    const requestId = fetchRequestIdRef.current + 1;
    fetchRequestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const params = buildPenaltyParams();

      const response = await axios.get(API.listPenalties(), { params });

      if (requestId !== fetchRequestIdRef.current) return;

      setTableData(response.data?.results || []);
      setPagination({
        count: response.data?.count || 0,
        next: response.data?.next || null,
        previous: response.data?.previous || null,
      });
    } catch (err) {
      if (requestId !== fetchRequestIdRef.current) return;

      const message = extractErrorMessage(err);
      setError(message);
      setTableData([]);
      setPagination({ count: 0, next: null, previous: null });
      toast.error(message);
    } finally {
      if (requestId !== fetchRequestIdRef.current) return;
      setLoading(false);
    }
  }, [buildPenaltyParams, filters.isHydrated]);

  useEffect(() => {
    loadPenalties();
  }, [loadPenalties]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const runPenaltyAction = useCallback(
    async ({ slugs, requestFactory, successLabel }) => {
      if (!slugs.length) {
        toast.warning('Aucune pénalité sélectionnée.');
        return;
      }

      setActionLoading(true);

      try {
        const results = await Promise.allSettled(slugs.map((slug) => requestFactory(slug)));

        const successCount = results.filter((result) => result.status === 'fulfilled').length;
        const failedResults = results.filter((result) => result.status === 'rejected');

        if (successCount > 0) {
          const label = successCount === 1 ? successLabel : `${successCount} pénalités traitées.`;
          toast.success(label);
        }

        if (failedResults.length > 0) {
          const message = extractErrorMessage(failedResults[0].reason);
          toast.error(
            failedResults.length === slugs.length
              ? message
              : `${failedResults.length} opération(s) ont échoué. ${message}`
          );
        }

        table.setSelected([]);
        await loadPenalties();
      } finally {
        setActionLoading(false);
      }
    },
    [loadPenalties, table]
  );

  const handleBillRow = useCallback(
    async (slug) => {
      await runPenaltyAction({
        slugs: [slug],
        requestFactory: (itemSlug) => axios.post(API.billPenalty(itemSlug), {}),
        successLabel: 'Pénalité facturée avec succès.',
      });
    },
    [runPenaltyAction]
  );

  const handleCancelRow = useCallback(
    async (slug) => {
      await runPenaltyAction({
        slugs: [slug],
        requestFactory: (itemSlug) => axios.post(API.cancelPenalty(itemSlug), {}),
        successLabel: 'Pénalité annulée avec succès.',
      });
    },
    [runPenaltyAction]
  );

  const handleBillSelected = useCallback(async () => {
    await runPenaltyAction({
      slugs: table.selected,
      requestFactory: (itemSlug) => axios.post(API.billPenalty(itemSlug), {}),
      successLabel: 'Pénalité facturée avec succès.',
    });
    billConfirm.onFalse();
  }, [billConfirm, runPenaltyAction, table.selected]);

  const handleCancelSelected = useCallback(async () => {
    await runPenaltyAction({
      slugs: table.selected,
      requestFactory: (itemSlug) => axios.post(API.cancelPenalty(itemSlug), {}),
      successLabel: 'Pénalité annulée avec succès.',
    });
    cancelConfirm.onFalse();
  }, [cancelConfirm, runPenaltyAction, table.selected]);

  if (error) {
    console.error(`Error: ${error}`);
  }

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Liste des pénalités"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Pénalités', href: paths.dashboard.penalite.list },
            { name: 'Liste' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {PENALITE_STATUS_OPTIONS.map((option) => (
              <Tab key={option.value} value={option.value} label={option.label} />
            ))}
          </Tabs>

          <PenaliteTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <PenaliteTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={pagination.count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={pagination.count}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  sortedData.map((row) => row.slug)
                );
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Facturer">
                    <span>
                      <IconButton
                        color="primary"
                        onClick={billConfirm.onTrue}
                        disabled={actionLoading}
                      >
                        <Iconify icon="mdi:credit-card" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Annuler">
                    <span>
                      <IconButton
                        color="error"
                        onClick={cancelConfirm.onTrue}
                        disabled={actionLoading}
                      >
                        <Iconify icon="solar:close-circle-bold" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444, minWidth: 1000 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1000 }}>
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
                      sortedData.map((row) => row.slug)
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
                    {sortedData.map((row) => (
                      <PenaliteTableRow
                        key={row.slug}
                        row={row}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={() => table.onSelectRow(row.slug)}
                        onBillRow={() => handleBillRow(row.slug)}
                        onCancelRow={() => handleCancelRow(row.slug)}
                      />
                    ))}

                    {sortedData.length > 0 && sortedData.length < table.rowsPerPage && (
                      <TableEmptyRows
                        height={table.dense ? 56 : 76}
                        emptyRows={table.rowsPerPage - sortedData.length}
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
        open={billConfirm.value}
        onClose={billConfirm.onFalse}
        title="Facturer"
        content={
          <>
            Êtes-vous sûr de vouloir facturer <strong>{table.selected.length}</strong> pénalités ?
          </>
        }
        action={
          <Button variant="contained" onClick={handleBillSelected} disabled={actionLoading}>
            {actionLoading ? <CircularProgress color="inherit" size={20} /> : 'Facturer'}
          </Button>
        }
      />

      <ConfirmDialog
        open={cancelConfirm.value}
        onClose={cancelConfirm.onFalse}
        title="Annuler"
        content={
          <>
            Êtes-vous sûr de vouloir annuler <strong>{table.selected.length}</strong> pénalités ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelSelected}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress color="inherit" size={20} /> : 'Annuler'}
          </Button>
        }
      />
    </>
  );
}

function sortPenalties({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function extractErrorMessage(error) {
  if (!error) return 'Une erreur est survenue.';

  if (typeof error === 'string') return error;

  if (Array.isArray(error)) return error.join(' ');

  if (typeof error === 'object') {
    return (
      error.detail ||
      error.error ||
      error.message ||
      error.details ||
      error.non_field_errors?.join(' ') ||
      'Une erreur est survenue.'
    );
  }

  return 'Une erreur est survenue.';
}
