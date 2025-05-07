
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useRef, useState, useEffect } from 'react';

import { fDate } from 'src/utils/format-time';

import { useReactToPrint } from 'react-to-print';

import { PaiementToolbar } from './paiement-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  fontSize: '0.85rem',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const Logo = styled('img')({
  height: 60,
  width: 'auto',
});

export function PaiementDetails({ payment }) {
  const componentRef = useRef();
  const [qrUrl, setQrUrl] = useState('');
  
  useEffect(() => {
    if (payment?.reference) {
      // Préparation du QR code avec les informations du paiement
      const qrData = encodeURIComponent(`Paiement: ${payment.reference} - Facture: ${payment.facture_number || ''} - Montant: ${payment.amount || ''} ${payment.devise?.sign || 'GNF'}`);
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`);
    }
  }, [payment]);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Fonction pour formater les montants
  const formatAmount = (amount) => {
    if (!amount) return '0 GNF';
    return `${Number(amount).toLocaleString()} GNF`;
  };


  return (
    <>
      <Card sx={{ mb: 3 }}>
        <PaiementToolbar payment={payment} componentRef={componentRef} />
      </Card>
      
      <Card sx={{ pt: 4, px: 4, borderRadius: 1}} ref={componentRef}>
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                {/* Première ligne : logos symétriques */}
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={4} display="flex" justifyContent="flex-start">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Logo src="/logo/logo-single.png" alt="TDSS Logo" sx={{ height: 80, width: 80 }} />
                      <Typography variant="subtitle2" align="center" sx={{ fontSize: 10, lineHeight: 1.2, mt: 1 }}>
                        TECH DATA SECURISATION & SYSTEMES
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={4} display="flex" justifyContent="flex-end">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Logo src="/logo/logo-single.png" alt="TDSS Logo" sx={{ height: 80, width: 80 }} />
                      <Typography variant="subtitle2" align="center" sx={{ fontSize: 10, lineHeight: 1.2, mt: 1 }}>
                        TECH DATA SECURISATION & SYSTEMES
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Ligne horizontale */}
                <Divider sx={{ mt: 2, mb: 2, borderColor: 'white', borderWidth: 1 }} />
                
                {/* Titre centré */}
                <Typography variant="h6" align="center" sx={{ fontWeight: 600, letterSpacing: 0.5, mb: 2 }}>
                  RECU DE PAIEMENT N° {payment?.number || payment?.reference}
                </Typography>
                
                {/* Ligne horizontale */}
                <Divider sx={{ mt: 1, mb: 3, borderColor: 'white', borderWidth: 1 }} />
              </Box>
              <Divider sx={{ mt: 2, borderStyle: 'solid', borderColor: 'divider', opacity: 0.7 }} />
            </Grid>
            
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Facture N° :</Typography> {payment?.facture_number}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Référence :</Typography> {payment?.facture_ref}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Méthode :</Typography> {payment?.payment_method}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Typography variant="body2" align="right" sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Date :</Typography> {payment ? fDate(new Date()) : ''}
              </Typography>
              <Typography variant="body2" align="right" sx={{ mt: 0.75, fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Devise :</Typography> {payment?.devise?.name} ({payment?.devise?.sign})
              </Typography>
              <Typography variant="body2" align="right" sx={{ mt: 0.75, fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Créé par :</Typography> {payment?.created_by?.name}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, fontSize: '0.9rem', letterSpacing: 0.25, mb: 1 }}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>CLIENT : </Typography>{payment?.payer?.employer}
              </Typography>
              <Box >
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Nom :</Typography> {payment?.payer?.first} {payment?.payer?.last}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Tél :</Typography> {payment?.payer?.phone}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary', mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Email :</Typography> {payment?.payer?.email}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>Pays :</Typography> {payment?.payer?.country_origin}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="40%" sx={{ fontWeight: 700 }}>Description</StyledTableCell>
                <StyledTableCell width="30%" align="center" sx={{ fontWeight: 700 }}>Types de permis</StyledTableCell>
                <StyledTableCell width="30%" align="right" sx={{ fontWeight: 700}}>Montant</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell sx={{ fontWeight: 500 }}>Frais d'acquisition</StyledTableCell>
                <StyledTableCell align="center">
                  {payment?.facture_total_cadres && parseInt(payment.facture_total_cadres, 10) > 0 && (
                    <Typography component="span" sx={{ mr: 1, fontSize: '0.85rem' }}>
                      Permis A ({payment.facture_total_cadres})
                    </Typography>
                  )}
                  {payment?.facture_total_agents && parseInt(payment.facture_total_agents, 10) > 0 && (
                    <Typography component="span" sx={{ mr: 1, fontSize: '0.85rem' }}>
                      Permis B ({payment.facture_total_agents})
                    </Typography>
                  )}
                  {payment?.facture_total_ouvriers && parseInt(payment.facture_total_ouvriers, 10) > 0 && (
                    <Typography component="span" sx={{ fontSize: '0.85rem' }}>
                      Permis C ({payment.facture_total_ouvriers})
                    </Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">{formatAmount(payment?.amount)}</StyledTableCell>
              </TableRow>
              <StyledTableRow>
                <StyledTableCell colSpan={2} align="right" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>
                  TOTAL TTC
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>
                  {formatAmount(payment?.amount)}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </Box>
        
        <Box sx={{ mt: 5, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 120, height: 120, p: 1, mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {qrUrl ? (
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <Typography variant="caption" align="center">
                      QR Code en cours de chargement...
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Le Client</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <Divider sx={{ width: '100%', mb: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>La Banque</Typography>
              </Box>
            </Grid>
            

          </Grid>
        </Box>
      </Card>
    </>
  );
}
