'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import NoSsr from '@mui/material/NoSsr';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'src/utils/axios';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { ShareSendDialog } from './components/ShareSendDialog';
import { DeclarationPDF } from './declaration-pdf';
import DeclarationDetailsPrint from './declaration-print';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function DeclarationToolbar({
  declaration,
  currentStatus,
  statusOptions,
  onChangeStatus,
  employees,

}) {
  const router = useRouter();

  const user = useMockedUser();
  // États pour contrôler l'ouverture des dialogues share et send
  const [openShare, setOpenShare] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  // const [logoData, setLogoData] = useState(null);
  const logoUrl = declaration?.company.picture;
  const proxyBase = 'https://api.allorigins.win/raw?url=';
  const proxiedLogoUrl = logoUrl
  ? proxyBase + encodeURIComponent(logoUrl)
  : null;


  const view = useBoolean();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.declaration.edit(`${declaration?.slug}`));
  }, [declaration?.slug, router]);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Declaration_${declaration?.reference}`,
    onAfterPrint: () => console.log('Impression terminée'),
  });

  const handleShareSubmit = async (email) => {
    try {
      // Exemple d'appel à l'API pour partager la déclaration
      await axios.post('/api/declaration/share', {
        declarationId: declaration?.slug,
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
        declarationId: declaration?.slug,
        email,
      });
      alert('Déclaration envoyée avec succès.');
    } catch (error) {
      alert('Erreur lors de l’envoi.');
    }
  };

 

  const renderDownload = (
    <NoSsr>
      {declaration && (
        <PDFDownloadLink
          document={declaration ? <DeclarationPDF declaration={declaration} employees={employees}  logoUrl={proxiedLogoUrl}/> : ''}
          fileName={declaration?.number}
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <Tooltip title="Telecharger">
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
          {user?.type === 'Admin' && declaration?.status === 'UNSUBMITTED' && (
            <Tooltip title="Modifier">
              <IconButton onClick={handleEdit}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          )}
          {renderDownload}
          <Box sx={{ display: 'none' }}>
            <DeclarationDetailsPrint ref={componentRef} declaration={declaration} employees={employees} />
          </Box>

          <Tooltip title="Imprimer">
            <IconButton onClick={handlePrint}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Send">
            <IconButton onClick={() => setOpenSend(true)}>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton onClick={() => setOpenShare(true)}>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip> */}
        </Stack>

        <TextField
          fullWidth
          select
          label="Status"
          value={currentStatus}
          onChange={onChangeStatus}
          sx={{ maxWidth: 160 }}
          slotProps={{
            htmlInput: { id: `status-select-label` },
            inputLabel: { htmlFor: `status-select-label` }
          }}>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
              declaration={declaration}
              currentStatus={currentStatus}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
