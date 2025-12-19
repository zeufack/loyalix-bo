'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CustomerProgress } from '@/types/customer-progress.type';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

const ProgressBar = ({
  current,
  threshold
}: {
  current: number;
  threshold: number;
}) => {
  const percentage = Math.min((current / threshold) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>{current}</span>
        <span className="text-muted-foreground">/ {threshold}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const customerProgressColumns: ColumnDef<CustomerProgress>[] = [
  {
    accessorKey: 'enrollmentId',
    header: 'Enrollment',
    cell: ({ row }) => {
      const enrollmentId = row.original.enrollmentId;
      return (
        <span className="font-mono text-xs">
          {enrollmentId?.slice(0, 8)}...
        </span>
      );
    }
  },
  {
    accessorKey: 'ruleId',
    header: 'Rule',
    cell: ({ row }) => {
      const rule = row.original.rule;
      const ruleId = row.original.ruleId;
      return (
        <div>
          <span className="font-mono text-xs">
            {ruleId?.slice(0, 8)}...
          </span>
          {rule?.rewardDescription && (
            <div className="text-xs text-muted-foreground mt-1">
              {rule.rewardDescription}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'currentValue',
    header: 'Progress',
    cell: ({ row }) => {
      const currentValue = row.original.currentValue;
      const threshold = row.original.rule?.thresholdValue || 100;
      return <ProgressBar current={currentValue} threshold={threshold} />;
    }
  },
  {
    accessorKey: 'isComplete',
    header: 'Status',
    cell: ({ row }) => {
      const isComplete = row.original.isComplete;
      return isComplete ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Complete
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      );
    }
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.original.lastUpdated;
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
];
