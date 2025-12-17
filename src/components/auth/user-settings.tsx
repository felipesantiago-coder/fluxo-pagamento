'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Settings, Smartphone } from 'lucide-react'
import { TwoFactorSetup } from '@/components/auth/two-factor'

export function UserSettings() {
  const { user, logout } = useAuth()
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  if (showTwoFactorSetup) {
    return <TwoFactorSetup />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user?.twoFactorEnabled ? (
                    <Badge variant="default" className="bg-green-600">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Disabled
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTwoFactorSetup(true)}
                  >
                    {user?.twoFactorEnabled ? 'Configure' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={logout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}