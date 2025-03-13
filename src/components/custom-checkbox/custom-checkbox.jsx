import * as React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

// Icône de base (non coché) : uniquement un contour avec fond transparent
const BpIcon = styled('span')({
    borderRadius: 3,
    width: 16,
    height: 16,
    border: '1px solid rgba(16,22,26,0.2)',
    backgroundColor: 'transparent',
});

// Icône pour le checkbox coché : se remplit avec la couleur principale du thème
const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    '&::before': {
        content: '""',
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path stroke='white' stroke-width='2' fill='none' d='M4 8l3 3 5-5'/></svg>\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
}));

// Composant BpCheckbox personnalisé
export function BpCheckbox({ inputProps, ...other }) {
    return (
        <Checkbox
            disableRipple
            color="default"
            sx={{
                '&:hover': { bgcolor: 'transparent' },
            }}
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'checkbox outlined', ...inputProps }}
            {...other}
        />
    );
}
