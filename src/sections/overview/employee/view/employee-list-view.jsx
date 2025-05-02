'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import axios from 'src/utils/axios';
import { useState, useEffect, useCallback } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

import { EmployeeTableFiltersResult } from '../employee-filter-results';
import { EmployeeTableRow } from '../employee-table-row';
import { EmployeeTableToolbar } from '../employee-table-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
    { value: 'all', label: 'Tous' },
];

const TABLE_HEAD = [
    { id: 'reference', label: 'Reference ' },
    { id: 'numero', label: 'Numéro Passport ' },
    { id: 'name', label: 'Nom Complet' },
    { id: 'declaration', label: 'Nombre declaration' },
    { id: 'phoneNumber', label: 'Numéro de téléphone' },
    { id: 'job', label: 'Fonction' },
    { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function EmployeeListView() {
    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true); // État pour indiquer le chargement
    const [error, setError] = useState(null); // État pour gérer les erreurs
    const [selectedFilter, setSelectedFilter] = useState('name'); // filtre selectionné


    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });


    const filters = useSetState({
        name: '',
        job: [],
        status: 'all',
        passport_number: '',
        reference: '',
    });


    // On affichera directement tableData.
    const canReset =
        !!filters.state.name ||
        filters.state.job.length > 0 ||
        filters.state.status !== 'all' ||
        !!filters.state.passport_number ||
        !!filters.state.reference;

    // Pour indiquer l'absence de données, on vérifie le total
    const notFound = pagination.count === 0 && canReset;

    // Navigation vers le détail d'un employé
    const handleViewRow = useCallback(
        (slug) => {
            router.push(paths.dashboard.employee.details(slug));
        },
        [router]
    );


    // Gestion de la sélection du status dans les Tabs

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            table.onResetPage();
            filters.setState({ status: newValue });
        },
        [filters, table]
    );

    // Gestion du changement de filtre dans la zone de recherche
    const handleFilterChange = useCallback(
        (event) => {
            onResetPage(); // réinitialise la page quand le filtre change
            const value = event.target.value;
            // On réinitialise d'abord les trois filtres pour n'en mettre qu'un
            filters.setState({ name: '', passport_number: '', reference: '' });
            // On ne met à jour que le filtre sélectionné
            filters.setState({ [selectedFilter]: value });
        },
        [selectedFilter, filters, /*onResetPage*/] // Assurez-vous que onResetPage est défini ou importé
    );

    // ----------------------------------------------------------
    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const offset = table.page * table.rowsPerPage;

                const url = API.listEmployee();
                // Construction des params avec des filtres
                const params = {
                    limit: table.rowsPerPage,
                    offset: offset,
                    ...(filters.state.passport_number
                        ? { passport_number: filters.state.passport_number }
                        : filters.state.reference
                            ? { reference: filters.state.reference }
                            : filters.state.name
                                ? { name: filters.state.name }
                                : {}
                    ),
                };


                const response = await axios.get(url, { params });
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

        fetchEmployee();
    }, [
        table.page,
        table.rowsPerPage,
        filters.state.name,
        filters.state.passport_number,
        filters.state.reference,
    ]);


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
                    heading="Listes des Employés"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Employés', href: paths.dashboard.employee.list },
                        { name: 'Listes des employés' },
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
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label variant="filled" color="default">
                                        {pagination.count}
                                    </Label>
                                }
                            />

                           

                        ))}
                    </Tabs>

                    {/* <EmployeeTableToolbar
                        filters={filters}

                        onResetPage={table.onResetPage} // ou votre fonction de réinitialisation
                        // onFilterChange={handleFilterChange}

                        onResetPage={table.onResetPage}
                        onFilterChange={handleFilterChange} // Par exemple, pour le champ de recherche
                        options={{
                            roles: [...new Set(tableData.map((row) => row.job.trim()))],
                        }}
                    /> */}
                  

                    {canReset && (
                        <EmployeeTableFiltersResult
                            filters={filters}
                            // On utilise pagination.count pour le nombre total de résultats filtrés côté backend
                            totalResults={pagination.count}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <Box sx={{ position: 'relative' }}>


                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                                            <EmployeeTableRow
                                                key={row.slug}
                                                row={row}
                                                selected={table.selected.includes(row.slug)}
                                                onSelectRow={() => table.onSelectRow(row.slug)}
                                                onViewRow={() => handleViewRow(row.slug)}
                                            />
                                        ))}

                                    {tableData.length > 0 &&
                                        tableData.length < table.rowsPerPage && (
                                            <TableEmptyRows
                                                height={table.dense ? 56 : 76}
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

                        onPageChange={table.onChangePage}
                        rowsPerPage={table.rowsPerPage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        dense={table.dense}
                        count={pagination.count}

                        onChangeDense={table.onChangeDense}
                    />

                </Card>
            </DashboardContent>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Supprimer"
                content={
                    <>
                        Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> items ?
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
