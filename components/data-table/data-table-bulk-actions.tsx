'use client';

import { Table, ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';

export interface BulkAction<TData> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onClick: (selectedRows: TData[]) => Promise<void>;
  requireConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
  actions: BulkAction<TData>[];
  onActionComplete?: () => void;
}

export function DataTableBulkActions<TData>({
  table,
  actions,
  onActionComplete
}: DataTableBulkActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction<TData> | null>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  if (selectedCount === 0) return null;

  const handleAction = async (action: BulkAction<TData>) => {
    if (action.requireConfirmation) {
      setPendingAction(action);
      return;
    }
    await executeAction(action);
  };

  const executeAction = async (action: BulkAction<TData>) => {
    setIsLoading(true);
    try {
      await action.onClick(selectedRows.map((row) => row.original));
      table.resetRowSelection();
      onActionComplete?.();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
        <div className="h-4 w-px bg-border" />

        {actions.length === 1 ? (
          <Button
            variant={actions[0].variant === 'destructive' ? 'destructive' : 'secondary'}
            size="sm"
            onClick={() => handleAction(actions[0])}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              actions[0].icon
            )}
            {actions[0].label}
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                )}
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleAction(action)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetRowSelection()}
          className="ml-auto"
        >
          Clear selection
        </Button>
      </div>

      <AlertDialog open={!!pendingAction} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.confirmTitle || 'Confirm Action'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.confirmDescription ||
                `Are you sure you want to perform this action on ${selectedCount} item(s)?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingAction && executeAction(pendingAction)}
              className={pendingAction?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Helper to create a select column for bulk actions
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  };
}
