'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Building2, Check, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useStore } from '@/lib/store'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function BranchSwitcher({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth()
  const t = useTranslations('branches')
  const localize = useLocalizedName()
  const {
    currentBranchId,
    setCurrentBranch,
    initBranchForUser,
    getUserBranches,
    branches,
  } = useStore()

  useEffect(() => {
    if (user) initBranchForUser(user)
  }, [user, initBranchForUser])

  if (!user) return null

  const userBranches = getUserBranches(user)
  const currentBranch = branches.find((b) => b.id === currentBranchId)

  if (userBranches.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className="max-w-[200px] gap-2 border-dashed"
        >
          <Building2 className="size-4 shrink-0 text-primary" />
          <span className="truncate text-start">
            {currentBranch ? localize(currentBranch) : t('selectBranch')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>{t('yourBranches')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userBranches.map((branch) => {
          const isActive = branch.id === currentBranchId
          const isDefault = user.defaultBranchId === branch.id
          return (
            <DropdownMenuItem
              key={branch.id}
              onClick={() => setCurrentBranch(branch.id)}
              className="flex flex-col items-start gap-1 py-2"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="font-medium">{localize(branch)}</span>
                <div className="flex items-center gap-1">
                  {isDefault && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      {t('default')}
                    </Badge>
                  )}
                  {isActive && <Check className="size-4 text-primary" />}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{branch.code}</span>
              {branch.address && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {branch.address}
                </span>
              )}
            </DropdownMenuItem>
          )
        })}
        {userBranches.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <p className="px-2 py-1.5 text-xs text-muted-foreground">{t('switchHint')}</p>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
