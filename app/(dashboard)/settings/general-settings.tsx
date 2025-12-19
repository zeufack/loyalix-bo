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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export function GeneralSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'Loyalix',
    supportEmail: 'support@loyalix.com',
    maxBusinessesPerUser: '5',
    defaultPointsExpiry: '365',
    enablePublicSignup: true,
    maintenanceMode: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure general platform settings and defaults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={settings.platformName}
              onChange={(e) =>
                setSettings({ ...settings, platformName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxBusinesses">Max Businesses per User</Label>
            <Input
              id="maxBusinesses"
              type="number"
              value={settings.maxBusinessesPerUser}
              onChange={(e) =>
                setSettings({ ...settings, maxBusinessesPerUser: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of businesses a user can create
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pointsExpiry">Default Points Expiry (days)</Label>
            <Input
              id="pointsExpiry"
              type="number"
              value={settings.defaultPointsExpiry}
              onChange={(e) =>
                setSettings({ ...settings, defaultPointsExpiry: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Default expiry period for loyalty points
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Public Signup</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to register on the platform
              </p>
            </div>
            <Switch
              checked={settings.enablePublicSignup}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enablePublicSignup: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Put the platform in maintenance mode
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
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
