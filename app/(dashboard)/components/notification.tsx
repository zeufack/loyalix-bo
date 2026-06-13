'use client';

import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} from '@/app/api/notification';
import { BellIcon, CheckCheck, Loader2 } from 'lucide-react';
import { useEventSource, SseEvent } from '@/hooks/useEventSource';
import { toast } from 'sonner';

export function Notifications() {
  const queryClient = useQueryClient();
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 60000 // Fallback: poll every 60s
  });

  // Fetch recent notifications for the dropdown
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: () => getNotifications({ page: 1, limit: 5, sortOrder: 'desc' }),
    refetchInterval: 60000
  });

  const notifications = notificationsData?.data ?? [];

  // SSE real-time event handler
  const handleSseEvent = useCallback(
    (event: SseEvent) => {
      if (event.type === 'notification') {
        // Invalidate notification queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        // Show a toast for the new notification
        const data = event.data as { title?: string; message?: string };
        toast.info(data.title || 'New Notification', {
          description: data.message
        });
      }

      // Also refresh for activity-related events
      if (
        event.type === 'reward_earned' ||
        event.type === 'payment_received' ||
        event.type === 'customer_enrolled'
      ) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
    [queryClient]
  );

  // Connect to SSE stream
  const { isConnected } = useEventSource({
    onEvent: handleSseEvent,
    onError: (error) => {
      console.warn('SSE connection error:', error.message);
    }
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      // silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {isConnected && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs text-muted-foreground"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
            >
              {markingAll ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <CheckCheck className="h-3 w-3 mr-1" />
              )}
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start gap-1 cursor-pointer ${
                !notification.isRead ? 'bg-muted/50' : ''
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-center gap-2 w-full">
                {!notification.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
                <span className="font-medium text-sm truncate">
                  {notification.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-2 pl-4">
                {notification.message}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
