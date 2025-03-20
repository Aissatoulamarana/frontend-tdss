import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { memo } from 'react';
import { CONFIG } from 'src/config-global';

import { BackgroundShape } from './background-shape';

function PageAttenteIllustration({ hideBackground, sx, ...other }) {
  const theme = useTheme();

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 320, maxWidth: 1, flexShrink: 0, height: 'auto', ...sx }}
      {...other}
    >
      {!hideBackground && <BackgroundShape />}

      <image
        href={`${CONFIG.assetsDir}/assets/illustrations/characters/character-11.webp`}
        height="300"
        x="205"
        y="30"
      />
    </Box>
  );
}

export default memo(PageAttenteIllustration);
