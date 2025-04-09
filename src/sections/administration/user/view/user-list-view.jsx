'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import axios from 'src/utils/axios';
import { useState, useEffect, useCallback } from 'react';
import { _roles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';

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

import { UserTableFiltersResult } from '../user-table-filters-result';
import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'actif', label: 'Actif' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Rejected' },
  { value: 'inactif', label: 'Inactif' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Nom Complet' },
  { id: 'phoneNumber', label: 'Numéro de téléphone', width: 180 },
  { id: 'company', label: 'Company', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const ROWS_PER_PAGE = 5; // Affichage par défaut
// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();


  const [tableData, setTableData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  const filters = useSetState({ name: '', role: [], status: 'all' });

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (slug) => {
      try {
        const response = axios.delete(API.userDelete(slug));

        if (response) {
          const updatedTableData = tableData.filter((row) => row.slug !== slug);
          setTableData(updatedTableData)

          toast.success('Suppression réussie !')

          table.onUpdatePageDeleteRow(dataInPage.length)
        } else {
          console.error('Erreur lors de la suppression ',)
          toast.error('Une erreur est survenue.');
        }
      } catch (e) {
        console.error('Erreur réseau ou serveur :', error)
        toast.error('Erreur lors de la communication avec le serveur');
      }
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
    (slug) => {
      router.push(paths.dashboard.user.edit(slug));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.user.details(slug));
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

  const handleUpdateRow = useCallback((updateUser) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.slug === updateUser.slug ? updateUser : row))
    );
  }, []);




  // Fonction pour récupérer les données
  const fetchUtilisateurs = async (urlOrPage = 1) => {
    setLoading(true);
    try {
      let url;
      if (typeof urlOrPage === 'string') {
        // Utilisation directe de l’URL next ou previous
        url = urlOrPage;
      } else {
        // Construit l’URL à partir du numéro de page
        const page = urlOrPage;
        const offset = (page - 1) * ROWS_PER_PAGE;
        url = API.listUsers(`?limit=${ROWS_PER_PAGE}&offset=${offset}`);
      }
      const response = await axios.get(url);
      setTableData(response.data.results);
      setRoles([
        ...new Set(response.data.results.map((role) => role.type.trim()))
      ]);

      setPagination((prev) => ({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        currentPage:
          typeof urlOrPage === 'string'
            ? // Si on utilise une URL, on détermine la nouvelle page en fonction de la présence de next ou previous
            prev.next === url ? prev.currentPage + 1 : prev.currentPage - 1
            : urlOrPage,
      }));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  if (loading) {
    console.info('Loading utilisateurs...');
  }

  if (error) {
    console.error(`Error: ${error}`);
  }

  // Gestion du changement de page
  // On vérifie si l'utilisateur clique pour aller à la page suivante ou précédente en se basant sur l'index (0 basé)
  const handlePageChange = (event, newPageIndex) => {
    const currentPage = pagination.currentPage;
    // newPageIndex est 0 basé
    if (newPageIndex + 1 > currentPage) {
      // Si page suivante et si un lien "next" est fourni par le backend
      if (pagination.next) {
        fetchUtilisateurs(pagination.next);
      }
    } else if (newPageIndex + 1 < currentPage) {
      // Si page précédente et si un lien "previous" est fourni par le backend
      if (pagination.previous) {
        fetchUtilisateurs(pagination.previous);
      }
    }
  };

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Listes des utilisateurs"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Utilisateurs', href: paths.dashboard.user.list },
            { name: 'Listes des utilisateurs' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nouvel Utilisateur
            </Button>
          }
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
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['actif', 'pending', 'banned', 'inactif'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: roles }}
          />

          {canReset && (
            <UserTableFiltersResult
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
                      <UserTableRow
                        key={row.slug}
                        row={row}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={() => table.onSelectRow(row.slug)}
                        onDeleteRow={() => handleDeleteRow(row.slug)}
                        onEditRow={() => handleEditRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                        onUpdateRow={handleUpdateRow}
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
            page={pagination.currentPage - 1}
            dense={table.dense}
            count={pagination.count}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={handlePageChange}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent >

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Etes vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> items?
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
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}