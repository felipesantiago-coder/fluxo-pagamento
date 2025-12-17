'use client'

import { useAuth } from '@/lib/auth/provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertySelection } from '@/components/property/property-selection'

export default function PropertiesPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please login to view properties.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PropertySelection />
      </main>
      <Footer />
    </div>
  )
}