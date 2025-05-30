import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export function TableEmptyRows({ emptyRows, height }) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow sx={{ ...(height && { height: height * emptyRows }) }}>
      <TableCell colSpan={9} />
    </TableRow>
  );
}
