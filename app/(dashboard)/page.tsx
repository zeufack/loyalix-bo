import { DashboardStats } from './components/dashboard-stats';
import { AnalyticsCharts } from './components/analytics-charts';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Loyalix Admin Panel. Monitor and manage your loyalty platform.
        </p>
      </div>
      <DashboardStats />
      <AnalyticsCharts />
    </div>
  );
}
