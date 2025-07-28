import React from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete } from '@mui/material';
import {CircularProgress} from '@mui/material';
import { useState, useEffect } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { fCurrency , fGNF , fEuro } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { FactureToolbar } from './facture-toolbar';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import API from 'src/utils/api';
import axios from 'src/utils/axios';




// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));


export function FactureDetails({ facture, user }) {
  const [currentStatus, setCurrentStatus] = useState('');
  const [devise, setDevise] = useState('GNF');
  const [declarations , setDeclarations] = useState([]);
  const [selectedDeclarations, setSelectedDeclarations] = useState([]);
  const [loadDec , setLoadDec] = useState(false);

  useEffect(() => {
    if (!facture?.client_name) return;
    const fetchDeclarations = async () => {
      setLoadDec(true);
      try {
        const resp1 = await axios.get(API.listDeclarations(), {
          params: {offset : 0 , limit : 1 , company : facture?.client_name}
        });
        const total = resp1?.data?.count;

        console.log('Params envoyés:', {
        offset: 0,
        limit: total,
        company: facture?.client_name
      });

        const resp2 = await axios.get(API.listDeclarations(), {
        params: { offset: 0, limit: total , company : facture?.client_name }
      });
     

        setDeclarations(resp2?.data?.results || []);

      } catch (error) {
        toast.error('Erreur du chargement des déclarations')
      } finally {
        setLoadDec(false);
      }
    
    };
    fetchDeclarations();
  },[ facture && facture?.client_name]) 

  const router = useRouter();
 

  const popover = usePopover();

  const confirm = useBoolean();
  const confirmRemove = useBoolean();

  const afficherMontant = (montant) => {
    if (devise === 'GNF') {
      return fGNF(montant);
    } else if (devise === 'USD') {
      return fCurrency(montant / 9200); // Exemple: 1 USD = 9200 GNF
    } else if (devise === 'EUR') {
    return fEuro(montant / 10000); // Exemple: 1 EUR = 10000 GNF
  }
};


const handleAdd = () => {
  console.log('Ajouter une nouvelle déclaration');
}

const handleRemove = () => {
  console.log('retirer une déclaration');
}

const handleChange = (event, newValue) => {
  if (newValue) {
    console.log('Déclaration sélectionnée:', newValue);
  }
}

const qrData = encodeURIComponent(`Facture N° ${facture?.number} - ${facture?.amount} ${devise}`);
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;


  const renderFooter = (
    <Box gap={2} display="flex" alignItems="center" flexWrap="wrap" sx={{ py: 3 }}>
      <div>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          NOTES
        </Typography>
        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </div>

      <Box flexGrow={{ md: 1 }} sx={{ textAlign: { md: 'right' } }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Have a question?
        </Typography>
        <Typography variant="body2">support@minimals.cc</Typography>
      </Box>
    </Box>
  );

  const renderTotal = (
    <StyledTableRow>
      <TableCell colSpan={3} />
      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        <Box sx={{ mt: 2 }} />
        TOTAL
      </TableCell>
      <TableCell width={120} sx={{ typography: 'subtitle2' }}>
        <Box sx={{ mt: 2 }} />
        {afficherMontant(facture?.amount)}
      </TableCell>
      

    </StyledTableRow>
  );

  const CenteredTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }));
  
 // Filtrer les permis avec count > 0
 const filteredPermits = facture?.permits.filter((item) => item.count > 0) || [];
const mockDeclarations = [
    {
      number : 3352, price : 128546000 , date: '2023-10-01',
    },
    {
      number : 5841 , price : 15000000 , date: '2023-10-02',
    }
    
];

const totalPrice = mockDeclarations.reduce((acc, row) => acc + row.price, 0);
  const renderList = (
    <Scrollbar sx={{ mt: 5 }}>
  <Table sx={{ minWidth: 960 }}>
    <TableHead>
      <TableRow>
        <CenteredTableCell width={40}> </CenteredTableCell>
        <CenteredTableCell width={40}>#</CenteredTableCell>
        <CenteredTableCell width={250}>Déclarations</CenteredTableCell>
        <CenteredTableCell width={250}>Date Déclaration</CenteredTableCell>
        <CenteredTableCell width={250}>Montant</CenteredTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {mockDeclarations.map((row, index) => (
        <TableRow key={index}
         sx={{
    backgroundColor: selectedDeclarations.includes(row.number)
      ? 'rgba(0, 171, 85, 0.08)' // légère surbrillance
      : 'transparent'
  }}>
        <Checkbox
          checked={selectedDeclarations.includes(row.number)}
          onChange={(e) => {
            const selected = [...selectedDeclarations];
            if (e.target.checked) {
              selected.push(row.number);
            } else {
              const index = selected.indexOf(row.number);
              if (index > -1) selected.splice(index, 1);
            }
            setSelectedDeclarations(selected);
          }}
          inputProps={{ 'aria-label': `select declaration ${index + 1}` }}
        />

          <CenteredTableCell>{index + 1}</CenteredTableCell>

          <CenteredTableCell>
            <Typography variant="subtitle2">{row.number}</Typography>
           
          </CenteredTableCell>

       

          <CenteredTableCell>{row.date}</CenteredTableCell>

          <CenteredTableCell>
            {afficherMontant(row.price)}
          </CenteredTableCell>
        </TableRow>
      ))}

     <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse} // Ferme la deuxième boîte de dialogue
        title="Veuillez selectionner la declaration que vous voulez ajouter"
         content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 , mb: 2 }}>
            <Autocomplete
              options={declarations}
              getOptionLabel={(declaration) => declaration.number}
              loading={loadDec}
              // value={selectedBanque || null}
              onChange={handleChange}
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
                          {loadDec ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }
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
            onClick={() => {
              handleAdd(); // Action pour "Ajouter une nouvelle déclaration"
            }}
          >
            Ajouter
          </Button>
        }
      /> 

       <ConfirmDialog
              open={confirmRemove.value}
              onClose={confirmRemove.onFalse}
              title="Retirer des déclarations"
              content={
                <>
                  Etes vous sûr de vouloir retirer <strong> {selectedDeclarations.length} </strong>{' '}
                  declarations?
                </>
              }
              action={
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleRemove();
                    confirmRemove.onFalse();
                  }}
                >
                  Retirer
                </Button>
              }
            />

      {/* Total général */}
      <StyledTableRow>
        <CenteredTableCell colSpan={3} />
        <CenteredTableCell sx={{ fontWeight: 'bold' }}>TOTAL</CenteredTableCell>
        <CenteredTableCell sx={{ fontWeight: 'bold' }}>
          {afficherMontant(facture?.amount)}
        </CenteredTableCell>
      </StyledTableRow>
    </TableBody>
  </Table>
</Scrollbar>

  );
  

  const statusLabels = {
    paid: 'Payée',
    unpaid: 'En attente',
    
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'unpaid':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return 'default';
    }
  }
 
useEffect(() => {
    if (facture?.status) {
      setCurrentStatus(facture?.status);
    }
  }, [facture?.status]);

  const handleDetailsDeclaration = () => {
    const declarationSlug = facture?.declaration_slug;
    if (!declarationSlug) {
      toast.error('Le slug de la déclaration est manquant.');
      return;
    }
    router.push(paths.dashboard.declaration.details(declarationSlug));
  }

  return (
    <>
      <FactureToolbar
        facture={facture}
        user={user}
        currentStatus={currentStatus || ''}
        onChangeStatus={(e) => {
          const value = typeof e === 'string' ? e : e.target.value;
          setCurrentStatus(value);
        }
      }
        devise={devise}
      />

      <Box sx= {{display: 'flex', justifyContent: 'flex-end', mb: { xs: 1, md: 2 } }}>
      <Button
      variant="contained"
      onClick={() => confirm.onTrue()}
      startIcon= {<Iconify icon="mingcute:add-line"/>} 
      sx= {{
        mb:{ xs: 1, md: 1 },
        fontSize: '0.875rem',
        px : 2,
      }}
      >
        Ajouter une nouvelle declaration
        
      </Button>
      </Box>
      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo-single.png"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Devise
              </Typography>
              <Box
                component="select"
                value={devise}
                onChange={(e) => setDevise(e.target.value)}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  fontSize: 14,
                  minWidth: 80,
                }}
              >
                <option value="GNF">GNF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Box>
            </Box>

            <Label
              variant="soft"
              color={getStatusColor(currentStatus)}
            >
             {statusLabels[currentStatus] || 'Inconnue'}
 
            </Label>
            <Typography variant="h6"> {`FACTURE N° ${facture?.number}`}</Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date facture :
              {fDate(facture?.created_on)}
            </Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              CLIENT
            </Typography>
            <br />
            <Typography variant='h6' >
              {facture?.client_name}
            </Typography>
            <br />
            Tél : {facture?.client_contact}
            <br />
            Adresse : {facture?.client_adresse}
            <br />
            Région : {facture?.client_location}
          </Stack>

          <Stack sx={{
          typography: 'body2',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>

           <Box
           sx={{ width:90, height:90}}
            component="img"
            alt="logo"
            src={qrUrl}
           
          />

          </Stack>
        </Box>
        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} mb={4} />
        {selectedDeclarations.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
             variant="outlined"
              color="error"
              startIcon={<Iconify icon="mdi:trash-can-outline" />}
            onClick={() => {
              confirmRemove.onTrue()
            }}
          >
          Retirer
          </Button>
      </Box>
      )}


        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}
