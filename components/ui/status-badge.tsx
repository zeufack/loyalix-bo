import { cn } from '@/lib/utils';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const TONES: Record<StatusTone, { badge: string; dot: string }> = {
  success: {
    badge: 'bg-background-success-subtle text-foreground-success',
    dot: 'bg-background-success'
  },
  warning: {
    badge: 'bg-background-warning-subtle text-foreground-warning',
    dot: 'bg-background-warning'
  },
  error: {
    badge: 'bg-background-error-subtle text-foreground-error',
    dot: 'bg-background-error'
  },
  info: {
    badge: 'bg-background-info-subtle text-foreground-info',
    dot: 'bg-background-info'
  },
  neutral: {
    badge: 'bg-muted text-muted-foreground',
    dot: 'bg-foreground-subtle'
  }
};

const STATUS_TONES: Record<string, StatusTone> = {
  active: 'success',
  succeeded: 'success',
  completed: 'success',
  earned: 'success',
  redeemed: 'success',
  approved: 'success',
  verified: 'success',
  pending: 'warning',
  draft: 'warning',
  processing: 'warning',
  scheduled: 'warning',
  failed: 'error',
  cancelled: 'error',
  canceled: 'error',
  suspended: 'error',
  expired: 'error',
  rejected: 'error',
  refunded: 'info',
  unread: 'info',
  inactive: 'neutral',
  archived: 'neutral',
  read: 'neutral'
};

export function statusTone(status: string): StatusTone {
  return STATUS_TONES[status.toLowerCase()] ?? 'neutral';
}

interface StatusBadgeProps {
  status: string;
  /** Display text; defaults to the status value. */
  label?: string;
  /** Override the tone derived from the status value. */
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({ status, label, tone, className }: StatusBadgeProps) {
  const styles = TONES[tone ?? statusTone(status)];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        styles.badge,
        className
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', styles.dot)} />
      {label ?? status}
    </span>
  );
}
