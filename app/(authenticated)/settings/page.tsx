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
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SettingsPageContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [validationMessage, setValidationMessage] = useState<string>('')
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
      const response = await fetch(getApiUrl('/channels'), {
        credentials: 'include' // Ensure cookies are sent with the request
      })
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

  const validateCredentials = async () => {
    if (!twitterChannel) return
    
    const { apiKey, apiSecret, accessToken, accessTokenSecret } = twitterChannel.keys
    
    // Check if all fields are filled
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      toast.error('Please fill in all credential fields')
      return
    }

    setValidating(true)
    setValidationStatus('idle')
    setValidationMessage('')

    try {
      const response = await fetch(getApiUrl('/channels/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify({
          type: 'twitter',
          credentials: {
            apiKey,
            apiSecret,
            accessToken,
            accessTokenSecret
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setValidationStatus('valid')
        setValidationMessage(data.message || 'Credentials are valid!')
        toast.success('Credentials validated successfully!')
      } else {
        setValidationStatus('invalid')
        setValidationMessage(data.error || data.details || 'Invalid credentials')
        toast.error(data.error || 'Credential validation failed')
      }
    } catch (error) {
      console.error('Validation error:', error)
      setValidationStatus('invalid')
      setValidationMessage('Failed to validate credentials')
      toast.error('Failed to validate credentials')
    } finally {
      setValidating(false)
    }
  }

  const saveSettings = async () => {
    if (!twitterChannel) return
    
    // Check if credentials are provided
    const { apiKey, apiSecret, accessToken, accessTokenSecret } = twitterChannel.keys
    const hasCredentials = apiKey && apiSecret && accessToken && accessTokenSecret
    
    setSaving(true)
    try {
      const url = getApiUrl('/channels')
      const method = twitterChannel.id ? 'PUT' : 'POST'
      const payload = twitterChannel.id ? {
        channelId: twitterChannel.id, 
        settings: twitterChannel.keys, 
        configuration: twitterChannel.configuration,
        validateCredentials: hasCredentials // Only validate if credentials are provided
      } : {
        type: 'twitter', 
        name: 'Twitter', 
        settings: twitterChannel.keys, 
        configuration: twitterChannel.configuration,
        validateCredentials: hasCredentials // Only validate if credentials are provided
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Settings saved successfully')
        setValidationStatus('valid')
        setValidationMessage('Credentials validated and saved')
        await loadChannels()
      } else {
        // Show specific error message from validation
        const errorMsg = data.details || data.error || 'Failed to save settings'
        toast.error(errorMsg)
        if (data.error === 'Invalid credentials') {
          setValidationStatus('invalid')
          setValidationMessage(data.details || 'Credentials validation failed')
        }
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
    // Reset validation status when credentials change
    setValidationStatus('idle')
    setValidationMessage('')
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
                      placeholder="Enter your API Key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret Key</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.apiSecret}
                      onChange={e => updateKeys('apiSecret', e.target.value)}
                      placeholder="Enter your API Secret"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Token</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.accessToken}
                      onChange={e => updateKeys('accessToken', e.target.value)}
                      placeholder="Enter your Access Token"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Token Secret</Label>
                    <Input
                      type="password"
                      value={twitterChannel.keys.accessTokenSecret}
                      onChange={e => updateKeys('accessTokenSecret', e.target.value)}
                      placeholder="Enter your Access Token Secret"
                    />
                  </div>
                </div>

                {/* Validation Status */}
                {validationStatus !== 'idle' && (
                  <Alert className={validationStatus === 'valid' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
                    {validationStatus === 'valid' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <AlertDescription className={validationStatus === 'valid' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                      {validationMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Validate Button */}
                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={validateCredentials} 
                    disabled={validating || !twitterChannel.keys.apiKey || !twitterChannel.keys.apiSecret || !twitterChannel.keys.accessToken || !twitterChannel.keys.accessTokenSecret}
                    variant="outline"
                    size="sm"
                  >
                    {validating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Test Credentials
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Configuration</CardTitle>
                <CardDescription>Control how the AI schedules and posts content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Posting Schedule */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Posting Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Daily Start Time</Label>
                        <TimePicker
                          date={timeStringToDate(twitterChannel.configuration?.startTime ?? "")}
                          setDate={(date) => updateConfig("startTime", date ? dateToTimeString(date) : "")}
                        />
                        <p className="text-xs text-muted-foreground">When to start posting each day</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Daily End Time</Label>
                        <TimePicker
                          date={timeStringToDate(twitterChannel.configuration?.endTime ?? "")}
                          setDate={(date) => updateConfig("endTime", date ? dateToTimeString(date) : "")}
                        />
                        <p className="text-xs text-muted-foreground">When to stop posting each day</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Posting Frequency */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Posting Frequency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Time Between Posts (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="1440"
                          value={twitterChannel.configuration?.timeBetweenPosts || 60}
                          onChange={e => updateConfig('timeBetweenPosts', parseInt(e.target.value) || 60)}
                          placeholder="60"
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum wait time between posts (1-1440 minutes)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Max Posts Per Day</Label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={twitterChannel.configuration?.maxPostsPerDay || 5}
                          onChange={e => updateConfig('maxPostsPerDay', parseInt(e.target.value) || 5)}
                          placeholder="5"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of posts per day (1-50)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timezone */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Timezone Settings</h3>
                    <div className="space-y-2 max-w-md">
                      <Label>Timezone</Label>
                      <Input
                        value={twitterChannel.configuration?.timezone || 'UTC'}
                        onChange={e => updateConfig('timezone', e.target.value)}
                        placeholder="UTC"
                      />
                      <p className="text-xs text-muted-foreground">
                        Timezone for scheduling posts (e.g., UTC, America/New_York, Europe/London)
                      </p>
                    </div>
                  </div>
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