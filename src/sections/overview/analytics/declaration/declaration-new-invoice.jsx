import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TablePaginationCustom, TableEmptyRows, TableNoData } from 'src/components/table';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { fCurrency, fGNF } from 'src/utils/format-number';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { fDateTime } from 'src/utils/format-time';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export function DeclarationNew({
  title,
  subheader,
  tableData,
  headLabel,
  loading,
  table,
  totalCount,
  notFound,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402 }}>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
          <TableHeadCustom headLabel={headLabel} />
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={100}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      py: 6,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {tableData.map((row, index) => (
                <RowItem key={`${row.number}-${index}`} row={row} />
              ))}
              {tableData.length > 0 && tableData.length < table.rowsPerPage && (
                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={table.rowsPerPage - tableData.length}
                />
              )}
              <TableNoData notFound={notFound} />
            </TableBody>
          )}
        </Table>
      </Scrollbar>
      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={totalCount}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

function RowItem({ row }) {
  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.slug);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.slug);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.slug);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.slug);
  };

  const getLabelStatus = (status) => {
    switch (status) {
      case 'unsubmitted':
        return 'Non Soumise';
      case 'rejected':
        return 'Rejetée';
      case 'submitted':
        return 'Soumise';
      case 'validated':
        return 'Validée';
      case 'billed':
        return 'Facturée';
      case 'unpaid':
        return 'Non Payée';
      case 'paid':
        return 'Payée';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow>
        {row?.number && <TableCell>{row.number}</TableCell>}

        {row?.company && <TableCell>{row?.company}</TableCell>}
        {row?.client && <TableCell>{row?.client}</TableCell>}
        {row?.nber_declarations && <TableCell>{row?.nber_declarations}</TableCell>}
        {row?.amount && <TableCell>{fGNF(row?.amount)}</TableCell>}

        {row?.nber_employees && <TableCell>{row?.nber_employees}</TableCell>}
        <TableCell>{fDateTime(row?.created_on)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'unsubmitted' && 'warning') ||
              (row.status === 'rejected' && 'error') ||
              (row?.status === 'submitted' && 'primary') ||
              (row?.status === 'validated' && 'success') ||
              (row?.status === 'billed' && 'success') ||
              (row?.status === 'unpaid' && 'warning') ||
              (row?.status === 'paid' && 'success')
            }
          >
            {getLabelStatus(row.status)}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}
