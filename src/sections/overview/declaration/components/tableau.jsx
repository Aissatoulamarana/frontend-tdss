import {
  Box,
  Table,
  Paper,
  Stack,
  Button,
  Dialog,
  Switch,
  Toolbar,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  DialogTitle,
  TableFooter,
  Autocomplete,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
  FormControlLabel, CircularProgress
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import axios from 'src/utils/axios';
import React, { useState, useEffect } from 'react';

import API from 'src/utils/api';

import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';

const fixedCategories = [
  { label: 'Tous', value: 'All' },
  { label: 'Cadres', value: 'Cadres' },
  { label: 'Agent', value: 'Agent' },
  { label: 'Ouvrier', value: 'Ouvrier' },
];

const FilteredTable = ({ declaration }) => {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('All');
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [options, setOptions] = useState([]); // Liste des déclarations
  const [selectedDeclaration, setSelectedDeclaration] = useState(null); // Déclaration sélectionnée
  const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour la boîte de dialogue
  const [loading, setLoading] = useState(false);



  const rows =
    filter === 'All'
      ? declaration.employees // Affiche tous les éléments si le filtre est 'All'
      : declaration.employees.filter((row) => row.fonction === filter); // Filtre les éléments selon la fonction si le filtre est différent de 'All'

  const isSelected = (passport_number) => selected.includes(passport_number);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.passport_number);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (event, passport_number) => {
    event.stopPropagation(); // Empêche le clic sur toute la ligne de cocher la case par accident
    setSelected((prevSelected) => {
      if (prevSelected.includes(passport_number)) {
        return prevSelected.filter((selectedId) => selectedId !== passport_number);
      }
      return [...prevSelected, passport_number];

    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchDeclarations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.listDeclarations());
        const declarations = response.data.map((declaration) => ({
          value: declaration.reference,
          label: declaration.reference,
        }));
        setOptions(declarations);
      } catch (error) {
        console.error('Erreur lors de la récupération des déclarations :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, []);

  const handleMove = async () => {
    try {
      const payload = {
        selected_ids: selected, // IDs des éléments sélectionnés
        target_declaration: selectedDeclaration.value, // ID de la déclaration cible
      };

      const response = await axios.post(API.move(), payload);
      if (response.status === 200) {
        toast('Déplacement effectué avec succès !');
        // Mettez à jour les données localement si nécessaire
        setSelected([]);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors du déplacement :', error);
      toast("Une erreur s'est produite lors du déplacement.");
    }
  };

  return (
    <Paper>
      {/* Barre de menu pour les filtres */}
      {/* Barre d'outils conditionnelle */}
      <Toolbar
        sx={{
          pl: 2,
          pr: 2,
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: selected.length > 0 ? 'rgba(0, 0, 255, 0.1)' : 'inherit',
        }}
      >
        {selected.length > 0 ? (
          <Typography variant="subtitle1" color="primary">
            {selected.length} sélectionné(s)
          </Typography>
        ) : (
          <Typography variant="h6" />
        )}

        {selected.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Tooltip title="Deplacer">
              <IconButton color="primary" onClick={() => setIsDialogOpen(true)}>
                <Iconify icon="iconamoon:send-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        {/* Boîte de dialogue */}
        <Dialog fullWidth open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Déplacer</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 4 }}>
              Êtes-vous sûr de vouloir déplacer <strong>{selected.length}</strong> personnes ?
            </Typography>
            <Autocomplete
              options={options} // Liste des options
              getOptionLabel={(option) => (option.label ? option.label.toString() : '')} // Comment afficher les options
              loading={loading} // Affiche le loader si les données sont en cours de chargement
              value={selectedDeclaration} // Déclaration sélectionnée
              onChange={(event, newValue) => setSelectedDeclaration(newValue)} // Mise à jour de la sélection
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rechercher ou sélectionner une déclaration"
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
                    }
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleMove();
                // Ajoutez ici la logique pour "Déplacer"
                setIsDialogOpen(false);
              }}
            >
              Déplacer
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
      {/* Tableau */}
      <TableContainer>
        {/* Barre des filtres fixes */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: 1,
            marginBottom: 5
          }}
        >
          {fixedCategories.map((cat) => {
            // Calcul du nombre pour chaque catégorie
            const count =
              cat.value === 'All'
                ? declaration.employees.length
                : declaration.employees.filter((emp) => emp.category === cat.value).length;
            return (
              <Button
                key={cat.value}
                variant={filter === cat.value ? 'contained' : 'text'}
                size="small"
                onClick={() => setFilter(cat.value)}
                sx={{ flexDirection: 'column', alignItems: 'center', minWidth: 80 }}
              >
                <Typography variant="body1">{cat.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {count}
                </Typography>
              </Button>
            );
          })}
        </Box>

        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Numero du passeport</TableCell>
              <TableCell>Nom & Prenom</TableCell>
              <TableCell>N Téléphone</TableCell>
              <TableCell>Fonction</TableCell>
              <TableCell>Permis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow
                key={`${row.id}-${row.passport_number}`}
                hover
                selected={isSelected(row.passport_number)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected(row.passport_number)}
                    onChange={(event) => handleSelectRow(event, row.passport_number)}
                  />
                </TableCell>
                <TableCell>{row.passport_number}</TableCell>
                <TableCell>
                  <ListItemText
                    primary={row.last}
                    secondary={row.first}
                    slotProps={{
                      primary: { typography: 'body2', noWrap: true },
                      secondary: { mt: 0.5, component: 'span', typography: 'body2' }
                    }} />
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.fonction}</TableCell>
                <TableCell>{row.permis}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
          label="Dense"
        />
      </Box>
    </Paper>
  );
};

export default FilteredTable;
