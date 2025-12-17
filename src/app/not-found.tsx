'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/properties">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View Properties
              </Link>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Looking for something specific?</p>
            <p className="mt-1">
              Try our <Link href="/properties" className="text-primary hover:underline">properties page</Link> or{' '}
              <Link href="/" className="text-primary hover:underline">return to homepage</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}