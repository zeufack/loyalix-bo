import { ColumnDef } from '@tanstack/react-table';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EditLoyaltyProgramRuleForm } from '@/app/(dashboard)/loyalty-program-rules/edit-loyalty-program-rule-form';
import { deleteLoyaltyProgramRule } from '@/app/api/loyalty-program-rule';
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

export const loyaltyProgramRuleColumns: ColumnDef<LoyaltyProgramRule>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'ruleName',
    header: 'Rule Name'
  },
  {
    accessorKey: 'ruleType',
    header: 'Rule Type'
  },
  {
    accessorKey: 'points',
    header: 'Points'
  },
  {
    accessorKey: 'purchaseAmount',
    header: 'Purchase Amount'
  },
  {
    accessorKey: 'loyaltyProgramId',
    header: 'Loyalty Program ID'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const loyaltyProgramRule = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dots-horizontal"><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <EditLoyaltyProgramRuleForm loyaltyProgramRule={loyaltyProgramRule} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                loyalty program rule and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteLoyaltyProgramRule(loyaltyProgramRule.id);
                  // Optionally, you can refresh the loyalty program rule list here.
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  }
];

