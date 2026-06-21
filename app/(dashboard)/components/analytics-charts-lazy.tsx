'use client';

import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Fallback shown while the recharts-backed chart chunk loads. Mirrors the
 * Card + 300px skeleton the chart itself renders during data loading so there
 * is no layout shift.
 */
function ChartFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform breakdown</CardTitle>
        <CardDescription>
          Current totals across the main platform entities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

/**
 * Recharts is a large dependency that isn't needed for first paint of the
 * dashboard. Load it client-side only, after hydration, behind a skeleton.
 */
const AnalyticsChartsInner = dynamic(
  () => import('./analytics-charts').then((m) => m.AnalyticsCharts),
  { ssr: false, loading: () => <ChartFallback /> }
);

export function AnalyticsCharts() {
  return <AnalyticsChartsInner />;
}
