'use client';

import { CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { PayeurForm } from './form-factures';

import { fetchOptions, banks } from 'src/utils/options';

// ----------------------------------------------------------------------

export function FactureTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onPaidRow,
  Options,
  setOptions,
  setSelectedBanque,
  selectedBanque
}) {
  const confirm = useBoolean();

  const [loading, setLoading] = useState(false); // Etat pour gérer l'affichage du loader pendant le chargement des options de banque
  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [selectedBanqueLocal, setSelectedBanqueLocal] = useState(null);


  const handleChangeBanque = (event, newValue) => {
    setSelectedBanqueLocal(newValue);
    setSelectedBanque(newValue); // Remonte l'objet complet
  };



  const popover = usePopover();

  useEffect(() => {
    // Récupérer les options lors du chargement du composant
    fetchOptions().then(() => {
      setLoaded(true); // Marquer comme chargé une fois les données récupérées
      console.log(banks);
    });
  }, []);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.numero_facture}
                </Typography>
              }
            />
          </Stack>
        </TableCell>

        <TableCell>{row.declaration__declaration_number}</TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(row.amount)}
            secondary={`GNF ${row.montant_gnf}`}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.created_at)}
            secondary={fTime(row.created_at)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.statut === 'paid' && 'success') ||
              (row.statut === 'En attente' && 'warning') ||
              (row.statut === 'Non payée' && 'error') ||
              'default'
            }
          >
            {row.statut}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Voir
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Modifier
          </MenuItem>
          {/* {row.status === 'paid' && ( */}
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
              setOpenFirstDialog(true); // Ouvre la première boîte de dialogue
            }}
          >
            <Iconify icon="mdi:credit-card" />
            Payer
          </MenuItem>
          {/* )} */}
        </MenuList>
      </CustomPopover>
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
              options={banks}
              getOptionLabel={(bank) => bank.name}
              loading={loading}
              value={selectedBanque || null}
              onChange={handleChangeBanque}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rechercher ou sélectionner une banque"
                  placeholder="Taper pour rechercher"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
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
              console.log('ID de la banque sélectionnée:', selectedBanque?.value);
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
        content={<PayeurForm id={row.id} />}
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setOpenSecondDialog(false); // Ferme la deuxième boîte de dialogue
              onPaidRow(); // Action pour "Payer"
            }}
          >
            Payer
          </Button>
        }
      />
    </>
  );
}