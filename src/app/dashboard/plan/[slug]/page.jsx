import { CONFIG } from 'src/config-global';
import { AfricanizationPlanDetails } from 'src/sections/overview/plan-africanisation/view';

export const metadata = { title: `Detail de plan de panafricanisation | -${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;
  return <AfricanizationPlanDetails slug={slug} />;
}
