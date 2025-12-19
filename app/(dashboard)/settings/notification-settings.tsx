'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Mail, Bell, MessageSquare } from 'lucide-react';

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    newUserNotification: true,
    newBusinessNotification: true,
    rewardRedemptionNotification: true,
    weeklyReportEmail: true,
    marketingEmails: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Channels</h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive critical alerts via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, smsNotifications: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Event Notifications</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New User Registration</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new user signs up
              </p>
            </div>
            <Switch
              checked={settings.newUserNotification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, newUserNotification: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Business Created</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new business is registered
              </p>
            </div>
            <Switch
              checked={settings.newBusinessNotification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, newBusinessNotification: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reward Redemptions</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when rewards are redeemed
              </p>
            </div>
            <Switch
              checked={settings.rewardRedemptionNotification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, rewardRedemptionNotification: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Reports & Marketing</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Report Email</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary report
              </p>
            </div>
            <Switch
              checked={settings.weeklyReportEmail}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, weeklyReportEmail: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive product updates and offers
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, marketingEmails: checked })
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
