'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
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
import { Label } from 'src/components/label';
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
import { TableRowComPermit } from '../permit-employee-table-row';
import { ca } from 'date-fns/locale';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'Tous' }];

const TABLE_HEAD = [
  //   { id: 'number', label: 'Numéro Carte' },
  { id: 'reference', label: 'Reference' },
  { id: 'passport', label: 'Numéro Passeport' },
  { id: 'name', label: 'Nom Complet' },
  { id: 'phone', label: 'Téléphone' },
  //   { id: 'sexe', label: 'Genre' },
  //   { id: 'country', label: 'Nationalité' },
  { id: 'function', label: 'Fonction' },
  //   { id: 'entreprise', label: 'Entreprise' },
  { id: 'type', label: ' Permis ' },
  { id: 'typedec', label: 'Type Déclaration ' },
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

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

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

  const filters = useSetState({
    name: '',
    job: [],
    status: 'all',
    passport_number: '',
    reference: '',
  });

  const canReset =
    !!filters.state.name ||
    filters.state.job.length > 0 ||
    filters.state.status !== 'all' ||
    !!filters.state.passport_number ||
    !!filters.state.reference;

  const notFound = pagination.count === 0 && canReset;

  const handleDeleteRow = useCallback(
    (slug) => {
      const deleteRow = tableData.filter((row) => row.slug !== slug);

      toast.success('Suppression reussie!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(tableData.length);
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.slug));

    toast.success('Suppression reussie!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [tableData.length, table, tableData]);

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

  const handlSubmitRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.submitPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit soumis avec succès!');
        // Mettre à jour l'état local ou refetch les données si nécessaire
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'submitted' } : item))
        );
      } else {
        toast.error('Échec de la soumission du permit.');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  }, []);

  const handleUnsubmitRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.unsubmitPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit retiré de la soumission avec succès!');
        // Mettre à jour l'état local ou refetch les données si nécessaire
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'processing' } : item))
        );
      } else {
        toast.error('Échec du retrait de la soumission du permit.');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleValidateRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.validatePermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit validé avec succès!');

        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'validated' } : item))
        );
      } else {
        console.log('Erreur lors de la validation du permit');
        toast.error('Une erreur est survenue lors de la validation du permit');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleRejetRow = useCallback(async (slug, rejectReason) => {
    try {
      const response = await axios.post(API.rejectPermit(slug), { motif_rejet: rejectReason });
      if (response.data || response.status === 200) {
        toast.success('Permit rejeté avec succès!');
        setTableData((prevData) =>
          prevData.map((item) =>
            item.slug === slug ? { ...item, status: 'rejected', motif_rejet: rejectReason } : item
          )
        );
      } else {
        console.log('Erreur lors du rejet du permit');
        toast.error('Une erreur est survenue lors du rejet du permit');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleDeliverRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.deliverPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit livré avec succès!');
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'delivered' } : item))
        );
      } else {
        console.log('Erreur lors de la livraison du permit');
        toast.error('Une erreur est survenue lors de la livraison du permit');
      }
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handlePrintRow = useCallback(async (slug) => {
    try {
      const response = await axios.get(API.printPermis(slug), {
        responseType: 'blob', // Important pour les fichiers binaires
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      const errorMessage = error?.error || error?.details || error?.message || error?.detail;
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    // Fonction pour récupérer les permits
    const fetchPermits = async () => {
      setLoading(true);
      try {
        const offset = table.page * table.rowsPerPage;
        const params = {
          limit: table.rowsPerPage,
          offset: offset,
          ...(filters.state.passport_number
            ? { passport_number: filters.state.passport_number }
            : filters.state.reference
              ? { reference: filters.state.reference }
              : filters.state.name
                ? { name: filters.state.name }
                : {}),
          ...(filters.state.job?.length > 0 && {
            job:
              typeof filters.state.job[0] === 'object'
                ? filters.state.job[0].name // Envoyer le nom de la fonction
                : filters.state.job[0], // Ou la valeur directe si c'est une chaîne
          }),
        };
        const response = await axios.get(API.listPermitsEmployees(), { params });
        setTableData(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchPermits();
  }, [
    table.page,
    table.rowsPerPage,
    filters.state.name,
    filters.state.job,
    filters.state.passport_number,
    filters.state.reference,
  ]); // a chaque fois que la page, rowsPerPage, ou les filtres changent , on refetch

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
          >
            {' '}
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label variant="filled" color="main">
                    {pagination.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <TableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ profil: _roles }}
            onOpenColumnSelector={columnSelector.onTrue}
          />

          {canReset && (
            <TableFiltersResult
              filters={filters}
              totalResults={pagination.count}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={pagination.count.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD.filter((col) => visibleColumns.includes(col.id) || !col.id)}
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
                    {/* slug, name, sign, value */}
                    {tableData.map((row) => (
                      <TableRowComPermit
                        key={row.slug}
                        row={row}
                        visibleColumns={visibleColumns}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={() => table.onSelectRow(row.slug)}
                        onDeleteRow={() => handleDeleteRow(row.slug)}
                        onEditRow={() => handleEditRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                        onRejetRow={(rejectReason) => handleRejetRow(row.slug, rejectReason)}
                        onSubmitRow={() => handlSubmitRow(row.slug)}
                        onUnsubmitRow={() => handleUnsubmitRow(row.slug)}
                        onValidateRow={() => handleValidateRow(row.slug)}
                        onDeliverRow={() => handleDeliverRow(row.slug)}
                        onPrintRow={() => handlePrintRow(row.slug)}
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
