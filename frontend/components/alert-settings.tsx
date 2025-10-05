"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Smartphone, Settings, Plus, X } from "lucide-react"

const notificationChannels = [
  { id: "email", label: "Email", icon: Mail, enabled: true },
  { id: "sms", label: "SMS", icon: Smartphone, enabled: false },
  { id: "push", label: "Push Notifications", icon: Bell, enabled: true },
]

const alertTypes = [
  { id: "low-stock", label: "Low Stock Alerts", enabled: true, threshold: "When stock <= minimum" },
  { id: "out-of-stock", label: "Out of Stock Alerts", enabled: true, threshold: "When stock = 0" },
  { id: "expiry", label: "Expiry Warnings", enabled: false, threshold: "30 days before expiry" },
  { id: "system", label: "System Notifications", enabled: true, threshold: "All system events" },
]

export function AlertSettings() {
  const [settings, setSettings] = useState({
    globalEnabled: true,
    quietHours: { enabled: false, start: "22:00", end: "08:00" },
    escalation: { enabled: true, delay: "24" },
    batchNotifications: true,
  })

  const [emailRecipients, setEmailRecipients] = useState(["supervisor@company.com", "manager@company.com"])

  const [newRecipient, setNewRecipient] = useState("")

  const addRecipient = () => {
    if (newRecipient && !emailRecipients.includes(newRecipient)) {
      setEmailRecipients([...emailRecipients, newRecipient])
      setNewRecipient("")
    }
  }

  const removeRecipient = (email: string) => {
    setEmailRecipients(emailRecipients.filter((e) => e !== email))
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="global-alerts" className="text-base font-medium">
                Enable Alert System
              </Label>
              <p className="text-sm text-muted-foreground">Master switch for all inventory alerts</p>
            </div>
            <Switch
              id="global-alerts"
              checked={settings.globalEnabled}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, globalEnabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="batch-notifications" className="text-base font-medium">
                Batch Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Group similar alerts together to reduce noise</p>
            </div>
            <Switch
              id="batch-notifications"
              checked={settings.batchNotifications}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, batchNotifications: checked }))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours" className="text-base font-medium">
                  Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">Suppress non-critical alerts during specified hours</p>
              </div>
              <Switch
                id="quiet-hours"
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: checked },
                  }))
                }
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="escalation" className="text-base font-medium">
                  Alert Escalation
                </Label>
                <p className="text-sm text-muted-foreground">Escalate unresolved alerts to management</p>
              </div>
              <Switch
                id="escalation"
                checked={settings.escalation.enabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    escalation: { ...prev.escalation, enabled: checked },
                  }))
                }
              />
            </div>

            {settings.escalation.enabled && (
              <div className="ml-6">
                <Label htmlFor="escalation-delay">Escalation Delay (hours)</Label>
                <Select
                  value={settings.escalation.delay}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      escalation: { ...prev.escalation, delay: value },
                    }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <channel.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{channel.label}</p>
                    <p className="text-sm text-muted-foreground">{channel.enabled ? "Active" : "Disabled"}</p>
                  </div>
                </div>
                <Switch checked={channel.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Types */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertTypes.map((alertType) => (
              <div key={alertType.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{alertType.label}</p>
                    {alertType.enabled && (
                      <Badge variant="default" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alertType.threshold}</p>
                </div>
                <Switch checked={alertType.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Recipients */}
      <Card>
        <CardHeader>
          <CardTitle>Email Recipients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addRecipient()}
            />
            <Button onClick={addRecipient}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {emailRecipients.map((email) => (
              <div key={email} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm">{email}</span>
                <Button variant="ghost" size="sm" onClick={() => removeRecipient(email)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button size="lg">Save Settings</Button>
      </div>
    </div>
  )
}
