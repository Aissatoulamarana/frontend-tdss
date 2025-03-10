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

import { ClientTableFiltersResult } from '../client-table-filters-result';
import { ClientTableRow } from '../client-table-row';
import { ClientTableToolbar } from '../client-table-toolbar';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
    { value: 'all', label: 'Tous' },
    { value: 'ON', label: 'Actif' },
    { value: 'pending', label: 'Pending' },
    { value: 'banned', label: 'Rejected' },
    { value: 'inactif', label: 'Inactif' },
];

const TABLE_HEAD = [
    { id: 'name', label: 'Nom ' },
    { id: 'phoneNumber', label: 'Numéro de téléphone', width: 180 },
    //   { id: 'company', label: 'Company', width: 220 },
    { id: 'role', label: 'Type', width: 180 },
    { id: 'status', label: 'Status', width: 100 },
    { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ClientListView() {
    const table = useTable();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true); // État pour indiquer le chargement
    const [error, setError] = useState(null); // État pour gérer les erreurs

    const filters = useSetState({ name: '', type_nom: [], status: 'all' });

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.name || filters.state.type_nom.length > 0 || filters.state.status !== 'all';

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );

    const handleViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.user.account);
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

    const handleActivate = useCallback(
        async (id) => {
            try {
                // Appel à l'API backend pour rejeter la déclaration
                const response = await axios.post(API.activate(id));
                if (response.data.success) {
                    // Si succès, rediriger ou mettre à jour l'interface utilisateur
                    console.log('Compte activé avec succès:', response.data.message);
                    toast.success('Compte activé avec succès !');
                    router.push(paths.dashboard.declaration.list);
                } else {
                    console.error("Erreur lors de l'activation :", response.data.error);
                    toast.error('Une erreur est survenue.');
                }
            } catch (error) {
                console.error('Erreur réseau ou serveur:', error);
                toast.error('Erreur lors de la communication avec le serveur.');
            }
        },
        [router]
    );

    useEffect(() => {
        // Fonction pour récupérer les données
        const fetchClient = async () => {
            try {
                const response = await axios.get(API.listClients());
                setTableData(response.data); // Assurez-vous que votre API renvoie un tableau
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, []); // La dépendance vide signifie que cette fonction est appelée une fois au montage

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
                    heading="Listes des clients"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Client', href: paths.dashboard.client.root },
                        { name: 'Listes des clients' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.client.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Nouvel Client
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
                                            (tab.value === 'ON' && 'success') ||
                                            (tab.value === 'pending' && 'warning') ||
                                            (tab.value === 'banned' && 'error') ||
                                            'default'
                                        }
                                    >
                                        {['ON', 'pending', 'banned', 'inactif'].includes(tab.value)
                                            ? tableData.filter((client) => client.status === tab.value).length
                                            : tableData.length}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>

                    <ClientTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                        options={{ roles: [... new Set(dataFiltered.map((row) => row.type_nom.trim()))] }}
                    />

                    {canReset && (
                        <ClientTableFiltersResult
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
                                    dataFiltered.map((row) => row.uuid)
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
                                            dataFiltered.map((row) => row.uuid)
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
                                            <ClientTableRow
                                                key={row.uuid}
                                                row={row}
                                                selected={table.selected.includes(row.uuid)}
                                                onSelectRow={() => table.onSelectRow(row.uuid)}
                                                onDeleteRow={() => handleDeleteRow(row.uuid)}
                                                onEditRow={() => handleEditRow(row.uuid)}
                                                onViewRow={() => handleViewRow(row.uuid)}
                                                onActivate={() => handleActivate(row.uuid)}
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
    const { name, status, type_nom } = filters;

    const stabilizedThis = inputData?.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData?.filter(
            (client) => client?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (status !== 'all') {
        inputData = inputData?.filter((client) => client?.status === status);
    }

    if (type_nom.length) {
        inputData = inputData?.filter((client) => type_nom?.includes(client.type_nom));
    }

    return inputData;
}