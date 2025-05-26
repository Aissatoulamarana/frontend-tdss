import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AgentActionButton() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateDeclaration = () => {
    // Ici, on pourrait rediriger vers la page de création de déclaration
    // ou implémenter la logique de création directement
    router.push('/agent/declaration/new');
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 999,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
          sx={{
            borderRadius: '50px',
            px: 3,
            boxShadow: theme.customShadows.z8,
          }}
        >
          Nouvelle Déclaration
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Créer une nouvelle déclaration</DialogTitle>
        
        <DialogContent>
          {/* Ici, on pourrait ajouter un formulaire rapide ou des options pour la création */}
          <Box sx={{ py: 2 }}>
            Voulez-vous créer une nouvelle déclaration ?
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleCreateDeclaration} variant="contained" color="primary">
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}