'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RewardEarned } from '@/types/rewards-earned';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteRewardEarned, redeemReward } from '@/app/api/rewards-earned';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Gift, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
  > = {
    pending: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
    earned: { variant: 'default', icon: <Gift className="h-3 w-3" /> },
    redeemed: { variant: 'outline', icon: <CheckCircle className="h-3 w-3" /> },
    expired: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
  };
  const config = statusConfig[status] || { variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> };
  return (
    <Badge variant={config.variant} className="gap-1 capitalize">
      {config.icon}
      {status}
    </Badge>
  );
};

const ActionsCell = ({ reward }: { reward: RewardEarned }) => {
  const queryClient = useQueryClient();
  const [redeemOpen, setRedeemOpen] = useState(false);

  const handleDelete = async () => {
    await deleteRewardEarned(reward.id);
    queryClient.invalidateQueries({ queryKey: ['rewards-earned'] });
  };

  const handleRedeem = async () => {
    await redeemReward(reward.id);
    queryClient.invalidateQueries({ queryKey: ['rewards-earned'] });
    setRedeemOpen(false);
  };

  const canRedeem = reward.status === 'earned' || reward.status === 'pending';

  return (
    <>
      <AlertDialog>
        <AlertDialog open={redeemOpen} onOpenChange={setRedeemOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Redeem Reward?</AlertDialogTitle>
              <AlertDialogDescription>
                Mark this reward as redeemed. The customer should receive their reward.
                <br />
                <strong>Redemption Code:</strong> {reward.redemptionCode}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRedeem}>Redeem</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(reward.redemptionCode)}
            >
              Copy Redemption Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {canRedeem && (
              <DropdownMenuItem onClick={() => setRedeemOpen(true)}>
                Mark as Redeemed
              </DropdownMenuItem>
            )}
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this reward record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const rewardsEarnedColumns: ColumnDef<RewardEarned>[] = [
  {
    accessorKey: 'redemptionCode',
    header: 'Redemption Code',
    cell: ({ row }) => {
      const code = row.original.redemptionCode;
      return (
        <span className="font-mono text-sm font-medium">{code}</span>
      );
    }
  },
  {
    accessorKey: 'enrollment',
    header: 'Customer',
    cell: ({ row }) => {
      const enrollment = row.original.enrollment;
      if (!enrollment?.customer?.user) {
        return <span className="text-muted-foreground">-</span>;
      }
      const user = enrollment.customer.user;
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return (
        <div>
          <div className="font-medium">{name || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'rule',
    header: 'Reward',
    cell: ({ row }) => {
      const rule = row.original.rule;
      const details = row.original.rewardDetails;
      return (
        <div>
          <div className="font-medium">
            {rule?.rewardDescription || details?.description || 'Reward'}
          </div>
          {rule?.rewardValue && (
            <div className="text-xs text-muted-foreground">
              Value: {rule.rewardValue}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.original.status)
  },
  {
    accessorKey: 'earnedAt',
    header: 'Earned',
    cell: ({ row }) => {
      const date = row.original.earnedAt;
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    cell: ({ row }) => {
      const date = row.original.expiresAt;
      if (!date) return <span className="text-muted-foreground">Never</span>;
      const expiryDate = new Date(date);
      const isExpired = expiryDate < new Date();
      return (
        <span className={isExpired ? 'text-destructive' : ''}>
          {expiryDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell reward={row.original} />
  }
];
