"use client"

import { usePathname, useRouter, Link } from "@/i18n/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { isRtl } from "@/lib/localized"
import { cn } from "@/lib/utils"
import {
  LogOut,
  Droplets,
  Settings,
  Bell,
  Search,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BranchSwitcher } from "@/components/branch-switcher"
import { StoreHydrator } from "@/components/store-hydrator"
import { usePermissions } from "@/hooks/use-permissions"
import { canAccessAdminPortal, portalForRole } from "@/lib/auth/roles"
import { canAccessAdminRoute, getDefaultAdminRoute } from "@/lib/admin-routes"
import {
  ADMIN_ACCOUNT_NAV,
  ADMIN_OPERATIONS_NAV,
  ADMIN_PLATFORM_NAV,
} from "@/lib/admin-nav"

function AppSidebar({ homeHref }: { homeHref: string }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const { state } = useSidebar()
  const locale = useLocale()
  const { can } = usePermissions()
  const rtl = isRtl(locale)
  const sidebarSide = rtl ? "right" : "left"
  const isCollapsed = state === "collapsed"
  const t = useTranslations("nav")
  const tc = useTranslations("common")

  const visiblePlatform = ADMIN_PLATFORM_NAV.filter((item) =>
    user && canAccessAdminRoute(item.href, can, user.role),
  )
  const visibleOperations = ADMIN_OPERATIONS_NAV.filter((item) =>
    user && canAccessAdminRoute(item.href, can, user.role),
  )
  const visibleAccount = ADMIN_ACCOUNT_NAV.filter((item) =>
    user && canAccessAdminRoute(item.href, can, user.role),
  )

  return (
    <Sidebar collapsible="icon" side={sidebarSide}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={homeHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Droplets className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{tc("appName")}</span>
                  <span className="text-xs text-muted-foreground">{tc("managementSystem")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visiblePlatform.map((item) => {
                const label = t(item.labelKey)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleOperations.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>{t("operations")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleOperations.map((item) => {
                const label = t(item.labelKey)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {visibleAccount.length > 0 && (
        <Collapsible defaultOpen={false} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full cursor-pointer items-center [&[data-state=open]>svg:last-child]:rotate-90">
                {t("account")}
                <ChevronRight className="ms-auto size-4 transition-transform duration-200 rtl:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleAccount.map((item) => {
                    const label = t(item.labelKey)
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={label}>
                          <Link href={item.href}>
                            <item.icon />
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted font-semibold">
                    {user?.fullName?.charAt(0) || user?.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName || user?.username}</span>
                    <span className="truncate text-xs text-muted-foreground capitalize">{user?.role}</span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isCollapsed ? (rtl ? "left" : "right") : "top"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="me-2 size-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    router.push("/admin/login")
                  }}
                >
                  <LogOut className="me-2 size-4" />
                  {tc("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function HeaderContent() {
  const t = useTranslations("nav")
  const tc = useTranslations("common")

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ms-1" />

        <div className="relative ms-2 hidden sm:block">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${tc("search")}...`}
            className="w-64 rounded-lg border-border bg-background ps-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <BranchSwitcher compact />
        <LanguageSwitcher />
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Bell className="size-5" />
                <span className="absolute end-2 top-2 size-2 rounded-full bg-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("notifications")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const { can } = usePermissions()
  const router = useRouter()
  const pathname = usePathname()
  const tc = useTranslations("common")

  useEffect(() => {
    if (isLoading) return
    if (!user && pathname !== "/admin/login") {
      router.push("/admin/login")
      return
    }
    if (user && pathname !== "/admin/login" && !canAccessAdminPortal(user)) {
      const portal = portalForRole(user.role)
      router.push(portal === "holder" ? "/holder/pos" : "/admin/login")
      return
    }
    if (
      user &&
      pathname !== "/admin/login" &&
      canAccessAdminPortal(user) &&
      !canAccessAdminRoute(pathname, can, user.role)
    ) {
      router.replace(getDefaultAdminRoute(can))
    }
  }, [user, isLoading, pathname, router, can])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{tc("loading")}</p>
        </div>
      </div>
    )
  }

  if (!user || !canAccessAdminRoute(pathname, can, user.role)) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar homeHref={getDefaultAdminRoute(can)} />
      <SidebarInset>
        <HeaderContent />
        <main className="flex-1 bg-muted/30 p-4 lg:p-6">
          <StoreHydrator>{children}</StoreHydrator>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
