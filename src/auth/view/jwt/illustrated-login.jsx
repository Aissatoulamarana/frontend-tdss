// illustrated-login.tsx
import { styled } from '@mui/material/styles';

const SVG = styled('svg')(({ theme }) => ({
    stroke: theme.palette.primary.main,
    fill: 'none',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
}));

export default function IllustratedLogin({ strokeColor, ...props }) {
    return (
        <SVG {...props} viewBox="0 0 100 100">
            <path d="M20,50 Q40,30 60,50 T100,50" />
            <circle cx="50" cy="50" r="15" />
            <path d="M30,70 L50,85 L70,70" />
        </SVG>
    );
}