'use client'

import { useAuth } from '@/lib/auth-context'
import { usePathname, useRouter, Link } from '@/i18n/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Droplets, LogOut, Receipt, ShoppingCart, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LanguageSwitcher } from '@/components/language-switcher'
import { BranchSwitcher } from '@/components/branch-switcher'
import { StoreHydrator } from '@/components/store-hydrator'
import { canAccessHolderPortal, portalForRole } from '@/lib/auth/roles'

function userInitials(fullName: string, username: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

export default function HolderLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('nav')
  const tc = useTranslations('common')

  useEffect(() => {
    if (isLoading) return
    if (!user && pathname !== '/holder/login') {
      router.push('/holder/login')
      return
    }
    if (user && pathname !== '/holder/login' && !canAccessHolderPortal(user)) {
      const portal = portalForRole(user.role)
      router.push(portal === 'admin' ? '/admin/dashboard' : '/holder/login')
    }
  }, [user, isLoading, pathname, router])

  if (pathname === '/holder/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">{tc('loading')}</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: '/holder/invoices', labelKey: 'invoices' as const, icon: Receipt },
    { href: '/holder/pos', labelKey: 'pos' as const, icon: ShoppingCart, isMain: true },
    { href: '/holder/activate', labelKey: 'products' as const, icon: ToggleRight },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="size-5" />
            </div>
            <div>
              <span className="font-semibold text-foreground">{tc('appName')}</span>
              <p className="text-xs text-muted-foreground">{tc('holderPos')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BranchSwitcher compact />
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {userInitials(user.fullName, user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    logout()
                    router.push('/holder/login')
                  }}
                >
                  <LogOut className="me-2 size-4" />
                  {tc('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        <StoreHydrator>{children}</StoreHydrator>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const label = t(item.labelKey)

            if (item.isMain) {
              return (
                <Link key={item.href} href={item.href} className="relative -mt-6">
                  <div
                    className={cn(
                      'flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-primary/30'
                        : 'bg-primary/90 text-primary-foreground hover:bg-primary'
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span
                    className={cn(
                      'absolute -bottom-4 start-1/2 -translate-x-1/2 text-[10px] font-medium',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl transition-colors',
                    isActive && 'bg-primary/10'
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
