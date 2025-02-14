'use client';
import { useCallback, useRef, useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NoSsr from '@mui/material/NoSsr';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
// import { DeclarationPDF } from './declaration-pdf';
import { useReactToPrint } from 'react-to-print';
// import DeclarationDetailsPrint from './declaration-print';
import { ShareSendDialog } from '../declaration/components/ShareSendDialog';
import { FacturePDF } from './facture-pdf';

// ----------------------------------------------------------------------

export function FactureToolbar({
  facture,
  currentStatus,


}) {
  const router = useRouter();
  // États pour contrôler l'ouverture des dialogues share et send
  const [openShare, setOpenShare] = useState(false);
  const [openSend, setOpenSend] = useState(false);

  const view = useBoolean();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.declaration.edit(`${facture?.id}`));
  }, [facture?.id, router]);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Declaration_${facture?.numero_facture}`,
    onAfterPrint: () => console.log('Impression terminée'),
  });

  const handleShareSubmit = async (email) => {
    try {
      // Exemple d'appel à l'API pour partager la déclaration
      await axios.post('/api/declaration/share', {
        factureId: facture?.id,
        email,
      });
      alert('Déclaration partagée avec succès.');
    } catch (error) {
      alert('Erreur lors du partage.');
    }
  };

  // Fonction à appeler lorsque l'utilisateur soumet l'email pour envoyer
  const handleSendSubmit = async (email) => {
    try {
      // Exemple d'appel à l'API pour envoyer la déclaration par email
      await axios.post('/api/declaration/send', {
        factureId: facture?.id,
        email,
      });
      alert('Déclaration envoyée avec succès.');
    } catch (error) {
      alert('Erreur lors de l’envoi.');
    }
  };

  const renderDownload = (
    <NoSsr>
      <PDFDownloadLink
        document={facture ? <FacturePDF facture={facture} /> : <span />}
        fileName={facture?.numero_facture}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="Download">
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
    </NoSsr>
  );

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          {renderDownload}
          <Box sx={{ display: 'none' }}>
            {/* <DeclarationDetailsPrint ref={componentRef} facture={facture} /> */}
          </Box>

          <Tooltip title="Print">
            <IconButton onClick={handlePrint}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton onClick={() => setOpenSend(true)}>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton onClick={() => setOpenShare(true)}>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip>
        </Stack>


      </Stack>

      {/* Dialog pour l'envoi par email */}
      <ShareSendDialog
        open={openSend}
        onClose={() => setOpenSend(false)}
        onSubmit={handleSendSubmit}
        title="Envoyer la déclaration"
        label="Saisissez l'email destinataire"
      />

      {/* Dialog pour partager la déclaration */}
      <ShareSendDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        onSubmit={handleShareSubmit}
        title="Partager la déclaration"
        label="Saisissez l'email à partager"
      />

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              facture={facture}
              currentStatus={currentStatus}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
