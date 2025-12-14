'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Channel } from '@/types';
import { TimePicker } from '@/components/time-picker';
import { parseISO, format } from "date-fns"
import { getApiUrl } from '@/lib/utils';
import { AuthGuard } from '@/components/auth-guard';

function SettingsPageContent() {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twitterChannel, setTwitterChannel] = useState<Channel | null>(null);

  const defaultTwitterChannel: Channel = {
    id: '',
    type: 'twitter',
    name: 'Twitter',
    isActive: true,
    keys: {
      apiKey: '',
      apiSecret: '',
      accessToken: '',
      accessTokenSecret: '',
    },
    configuration: {
      startTime: '',
      endTime: '',
      timeBetweenPosts: 60,
      maxPostsPerDay: 5,
      timezone: 'UTC',
    },
  };

  const loadChannels = async () => {
    try {
      const response = await fetch(getApiUrl('/channels'));
      if (!response.ok) throw new Error('Failed to fetch channels');

      const channels: Channel[] = await response.json();
      const twitter = channels.find((ch) => ch.type === 'twitter');

      if (twitter) {
        // Ensure configuration exists and map settings to keys for frontend
        setTwitterChannel({
          ...twitter,
          keys: twitter.keys || {},
          configuration: twitter.configuration || {},
        });
      } else {
        setTwitterChannel(defaultTwitterChannel);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
      toast.error('Failed to load channels');
      setTwitterChannel(defaultTwitterChannel);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const saveSettings = async () => {
    if (!twitterChannel) {
      toast.error('Twitter channel configuration is missing');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type: 'twitter' as const,
        name: 'Twitter',
        keys: twitterChannel.keys,
        configuration: twitterChannel.configuration,
      };

      let response;
      if (twitterChannel.id) {
        // Update existing
        response = await fetch('/api/channels', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: twitterChannel.id,
            settings: twitterChannel.keys,
            configuration: twitterChannel.configuration,
          }),
        });
      } else {
        // Create new
        response = await fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'twitter',
            name: 'Twitter',
            settings: twitterChannel.keys,
            configuration: twitterChannel.configuration,
          }),
        });

        if (response.ok) {
          const newChannel = await response.json();
          setTwitterChannel((prev) =>
            prev ? { ...prev, id: newChannel.id } : null
          );
        }
      }

      if (response?.ok) {
        toast.success('Twitter channel settings saved successfully!');
        await loadChannels(); // Refresh to get latest state
      } else {
        const error = await response?.text();
        throw new Error(error || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save Twitter settings');
    } finally {
      setSaving(false);
    }
  };

  const updateKeys = (field: keyof Channel['keys'], value: string) => {
    setTwitterChannel((prev) =>
      prev ? { ...prev, keys: { ...prev.keys, [field]: value } } : prev
    );
  };

  const updateConfig = <K extends keyof NonNullable<Channel['configuration']>>(
    field: K,
    value: NonNullable<Channel['configuration']>[K]
  ) => {
    setTwitterChannel((prev) =>
      prev
        ? {
          ...prev,
          configuration: {
            ...(prev.configuration || {}),
            [field]: value,
          },
        }
        : prev
    );
  };


  const timeStringToDate = (time: string): Date | undefined => {
    if (!time) return undefined
    const [hours, minutes] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  // Helper to convert Date → "14:30"
  const dateToTimeString = (date?: Date): string => {
    return date ? format(date, "HH:mm") : ""
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64FFDA]"></div>
        </div>
      </AuthGuard>
    );
  }

  if (!twitterChannel) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-500">Failed to load Twitter channel.</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#E0E0E0] glow">Twitter Channel Settings</h1>
        </div>

        <div className="mb-6">
          <p className="text-[#E0E0E0]/70">
            Configure your Twitter (X) API credentials and posting schedule
          </p>
        </div>

      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#E0E0E0] glow">API Credentials</h2>
        </div>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="xxxxxxxxxxxxxxxx"
                value={twitterChannel.keys.apiKey}
                onChange={(e) => updateKeys('apiKey', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret Key</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="xxxxxxxxxxxxxxxx"
                value={twitterChannel.keys.apiSecret}
                onChange={(e) => updateKeys('apiSecret', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-token">Access Token</Label>
              <Input
                id="access-token"
                type="password"
                placeholder="xxxxxxxxxxxxxxxx"
                value={twitterChannel.keys.accessToken}
                onChange={(e) => updateKeys('accessToken', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-token-secret">Access Token Secret</Label>
              <Input
                id="access-token-secret"
                type="password"
                placeholder="xxxxxxxxxxxxxxxx"
                value={twitterChannel.keys.accessTokenSecret}
                onChange={(e) => updateKeys('accessTokenSecret', e.target.value)}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-[#E0E0E0] mb-6 glow">Posting Schedule</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label>Daily Start Time</Label>
                <TimePicker
                  date={timeStringToDate(twitterChannel.configuration?.startTime ?? "")}
                  setDate={(date: Date | undefined) => {
                    updateConfig("startTime", date ? dateToTimeString(date) : "")
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Daily End Time</Label>
                <TimePicker
                  date={timeStringToDate(twitterChannel.configuration?.endTime ?? "")}
                  setDate={(date: Date | undefined) => {
                    updateConfig("endTime", date ? dateToTimeString(date) : "")
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="time-between-posts">Min Time Between Posts (minutes)</Label>
                <Input
                  id="time-between-posts"
                  type="number"
                  min="1"
                  value={twitterChannel.configuration?.timeBetweenPosts || ''}
                  onChange={(e) => updateConfig('timeBetweenPosts', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-posts-per-day">Max Posts Per Day</Label>
                <Input
                  id="max-posts-per-day"
                  type="number"
                  min="1"
                  value={twitterChannel.configuration?.maxPostsPerDay || ''}
                  onChange={(e) => updateConfig('maxPostsPerDay', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="mt-4 max-w-md">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="e.g. America/New_York, UTC"
                value={twitterChannel.configuration?.timezone || ''}
                onChange={(e) => updateConfig('timezone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
      </div>
    </AuthGuard>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  );
}