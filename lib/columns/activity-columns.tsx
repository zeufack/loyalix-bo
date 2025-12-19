'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Activity } from '@/types/activity';
import { Badge } from '@/components/ui/badge';
import {
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash,
  Eye,
  Gift,
  QrCode,
  Activity as ActivityIcon
} from 'lucide-react';

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    LOGIN: <LogIn className="h-4 w-4" />,
    LOGOUT: <LogOut className="h-4 w-4" />,
    REGISTER: <UserPlus className="h-4 w-4" />,
    CREATE: <UserPlus className="h-4 w-4" />,
    UPDATE: <Edit className="h-4 w-4" />,
    DELETE: <Trash className="h-4 w-4" />,
    VIEW: <Eye className="h-4 w-4" />,
    REWARD_EARNED: <Gift className="h-4 w-4" />,
    QR_SCAN: <QrCode className="h-4 w-4" />
  };
  return iconMap[type?.toUpperCase()] || <ActivityIcon className="h-4 w-4" />;
};

const getActivityColor = (type: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const colorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    LOGIN: 'default',
    LOGOUT: 'secondary',
    CREATE: 'default',
    UPDATE: 'outline',
    DELETE: 'destructive',
    REWARD_EARNED: 'default'
  };
  return colorMap[type?.toUpperCase()] || 'secondary';
};

export const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'type',
    header: 'Activity',
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant={getActivityColor(type)} className="gap-1">
          {getActivityIcon(type)}
          {type?.replace(/_/g, ' ') || 'Unknown'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'userId',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original.user;
      const userId = row.original.userId;
      if (user) {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return (
          <div>
            <div className="font-medium">{name || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        );
      }
      return (
        <span className="font-mono text-xs">{userId?.slice(0, 8)}...</span>
      );
    }
  },
  {
    accessorKey: 'metadata',
    header: 'Details',
    cell: ({ row }) => {
      const metadata = row.original.metadata;
      if (!metadata || Object.keys(metadata).length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      const details = Object.entries(metadata)
        .slice(0, 2)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return (
        <span className="text-xs text-muted-foreground max-w-[200px] truncate block">
          {details}
        </span>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return '-';
      const now = new Date();
      const activityDate = new Date(date);
      const diffMs = now.getTime() - activityDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) {
        return <span className="text-xs">Just now</span>;
      } else if (diffHours < 24) {
        return <span className="text-xs">{diffHours}h ago</span>;
      } else if (diffDays < 7) {
        return <span className="text-xs">{diffDays}d ago</span>;
      }
      return (
        <span className="text-xs">
          {activityDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
          })}
        </span>
      );
    }
  }
];
