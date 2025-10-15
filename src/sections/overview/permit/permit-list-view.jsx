'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { CustomPopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import axios from 'src/utils/axios';
import { useState, useEffect, useCallback, use } from 'react';
import { _roles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
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

import { TableToolbar } from 'src/sections/composants/table-toolbar';
import { TableFiltersResult } from 'src/sections/composants/table-filters-results';
import { TableRowComPermit } from './permit-table-row';
import { id } from 'date-fns/locale';
import { number } from 'prop-types';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'number', label: 'Numéro Carte' },
  { id: 'reference', label: 'Reference' },
  { id: 'passport', label: 'Numéro Passeport' },
  { id: 'name', label: 'Nom Complet' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'sexe', label: 'Genre' },
  { id: 'country', label: 'Nationalité' },
  { id: 'function', label: 'Fonction' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'type', label: 'Type Permis ' },

  { id: 'statut', label: 'Status' },

  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PermitListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const allColumns = TABLE_HEAD.map((column) => column.id).filter((id) => id);
  const [visibleColumns, setVisibleColumns] = useState(allColumns);
  const columnSelector = useBoolean();

  const toggleColumn = (id) => {
    if (visibleColumns.includes(id)) {
      setVisibleColumns(visibleColumns.filter((column) => column !== id));
    } else {
      setVisibleColumns([...visibleColumns, id]);
    }
  };

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  const filters = useSetState({ name: '', profil: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.profil.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleEditRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.permit.edit(slug));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.permit.details(slug));
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

  // useEffect(() => {
  //   // Fonction pour récupérer les permits
  //   const fetchPermits = async () => {
  //     try {
  //       const response = await axios.get(API.listPermits());
  //       setTableData(response.data.results);
  //     } catch (err) {
  //       setError(err.message || 'Erreur lors du chargement des données.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPermits();
  // }, []); // La dépendance vide signifie que cette fonction est appelée une fois au montage

  const permits = [
    {
      slug: '1',
      first: 'Paul',
      last: 'Dupont',
      number: 'Permit 1',
      reference: '0001',
      passport_number: '0852474',
      phone: '621456369',
      sexe: 'Homme',
      country: 'France',
      function: 'Chef de projet',
      company: 'Entreprise 1',
      permis: 'Permit A',
      status: 'submitted',
    },
    {
      slug: '2',
      first: 'John',
      last: 'Doe',
      number: 'Permit 2',
      reference: '0002',
      passport_number: '0852474',
      phone: '621456369',
      sexe: 'Homme',
      country: 'France',
      function: 'Chef de projet',
      company: 'Entreprise 2',
      permis: 'Permit B',
      status: 'unsubmitted',
    },
    {
      slug: '3',
      first: 'Jane',
      last: 'Smith',
      number: 'Permit 3',
      reference: '0003',
      passport_number: '0852474',
      phone: '621456369',
      sexe: 'Femme',
      country: 'France',
      function: 'Chef de projet',
      company: 'Entreprise 3',
      permis: 'Permit C',
      status: 'rejected',
    },
    {
      slug: '4',
      first: 'Bob',
      last: 'Johnson',
      number: 'Permit 4',
      reference: '0004',
      passport_number: '0852474',
      phone: '621456369',
      sexe: 'Homme',
      country: 'France',
      function: 'Chef de projet',
      company: 'Entreprise 4',
      permis: 'Permit D',
      status: 'validated',
    },
  ];

  useEffect(() => {
    setTableData(permits);
    setLoading(false);
  }, []);

  if (loading) {
    console.info('Loading ...');
  }

  if (error) {
    console.error(`Error: ${error}`);
  }
  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Permits"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Permit', href: paths.dashboard.devise.root },
            { name: 'Liste des Permits' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          ></Tabs>

          <TableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ profil: _roles }}
            onOpenColumnSelector={columnSelector.onTrue}
          />

          {canReset && (
            <TableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Supprimer">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD.filter((col) => visibleColumns.includes(col.id) || !col.id)}
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
                  {/* slug, name, sign, value */}
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TableRowComPermit
                        key={row.slug}
                        row={row}
                        visibleColumns={visibleColumns}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={() => table.onSelectRow(row.slug)}
                        onDeleteRow={() => handleDeleteRow(row.slug)}
                        onEditRow={() => handleEditRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
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

        <CustomPopover
          open={columnSelector.value}
          onClose={columnSelector.onFalse}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuList dense sx={{ width: 200 }}>
            {TABLE_HEAD.filter((col) => col.id).map((col) => (
              <MenuItem key={col.id} onClick={() => toggleColumn(col.id)}>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.id)}
                  readOnly
                  style={{ marginRight: 8 }}
                />
                {col.label}
              </MenuItem>
            ))}
          </MenuList>
        </CustomPopover>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Etes vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> type
            d'utilisateur?
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, profil } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (profiltype) => profiltype?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((profiltype) => permission?.status === status);
  }

  if (profil.length) {
    inputData = inputData?.filter((permission) => profil?.includes(permission?.profile));
  }

  return inputData;
}
