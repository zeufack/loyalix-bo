import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Fragment } from 'react';

type ActionItem = {
  label: string;
  action: (data: T) => void;
  separatorBefore?: boolean;
};

export const createActionsColumn = <T,>(
  actions: ActionItem[],
  options?: {
    enableSorting?: boolean;
    enableHiding?: boolean;
  }
): ColumnDef<T> => ({
  id: 'actions',
  header: () => <span className="sr-only">Actions</span>,
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((item, index) => (
          <Fragment key={index}>
            {item.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => item.action(row.original)}>
              {item.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  enableSorting: options?.enableSorting ?? false,
  enableHiding: options?.enableHiding ?? false
});
