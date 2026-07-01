'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoyaltyProgramTemplate } from '@/types/loyalty-program-template';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  PowerOff,
  Rocket
} from 'lucide-react';
import { formatSlugLabel, getLucideIcon } from '@/lib/utils';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  deleteLoyaltyProgramTemplate,
  updateLoyaltyProgramTemplate
} from '@/app/api/loyalty-program-templates';
import { ViewLoyaltyProgramTemplate } from '@/app/(dashboard)/loyalty-program-templates/view-loyalty-program-template';
import { InstantiateLoyaltyProgramTemplate } from '@/app/(dashboard)/loyalty-program-templates/instantiate-loyalty-program-template';
import { EditLoyaltyProgramTemplateForm } from '@/app/(dashboard)/loyalty-program-templates/edit-loyalty-program-template-form';

const ActionsCell = ({ template }: { template: LoyaltyProgramTemplate }) => {
  const queryClient = useQueryClient();
  const [viewOpen, setViewOpen] = useState(false);
  const [instantiateOpen, setInstantiateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['loyalty-program-templates'] });

  const handleDelete = async () => {
    try {
      await deleteLoyaltyProgramTemplate(template.id);
      invalidate();
      toast.success(
        'Template deleted. Existing business programs are unaffected.'
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateLoyaltyProgramTemplate(template.id, {
        isActive: !template.isActive
      });
      invalidate();
      toast.success(
        template.isActive ? 'Template deactivated' : 'Template activated'
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <>
      {/* modal={false}: the menu must not manage body pointer-events, otherwise
          its cleanup races with the dialogs opened from its items and can leave
          the page frozen (pointer-events: none). */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {template.isActive && (
            <DropdownMenuItem onSelect={() => setInstantiateOpen(true)}>
              <Rocket className="mr-2 h-4 w-4" />
              Use Template
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive}>
            {template.isActive ? (
              <PowerOff className="mr-2 h-4 w-4" />
            ) : (
              <Power className="mr-2 h-4 w-4" />
            )}
            {template.isActive ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewLoyaltyProgramTemplate
        template={template}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <InstantiateLoyaltyProgramTemplate
        template={template}
        open={instantiateOpen}
        onOpenChange={setInstantiateOpen}
      />
      <EditLoyaltyProgramTemplateForm
        template={template}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template &quot;{template.name}
              &quot;. Loyalty programs already instantiated from it are
              independent snapshots and will not be affected.
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

export const loyaltyProgramTemplateColumns: ColumnDef<LoyaltyProgramTemplate>[] =
  [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const template = row.original;
        const TemplateIcon = getLucideIcon(template.icon);
        return (
          <div className="flex items-center gap-2">
            <TemplateIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{template.name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.key}
        </span>
      )
    },
    {
      accessorKey: 'recommendedBusinessTypes',
      header: 'Recommended For',
      cell: ({ row }) => {
        const types = row.original.recommendedBusinessTypes;
        if (!types || types.length === 0) {
          return <Badge variant="secondary">Universal</Badge>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {types.map((type) => (
              <Badge key={type} variant="secondary">
                {formatSlugLabel(type)}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      id: 'rulesCount',
      header: 'Rules',
      cell: ({ row }) => row.original.rules.length
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const template = row.original;
        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant={template.isActive ? 'default' : 'secondary'}>
              {template.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {template.isFeatured && <Badge variant="outline">Featured</Badge>}
          </div>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <ActionsCell template={row.original} />
    }
  ];
