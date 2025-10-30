import { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function WorkPermitCard({ permit, onClose, open }) {
  const [flipped, setFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [printMode, setPrintMode] = useState('a4'); // 'a4' ou 'duplex'
  const cardRef = useRef(null);

  const handlePreview = async () => {
    // Générer le QR code
    try {
      const qrData = encodeURIComponent(
        `Permit N° ${permit?.card_number || permit?.reference || 'N/A'}`
      );
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Erreur génération QR code:', error);
    }
  };

  const handlePrintClick = () => {
    setOpenPrintDialog(true);
  };

  const handleConfirmPrint = () => {
    setOpenPrintDialog(false);

    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      const printDocument = printWindow.document;

      printDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Carte de Permis - ${permit?.card_number || 'N/A'}</title>
            <style>
              /* Reset complet */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                margin: 0;
                padding: 0;
                background: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
              }
              
              .print-container {
                display: flex;
                flex-direction: ${printMode === 'a4' ? 'column' : 'column'};
                gap: 20px;
                align-items: center;
                padding: 20px;
              }
              
              .card-face {
                width: 85mm;
                height: 54mm;
                background: white;
                border-radius: 3mm;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              /* Styles d'impression */
              @media print {
                @page {
                  margin: 0;
                  size: ${printMode === 'duplex' ? '85mm 54mm' : 'A4'};
                }
                
                body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  min-height: 100vh !important;
                }
                
                .print-container {
                  padding: 0 !important;
                  margin: 0 !important;
                  gap: 0 !important;
                }
                
                .card-face {
                  box-shadow: none !important;
                  border: 0.5mm solid #ccc !important;
                  margin: 0 !important;
                }
                
                /* Pour le mode duplex, chaque carte sur une page séparée */
                ${
                  printMode === 'duplex'
                    ? `
                  .card-front { 
                    page-break-after: always; 
                  }
                `
                    : ''
                }
                
                /* Pour le mode A4, afficher les deux cartes sur la même page */
                ${
                  printMode === 'a4'
                    ? `
                  .print-container {
                    flex-direction: column !important;
                    gap: 10mm !important;
                  }
                `
                    : ''
                }
                
                /* Force les couleurs à s'imprimer */
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${getCardFrontHTML()}
              ${getCardBackHTML()}
            </div>
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => {
                    window.close();
                  }, 500);
                }, 300);
              };
            </script>
          </body>
        </html>
      `);

      printDocument.close();
    }, 100);
  };

  // Fonctions pour générer le HTML des cartes avec les BONS styles
  const getCardFrontHTML = () => {
    return `
      <div class="card-face card-front">
        <div style="width: 100%; height: 100%; background: white; padding: 3mm; display: flex; flex-direction: column; position: relative; border-radius: 3mm; font-family: Arial, sans-serif;">
          <!-- Numéro de carte -->
          <div style="text-align: right; font-size: 2.4mm; font-weight: 600; margin-bottom: 1.5mm;">
            N° ${permit?.card_number || permit?.reference || 'N/A'}
          </div>

          <!-- Contenu principal -->
          <div style="display: flex; gap: 2mm; flex: 1;">
            <!-- Photo -->
            <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0;">
              <div style="width: 25mm; height: 30mm; background: #f5f5f5; border-radius: 1mm; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 0.3mm solid #bdbdbd;">
                ${
                  permit?.photo
                    ? `<img src="${permit.photo}" alt="${permit?.first || ''} ${permit?.last || ''}" style="width: 100%; height: 100%; object-fit: cover;" />`
                    : '<div style="color: #9e9e9e; font-size: 3mm;">Photo</div>'
                }
              </div>
              <div style="font-size: 2.4mm; font-weight: 600; margin-top: 1mm; text-align: center;">
                PASSEPORT: ${permit?.passport_number || 'N/A'}
              </div>
            </div>

            <!-- Informations -->
            <div style="flex: 1;">
              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">NOM</div>
                <div style="font-weight: 700; font-size: 2.1mm; letter-spacing: 0.05mm;">${(permit?.last || 'N/A').toUpperCase()}</div>
              </div>

              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">PRÉNOMS</div>
                <div style="font-weight: 600; font-size: 2.2mm;">${(permit?.first || 'N/A').toUpperCase()}</div>
              </div>

              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">DATE ET LIEU DE NAISSANCE</div>
                <div style="font-weight: 600; font-size: 2.2mm;">
                  ${formatDateLong(permit?.birthday)} ${permit?.birth_place || 'N/A'}
                </div>
              </div>

              <div style="display: flex; gap: 3mm; margin-bottom: 2mm;">
                <div>
                  <div style="font-size: 2.4mm; color: #666; font-weight: 400;">GENRE (SEXE)</div>
                  <div style="font-weight: 700; font-size: 2.1mm;">
                    ${permit?.sexe === 'male' ? 'M' : 'F'}
                  </div>
                </div>
                <div>
                  <div style="font-size: 2.4mm; color: #666; font-weight: 400;">NATIONALITÉ</div>
                  <div style="font-weight: 600; font-size: 2.2mm;">
                    ${(permit?.nationality || permit?.country || 'N/A').toUpperCase()}
                  </div>
                </div>
              </div>

              <div style="margin-top: auto;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400; margin-bottom: 0.5mm;">SIGNATURE DU TITULAIRE</div>
                <div style="height: 8mm; border-bottom: 0.2mm solid #e0e0e0; display: flex; align-items: center;">
                  ${
                    permit?.signature
                      ? `<img src="${permit.signature}" alt="signature" style="height: 100%; object-fit: contain;" />`
                      : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const getCardBackHTML = () => {
    return `
      <div class="card-face card-back">
        <div style="width: 100%; height: 100%; background: white; padding: 3mm; display: flex; flex-direction: column; position: relative; border-radius: 3mm; font-family: Arial, sans-serif;">
          <!-- Header avec photo -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2mm;">
            <div style="flex: 1;">
              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">CATÉGORIE</div>
                <div style="font-weight: 600; font-size: 2.2mm;">Type ${permit?.category || 'B'}</div>
              </div>

              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">NOM DE L'EMPLOYEUR</div>
                <div style="font-weight: 600; font-size: 2.2mm;">${permit?.company_name || 'N/A'}</div>
              </div>

              <div style="margin-bottom: 1.5mm;">
                <div style="font-size: 2.4mm; color: #666; font-weight: 400;">ADRESSE DE L'EMPLOYEUR</div>
                <div style="font-weight: 600; font-size: 2.2mm;">${permit?.company_address || permit?.address || 'N/A'}</div>
              </div>
            </div>

            <!-- Photo miniature -->
            <div style="width: 15mm; height: 20mm; background: #f5f5f5; border-radius: 1mm; overflow: hidden; flex-shrink: 0; margin-left: 2mm; border: 0.3mm solid #bdbdbd;">
              ${
                permit?.photo
                  ? `<img src="${permit.photo}" alt="${permit?.first || ''} ${permit?.last || ''}" style="width: 100%; height: 100%; object-fit: cover;" />`
                  : '<div style="color: #9e9e9e; font-size: 2mm; display: flex; align-items: center; justify-content: center; height: 100%;">Photo</div>'
              }
            </div>
          </div>

          <!-- Informations du contrat -->
          <div style="display: flex; gap: 2mm; margin-bottom: 1mm;">
            <div style="flex: 1;">
              <div style="font-size: 2.4mm; color: #666; font-weight: 400;">VALIDITÉ</div>
              <div style="font-weight: 600; font-size: 2.2mm;">
                ${formatDate(permit?.card_expires_at || permit?.contract_starts_at)}
              </div>
            </div>

            <div style="flex: 1;">
              <div style="font-size: 2.4mm; color: #666; font-weight: 400;">FONCTION</div>
              <div style="font-weight: 700; font-size: 2.2mm;">
                ${permit?.job?.name || permit?.function || 'N/A'}
              </div>
            </div>

            <div style="flex: 1;">
              <div style="font-size: 2.4mm; color: #666; font-weight: 400;">DURÉE DU CONTRAT</div>
              <div style="font-weight: 700; font-size: 2.2mm;">
                ${calculateDuration(permit?.contract_starts_at, permit?.contract_duration)}
              </div>
            </div>
          </div>

          <!-- QR Code et Numéro -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 2mm; margin-top: auto; margin-bottom: 1mm;">
            <!-- QR Code -->
            <div style="width: 16mm; height: 16mm; background: white; border: 0.3mm solid #e0e0e0; border-radius: 1mm; display: flex; align-items: center; justify-content: center; overflow: hidden;">
              ${
                qrCodeUrl
                  ? `<img src="${qrCodeUrl}" alt="QR Code" style="width: 100%; height: 100%;" />`
                  : '<div style="color: #e0e0e0; font-size: 2mm;">QR Code</div>'
              }
            </div>

            <!-- Numéro de carte -->
            <div style="font-size: 2.2mm; font-weight: 600; text-align: right;">
              N° ${permit?.card_number || permit?.reference || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateLong = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date
      .toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();
  };

  const calculateDuration = (startDate, duration) => {
    if (!startDate || !duration) return 'N/A';
    return `${duration} mois`;
  };

  // Recto de la carte
  const CardFront = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
    >
      {/* Numéro de carte */}
      <Typography
        sx={{
          textAlign: 'right',
          fontSize: '0.875rem',
          fontWeight: 400,
        }}
      >
        N° {permit?.card_number || permit?.reference}
      </Typography>

      {/* Contenu principal */}
      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
        {/* Photo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 120,
              height: 140,
              bgcolor: 'grey.200',
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid',
              borderColor: 'grey.400',
            }}
          >
            {permit?.photo ? (
              <img
                src={permit.photo}
                alt={`${permit?.first} ${permit?.last}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify icon="mdi:account" width={60} sx={{ color: 'grey.500' }} />
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontSize: '0.55rem',
              fontWeight: 600,
            }}
          >
            PASSEPORT: {permit?.passport_number || 'N/A'}
          </Typography>
        </Box>

        {/* Informations */}
        <Box sx={{ flex: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              NOM
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
              {permit?.last?.toUpperCase() || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              PRÉNOMS
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.60rem' }}>
              {permit?.first || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              DATE ET LIEU DE NAISSANCE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.60rem' }}>
              {formatDateLong(permit?.birthday)} {permit?.birth_place || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
                GENRE (SEXE)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
                {permit?.sexe === 'male' ? 'M' : 'F'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
                NATIONALITÉ
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.60rem' }}>
                {permit?.nationality || permit?.country || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
              SIGNATURE DU TITULAIRE
            </Typography>
            <Box
              sx={{
                height: 30,
                borderBottom: '1px solid',
                borderColor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {permit?.signature && (
                <img
                  src={permit.signature}
                  alt="signature"
                  style={{ height: '100%', objectFit: 'contain' }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Verso de la carte
  const CardBack = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header avec photo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              CATÉGORIE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
              Type {permit?.category || 'B'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              NOM DE L'EMPLOYEUR
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
              {permit?.company_name || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
              ADRESSE DE L'EMPLOYEUR
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.60rem' }}>
              {permit?.company_address || permit?.address || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Photo miniature */}
        <Box
          sx={{
            width: 80,
            height: 100,
            bgcolor: 'grey.200',
            borderRadius: 1,
            overflow: 'hidden',
            flexShrink: 0,
            ml: 2,
            border: '2px solid',
            borderColor: 'grey.400',
          }}
        >
          {permit?.photo ? (
            <img
              src={permit.photo}
              alt={`${permit?.first} ${permit?.last}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="mdi:account" width={40} sx={{ color: 'grey.500' }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Informations du contrat */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
            VALIDITÉ
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
            {formatDate(permit?.card_expires_at || permit?.contract_starts_at)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
            FONCTION
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
            {permit?.job?.name || permit?.function || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
            DURÉE DU CONTRAT
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.55rem' }}>
            {calculateDuration(permit?.contract_starts_at, permit?.contract_duration)}
          </Typography>
        </Box>
      </Box>

      {/* QR Code et Numéro */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        {/* QR Code */}
        <Box
          sx={{
            width: 65,
            height: 65,
            bgcolor: 'white',
            border: '2px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
          ) : (
            <Iconify icon="mdi:qrcode" width={50} sx={{ color: 'grey.400' }} />
          )}
        </Box>

        {/* Numéro de carte */}
        <Typography
          sx={{
            fontSize: '0.55rem',
            fontWeight: 700,
            textAlign: 'right',
          }}
        >
          N° {permit?.card_number || permit?.reference}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Boutons d'action */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="mdi:eye" />}
          onClick={handlePreview}
          sx={{ fontWeight: 600 }}
        >
          Aperçu de la carte
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mdi:printer" />}
          onClick={handlePrintClick}
          sx={{ fontWeight: 600 }}
        >
          Imprimer
        </Button>
      </Stack>

      {/* Dialog de prévisualisation */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'grey.100',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Aperçu de la carte de permis
            </Typography>
            <IconButton onClick={onClose}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>

          {/* Carte 3D avec flip */}
          <Box
            sx={{
              perspective: '1500px',
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              ref={cardRef}
              sx={{
                width: '386px',
                height: '243px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
                backgroundColor: 'white',
              }}
              onClick={() => setFlipped(!flipped)}
            >
              {/* Face avant */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <CardFront />
              </Box>

              {/* Face arrière */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CardBack />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 1,
            }}
          >
            <Iconify icon="mdi:information" width={20} sx={{ color: 'info.main' }} />
            <Typography variant="body2" color="info.dark">
              Cliquez sur la carte pour la retourner et voir le verso
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Fermer
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:printer" />}
            onClick={() => {
              onClose();
              handlePrintClick();
            }}
          >
            Imprimer cette carte
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'options d'impression */}
      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)}>
        <DialogContent sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Options d'impression de la carte
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Mode d'impression
            </FormLabel>
            <RadioGroup value={printMode} onChange={(e) => setPrintMode(e.target.value)}>
              <FormControlLabel
                value="a4"
                control={<Radio />}
                label="Aperçu A4 (recto et verso sur la même page)"
              />
              <FormControlLabel
                value="duplex"
                control={<Radio />}
                label="Impression recto-verso (pour cartes réelles)"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            {printMode === 'a4' ? (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Mode Aperçu A4 :
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
                  <li>Le recto et le verso s'affichent l'un au-dessus de l'autre</li>
                  <li>Parfait pour visualiser le résultat avant impression finale</li>
                  <li>Utilisez du papier A4 standard</li>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Mode Recto-Verso :
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
                  <li>Chaque face sera imprimée sur une page séparée</li>
                  <li>Activez l'impression recto-verso dans les paramètres de votre imprimante</li>
                  <li>Utilisez des cartes vierges au format 86mm x 54mm</li>
                  <li>Le verso sera automatiquement inversé pour l'alignement</li>
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenPrintDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:printer" />}
            onClick={handleConfirmPrint}
          >
            Imprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Zone d'impression invisible (ne s'affiche qu'à l'impression) */}
      {/* <Box ref={cardRef} sx={{ display: 'none' }}>
        {printMode === 'a4' && (
          <Box className="print-instructions print-only">
            <Typography variant="h6">Carte de permis de travail - Recto et Verso</Typography>
            <Typography variant="caption" sx={{ fontSize: '8pt', mt: 1, display: 'block' }}>
              Pour impression finale, veuillez utiliser le mode "Impression recto-verso"
            </Typography>
          </Box>
        )}

        <Box className="card-face card-front" sx={{ width: '86mm', height: '54mm' }}>
          <CardFront />
        </Box>

        <Box className="card-face card-back" sx={{ width: '86mm', height: '54mm' }}>
          <CardBack />
        </Box>
      </Box> */}
    </>
  );
}
