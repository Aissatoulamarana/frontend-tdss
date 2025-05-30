'use client';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { varAlpha, stylesMode } from 'src/theme/styles';

// ----------------------------------------------------------------------

export const StyledLabel = styled(Box)(({
  theme,
  ownerState: { color = 'default', variant = 'filled' },
}) => {
  const paletteColor = theme.vars.palette[color] || {}; // Utiliser un objet vide si la couleur n'existe pas
  const greyPalette = theme.vars.palette.grey || {}; // Palette grise par défaut pour éviter les erreurs
  const textPalette = theme.vars.palette.text || {}; // Palette de texte par défaut pour les couleurs globales

  const defaultColor = {
    ...(color === 'default' && {
      /**
       * @variant filled
       */
      ...(variant === 'filled' && {
        color: textPalette.primary || '#000',
        backgroundColor: textPalette.primary || '#fff',
        [stylesMode.dark]: { color: greyPalette[800] || '#000' },
      }),
      /**
       * @variant outlined
       */
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: textPalette.primary || '#000',
        border: `2px solid ${textPalette.primary || '#000'}`,
      }),
      /**
       * @variant soft
       */
      ...(variant === 'soft' && {
        color: textPalette.secondary || '#666',
        backgroundColor: varAlpha(greyPalette['500Channel'] || '#000', 0.16),
      }),
      /**
       * @variant inverted
       */
      ...(variant === 'inverted' && {
        color: greyPalette[800] || '#000',
        backgroundColor: greyPalette[300] || '#ccc',
      }),
    }),
  };

  const styleColors = {
    ...(color !== 'default' && {
      /**
       * @variant filled
       */
      ...(variant === 'filled' && {
        color: paletteColor.contrastText || '#fff',
        backgroundColor: paletteColor.main || '#000',
      }),
      /**
       * @variant outlined
       */
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: paletteColor.main || '#000',
        border: `2px solid ${paletteColor.main || '#000'}`,
      }),
      /**
       * @variant soft
       */
      ...(variant === 'soft' && {
        color: paletteColor.dark || '#000',
        backgroundColor: varAlpha(paletteColor.mainChannel || 'rgba(0,0,0,0)', 0.16),
        [stylesMode.dark]: { color: paletteColor.light || '#fff' },
      }),
      /**
       * @variant inverted
       */
      ...(variant === 'inverted' && {
        color: paletteColor.darker || '#000',
        backgroundColor: paletteColor.lighter || '#fff',
      }),
    }),
  };

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: theme.shape.borderRadius * 0.75,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shorter,
    }),
    ...defaultColor,
    ...styleColors,
  };
});
