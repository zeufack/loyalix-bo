'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getActivities } from '@/app/api/activity';

export function RecentActivity() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => getActivities({ page: 1, limit: 6, sortOrder: 'desc' })
  });

  const activities = data?.data ?? [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent activity</CardTitle>
        <Link
          href="/activities"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-4 pt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="pt-8 text-center text-sm text-muted-foreground">
            Couldn&apos;t load recent activity.
          </p>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pt-8 text-center">
            <ActivityIcon className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3 py-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user
                      ? `${activity.user.firstName} ${activity.user.lastName} · `
                      : ''}
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
