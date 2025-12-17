'use client'

import { useAuth } from '@/lib/auth/provider'
import { AuthForm } from '@/components/auth/auth-form'
import { TwoFactorForm, TwoFactorSetup } from '@/components/auth/two-factor'
import { UserSettings } from '@/components/auth/user-settings'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LandingPage } from '@/components/landing/landing-page'
import { AdminSetup } from '@/components/admin/admin-setup'
import { usePathname } from 'next/navigation'

export default function Home() {
  const { isAuthenticated, requiresTwoFactor, user } = useAuth()
  const pathname = usePathname()

  // Handle admin setup page
  if (pathname === '/admin-setup') {
    return <AdminSetup />
  }

  // If not authenticated, show auth forms
  if (!isAuthenticated) {
    if (requiresTwoFactor) {
      return <TwoFactorForm />
    }
    return <AuthForm />
  }

  // Handle settings page
  if (pathname === '/settings') {
    return (
      <div className="min-h-screen">
        <Header />
        <UserSettings />
      </div>
    )
  }

  // Default to landing page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  )
}