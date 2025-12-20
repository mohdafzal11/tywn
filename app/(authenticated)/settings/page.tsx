"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Channel } from "@/types"
import { TimePicker } from "@/components/time-picker"
import { format } from "date-fns"
import { getApiUrl } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

function SettingsPageContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [twitterChannel, setTwitterChannel] = useState<Channel | null>(null)

  const defaultTwitterChannel: Channel = {
    id: '',
    type: 'twitter',
    name: 'Twitter',
    isActive: true,
    keys: { apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' },
    configuration: {
      startTime: '', endTime: '', timeBetweenPosts: 60, maxPostsPerDay: 5, timezone: 'UTC',
    },
  }

  const loadChannels = async () => {
    try {
      const response = await fetch(getApiUrl('/channels'))
      if (!response.ok) throw new Error('Failed to fetch channels')
      const channels: Channel[] = await response.json()
      const twitter = channels.find((ch) => ch.type === 'twitter')
      if (twitter) {
        setTwitterChannel({ ...twitter, keys: twitter.keys || {}, configuration: twitter.configuration || {} })
      } else {
        setTwitterChannel(defaultTwitterChannel)
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
      toast.error('Failed to load channels')
      setTwitterChannel(defaultTwitterChannel)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadChannels() }, [])

  const saveSettings = async () => {
    if (!twitterChannel) return
    setSaving(true)
    try {
      // (Keep existing logic, just simplifying for brevity in thought, but writing full code)
      /* ... */
      const url = '/api/channels'
      const method = twitterChannel.id ? 'PUT' : 'POST'
      const payload = twitterChannel.id ? {
        channelId: twitterChannel.id, settings: twitterChannel.keys, configuration: twitterChannel.configuration
      } : {
        type: 'twitter', name: 'Twitter', settings: twitterChannel.keys, configuration: twitterChannel.configuration
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
        await loadChannels()
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateKeys = (field: keyof Channel['keys'], value: string) => {
    setTwitterChannel((prev) => prev ? { ...prev, keys: { ...prev.keys, [field]: value } } : prev)
  }

  const updateConfig = (field: string, value: any) => {
    setTwitterChannel((prev: any) => prev ? { ...prev, configuration: { ...prev.configuration, [field]: value } } : prev)
  }

  const timeStringToDate = (time: string): Date | undefined => {
    if (!time) return undefined
    const [hours, minutes] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const dateToTimeString = (date?: Date): string => date ? format(date, "HH:mm") : ""

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  if (!twitterChannel) return null

  return (
    <AuthGuard>
      <div className="container max-w-7xl mx-auto space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your channel configurations and preferences.</p>
        </div>

        <Tabs defaultValue="twitter">
          <TabsList>
            <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
            <TabsTrigger value="general" disabled>General (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="twitter" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>Enter your Twitter Developer API keys to enable posting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.apiKey}
                      onChange={e => updateKeys('apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret Key</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.apiSecret}
                      onChange={e => updateKeys('apiSecret', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Token</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.accessToken}
                      onChange={e => updateKeys('accessToken', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Token Secret</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.accessTokenSecret}
                      onChange={e => updateKeys('accessTokenSecret', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Configuration</CardTitle>
                <CardDescription>Control how the AI schedules and posts content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Daily Start Time</Label>
                    <TimePicker
                      date={timeStringToDate(twitterChannel.configuration?.startTime ?? "")}
                      setDate={(date) => updateConfig("startTime", date ? dateToTimeString(date) : "")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily End Time</Label>
                    <TimePicker
                      date={timeStringToDate(twitterChannel.configuration?.endTime ?? "")}
                      setDate={(date) => updateConfig("endTime", date ? dateToTimeString(date) : "")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Time Between Posts (minutes)</Label>
                    <Input
                      type="number"
                      value={twitterChannel.configuration?.timeBetweenPosts}
                      onChange={e => updateConfig('timeBetweenPosts', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Posts Per Day</Label>
                    <Input
                      type="number"
                      value={twitterChannel.configuration?.maxPostsPerDay}
                      onChange={e => updateConfig('maxPostsPerDay', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <Label>Timezone</Label>
                  <Input
                    value={twitterChannel.configuration?.timezone}
                    onChange={e => updateConfig('timezone', e.target.value)}
                    placeholder="UTC"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving} size="lg">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  )
}