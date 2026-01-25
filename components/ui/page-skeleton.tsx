'use client';

import { Skeleton } from './skeleton';
import {
  TableSkeleton,
  FormSkeleton,
  StatsSkeleton,
  ChartSkeleton
} from './table-skeleton';

interface PageSkeletonProps {
  variant?: 'table' | 'form' | 'dashboard' | 'detail';
  title?: boolean;
  tabs?: boolean;
}

export function PageSkeleton({
  variant = 'table',
  title = true,
  tabs = true
}: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {/* Tabs skeleton */}
      {tabs && (
        <div className="flex items-center gap-4 border-b pb-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}

      {/* Content skeleton based on variant */}
      {variant === 'table' && <TablePageContent />}
      {variant === 'form' && <FormSkeleton fields={6} />}
      {variant === 'dashboard' && <DashboardPageContent />}
      {variant === 'detail' && <DetailPageContent />}
    </div>
  );
}

function TablePageContent() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-64" /> {/* Search */}
          <Skeleton className="h-10 w-24" /> {/* Filter */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" /> {/* Export */}
          <Skeleton className="h-10 w-32" /> {/* Add button */}
        </div>
      </div>

      {/* Table skeleton */}
      <TableSkeleton columns={6} rows={10} />

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

function DashboardPageContent() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <StatsSkeleton count={4} />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton height={300} />
        <ChartSkeleton height={300} />
      </div>

      {/* Recent activity table */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <TableSkeleton columns={4} rows={5} />
      </div>
    </div>
  );
}

function DetailPageContent() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
