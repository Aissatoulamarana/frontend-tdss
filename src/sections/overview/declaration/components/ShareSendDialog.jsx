// ShareSendDialog.js
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export function ShareSendDialog({ open, onClose, onSubmit, title, label }) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onSubmit(email);
    setEmail(''); // réinitialiser l'email après soumission
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label={label}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxWidth="sm" // Taille maximale du dialog (xs, sm, md, lg, xl)
          fullWidth // Prend toute la largeur possible dans la limite de maxWidth

        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
