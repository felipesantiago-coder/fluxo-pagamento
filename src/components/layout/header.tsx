'use client'

import { useAuth } from '@/lib/auth/provider'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogOut, User, Home, Building, Settings } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path === '/properties' && (pathname === '/properties' || pathname.startsWith('/properties/'))) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RE</span>
            </div>
            <span className="font-semibold text-lg">Imobiliária</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>Início</span>
                </div>
              </Link>
              <Link
                href="/properties"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/properties') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>Imóveis</span>
                </div>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}