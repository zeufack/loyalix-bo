'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBusinessStaff,
  inviteStaff,
  removeStaff,
  StaffMember
} from '@/app/api/business-staff';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Trash2, UserPlus, Crown } from 'lucide-react';

export default function BusinessStaffView() {
  const [businessId, setBusinessId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: staff,
    isLoading,
    error
  } = useQuery({
    queryKey: ['businessStaff', searchId],
    queryFn: () => getBusinessStaff(searchId),
    enabled: !!searchId
  });

  const handleSearch = () => {
    if (businessId) setSearchId(businessId);
  };

  const handleInvite = async () => {
    if (!searchId || !inviteEmail) return;
    setInviting(true);
    try {
      await inviteStaff(searchId, { email: inviteEmail });
      toast.success('Staff member invited');
      queryClient.invalidateQueries({ queryKey: ['businessStaff', searchId] });
      setInviteEmail('');
    } catch (error) {
      toast.error('Failed to invite staff member');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (staffId: string) => {
    if (!searchId) return;
    try {
      await removeStaff(searchId, staffId);
      toast.success('Staff member removed');
      queryClient.invalidateQueries({ queryKey: ['businessStaff', searchId] });
    } catch (error) {
      toast.error('Failed to remove staff member');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Staff Management</CardTitle>
        <CardDescription>
          View and manage staff members for a business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter Business ID..."
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {searchId && (
          <div className="flex gap-2 mb-6 items-end">
            <div className="grid gap-2 flex-1 max-w-md">
              <Label>Invite Staff Member</Label>
              <Input
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
              <UserPlus className="h-4 w-4 mr-2" />
              {inviting ? 'Inviting...' : 'Invite'}
            </Button>
          </div>
        )}

        {isLoading ? (
          <TableSkeleton columns={5} rows={5} />
        ) : error ? (
          <div className="text-center py-10 text-destructive">
            Failed to load staff members
          </div>
        ) : !searchId ? (
          <div className="text-center py-10 text-muted-foreground">
            Enter a Business ID to view staff members
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Roles</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff?.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {member.isOwner && (
                          <Crown className="h-4 w-4 text-amber-500" />
                        )}
                        {member.firstName} {member.lastName}
                      </div>
                    </td>
                    <td className="p-3">{member.email}</td>
                    <td className="p-3">
                      {member.isOwner ? (
                        <Badge>Owner</Badge>
                      ) : (
                        <Badge variant="secondary">Staff</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {member.roles?.map((role) => (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemove(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!staff || staff.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No staff members found for this business
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
