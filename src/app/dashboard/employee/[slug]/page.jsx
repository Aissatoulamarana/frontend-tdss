// /src/app/dashboard/user/[id]/page.jsx
import { CONFIG } from 'src/config-global';

import { EmployeeDetailsView } from 'src/sections/overview/employee/view';

export const metadata = { title: `Details Employé | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;
  return <EmployeeDetailsView slug={slug} />;
}
