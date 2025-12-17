'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'

export function AdminSetup() {
  const [isCreated, setIsCreated] = useState(false)
  const [error, setError] = useState('')

  const handleCreateAdmin = () => {
    try {
      // Create admin user with correct hash
      const adminUser = {
        id: 'admin-001',
        username: 'adminfluxo',
        email: 'admin@realestate.com',
        password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 of 'adminfluxo123'
        twoFactorEnabled: false,
        createdAt: new Date().toISOString()
      }

      // Save to local storage using same format as app
      const existingData = localStorage.getItem('real_estate_auth')
      let users = {}
      
      if (existingData) {
        try {
          users = JSON.parse(atob(existingData))
        } catch {
          users = {}
        }
      }
      
      if (!users['adminfluxo']) {
        users['adminfluxo'] = adminUser
        localStorage.setItem('real_estate_auth', btoa(JSON.stringify(users)))
        setIsCreated(true)
      } else {
        setError('Admin user already exists')
      }
    } catch (err) {
      setError('Failed to create admin user')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Create the administrator account for the Real Estate platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCreated ? (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">Admin user created successfully!</div>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong>Username:</strong> adminfluxo</p>
                  <p><strong>Password:</strong> adminfluxo123</p>
                </div>
                <div className="mt-3">
                  <Button 
                    onClick={() => window.location.href = '/'} 
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This will create an administrator account with the following credentials:
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                <div><strong>Username:</strong> adminfluxo</div>
                <div><strong>Password:</strong> adminfluxo123</div>
                <div><strong>Role:</strong> Administrator</div>
              </div>

              <Button onClick={handleCreateAdmin} className="w-full">
                Create Admin User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}