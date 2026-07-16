'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Smartphone, Save, CheckCircle } from 'lucide-react';

interface NotifPref {
  type: string;
  isEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

const NOTIFICATION_TYPES = [
  { type: 'GOAL', label: 'Goals', description: 'Get notified when goals are scored' },
  { type: 'WICKET', label: 'Wickets', description: 'Get notified when wickets fall in cricket' },
  { type: 'MATCH_START', label: 'Match Start', description: 'Notify when matches you follow begin' },
  { type: 'MATCH_END', label: 'Match End', description: 'Notify when matches you follow end' },
  { type: 'BREAKING_NEWS', label: 'Breaking News', description: 'Important sports news and transfers' },
  { type: 'TRANSFER', label: 'Transfers', description: 'Player transfer rumors and confirmations' },
  { type: 'CUSTOM', label: 'Custom Alerts', description: 'Personalized alerts you set up' },
];

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<Record<string, NotifPref>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/v1/notifications/preferences');
      const data = await res.json();
      if (data.success && data.data) {
        const prefsMap: Record<string, NotifPref> = {};
        NOTIFICATION_TYPES.forEach((t) => {
          const existing = data.data.find((p: NotifPref) => p.type === t.type);
          prefsMap[t.type] = existing || { type: t.type, isEnabled: true, emailEnabled: false, pushEnabled: true };
        });
        setPreferences(prefsMap);
      } else {
        const defaultPrefs: Record<string, NotifPref> = {};
        NOTIFICATION_TYPES.forEach((t) => {
          defaultPrefs[t.type] = { type: t.type, isEnabled: true, emailEnabled: false, pushEnabled: true };
        });
        setPreferences(defaultPrefs);
      }
    } catch {
      const defaultPrefs: Record<string, NotifPref> = {};
      NOTIFICATION_TYPES.forEach((t) => {
        defaultPrefs[t.type] = { type: t.type, isEnabled: true, emailEnabled: false, pushEnabled: true };
      });
      setPreferences(defaultPrefs);
    } finally {
      setLoading(false);
    }
  };

  const updatePref = (type: string, field: keyof NotifPref, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const prefs = Object.values(preferences);
      const res = await fetch('/api/v1/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-8 bg-muted rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notification Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Control how and when you receive notifications.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saved ? (
            <><CheckCircle className="h-4 w-4 mr-2" />Saved!</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}</>
          )}
        </Button>
      </div>

      {/* Global Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Master controls for all notification types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
            </div>
            <Switch
              checked={Object.values(preferences).every((p) => p.pushEnabled)}
              onCheckedChange={(checked) => {
                const updated = { ...preferences };
                Object.keys(updated).forEach((k) => { updated[k] = { ...updated[k], pushEnabled: checked }; });
                setPreferences(updated);
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email digests and alerts</p>
              </div>
            </div>
            <Switch
              checked={Object.values(preferences).every((p) => p.emailEnabled)}
              onCheckedChange={(checked) => {
                const updated = { ...preferences };
                Object.keys(updated).forEach((k) => { updated[k] = { ...updated[k], emailEnabled: checked }; });
                setPreferences(updated);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Per-Type Controls */}
      <div className="space-y-4">
        {NOTIFICATION_TYPES.map((notifType) => {
          const pref = preferences[notifType.type];
          if (!pref) return null;
          return (
            <Card key={notifType.type}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notifType.label}</p>
                      {!pref.isEnabled && <Badge variant="secondary">Disabled</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{notifType.description}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Smartphone className="h-4 w-4" />
                      <Switch
                        checked={pref.pushEnabled}
                        onCheckedChange={(checked) => updatePref(pref.type, 'pushEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <Switch
                        checked={pref.emailEnabled}
                        onCheckedChange={(checked) => updatePref(pref.type, 'emailEnabled', checked)}
                      />
                    </div>
                    <Switch
                      checked={pref.isEnabled}
                      onCheckedChange={(checked) => updatePref(pref.type, 'isEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
