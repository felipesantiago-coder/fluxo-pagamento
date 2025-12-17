'use client'

import { useAuth } from '@/lib/auth/provider'
import { Header } from '@/components/layout/header'
import { PropertySimulator } from '@/components/property/property-simulator'
import { notFound } from 'next/navigation'

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { isAuthenticated } = useAuth()
  const propertyId = params.id

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please login to view property simulators.</p>
        </div>
      </div>
    )
  }

  // Check if property exists
  const validProperties = ['quattre-istanbul', 'villa-bianco', 'venice-park', 'moment', 'unite']
  if (!validProperties.includes(propertyId)) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <PropertySimulator propertyId={propertyId} />
    </div>
  )
}