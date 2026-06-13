import { DashboardStats, CatalogGlance } from './components/dashboard-stats';
import { AnalyticsCharts } from './components/analytics-charts';
import { RecentActivity } from './components/recent-activity';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <DashboardStats />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsCharts />
        </div>
        <RecentActivity />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <CatalogGlance />
      </div>
    </div>
  );
}
