'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useReactToPrint } from 'react-to-print';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import NoSsr from '@mui/material/NoSsr';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';

import { PaiementPDF } from './paiement-pdf';

// ----------------------------------------------------------------------

export function PaiementToolbar({ payment, componentRef }) {
  const view = useBoolean();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Recu_Paiement_${payment?.reference || payment?.number || 'sans-reference'}`,
    onAfterPrint: () => console.log('Impression terminée'),
  });

  return (
    <> 
   <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
      {/* Bouton d'aperçu PDF */}
      <Tooltip title="Aperçu PDF">
        <IconButton onClick={view.onTrue}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
      </Tooltip>

      {/* Bouton de téléchargement PDF */}
      <NoSsr>
        {payment && (
          <PDFDownloadLink
            document={payment ? <PaiementPDF payment={payment} /> : <span />}
            fileName={`recu-paiement-${payment?.number || ''}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Télécharger">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>
        )}
      </NoSsr>

      {/* Bouton d'impression */}
      <Tooltip title="Imprimer">
        <IconButton onClick={handlePrint}>
          <Iconify icon="eva:printer-fill" />
        </IconButton>
      </Tooltip>
      </Stack>

      </Stack>
      {/* Dialogue d'aperçu PDF */}
      <Dialog
        fullScreen
        open={view.value}
        onClose={view.onFalse}
        PaperProps={{
          sx: { maxWidth: 'calc(100% - 24px)', maxHeight: 'calc(100% - 24px)' },
        }}
      >
        <DialogActions sx={{ py: 2, px: 3 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Aperçu du reçu de paiement
          </Typography>
          
          {payment && (
            <PDFDownloadLink
              document={<PaiementPDF payment={payment} />}
              fileName={`recu-paiement-${payment?.reference || payment?.number || 'sans-reference'}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Iconify icon="eva:download-fill" />}
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Télécharger'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          
          <IconButton onClick={view.onFalse}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogActions>
        
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {payment && (
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <PaiementPDF payment={payment} />
            </PDFViewer>
          )}
        </DialogContent>
      </Dialog>
   
    </>
  );
}

// PaiementToolbar.propTypes = {
//   payment: PropTypes.shape({
//     reference: PropTypes.string,
//     number: PropTypes.string,
//   }),
//   componentRef: PropTypes.shape({
//     // eslint-disable-next-line react/forbid-prop-types
//     current: PropTypes.any,
//   }),
// };
