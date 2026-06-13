import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Gift, CreditCard } from 'lucide-react';

const scheduledTasks = [
  {
    name: 'Token Cleanup',
    description: 'Remove expired refresh tokens from database',
    schedule: 'Every hour',
    icon: Trash2,
    status: 'active'
  },
  {
    name: 'Expired Rewards Cleanup',
    description: 'Mark overdue rewards as expired',
    schedule: 'Daily at midnight',
    icon: Gift,
    status: 'active'
  },
  {
    name: 'Expired Trial Check',
    description: 'Downgrade expired trial subscriptions to free plan',
    schedule: 'Every hour',
    icon: Clock,
    status: 'active'
  },
  {
    name: 'Past-Due Subscription Check',
    description: 'Downgrade subscriptions overdue > 7 days to free plan',
    schedule: 'Daily at 1:00 AM',
    icon: CreditCard,
    status: 'active'
  }
];

export default async function ScheduledTasksPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
          <CardDescription>
            Background tasks running on the platform (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Task</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">Schedule</th>
                  <th className="p-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledTasks.map((task) => (
                  <tr key={task.name} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <task.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{task.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {task.description}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{task.schedule}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
