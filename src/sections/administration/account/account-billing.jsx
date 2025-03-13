import { Grid22 } from '@mui/material';

import { AccountBillingPlan } from './account-billing-plan';
import { AccountBillingPayment } from './account-billing-payment';
import { AccountBillingHistory } from './account-billing-history';
import { AccountBillingAddress } from './account-billing-address';

// ----------------------------------------------------------------------

export function AccountBilling({ cards, plans, invoices, addressBook }) {
  return (
    <Grid2 container spacing={5} disableEqualOverflow>
      <Grid2 xs={12} md={8}>
        <AccountBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />

        <AccountBillingPayment cards={cards} />

        <AccountBillingAddress addressBook={addressBook} />
      </Grid2>

      <Grid2 xs={12} md={4}>
        <AccountBillingHistory invoices={invoices} />
      </Grid2>
    </Grid2>
  );
}
