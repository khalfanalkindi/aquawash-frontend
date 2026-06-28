'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Pencil, Trash2, Search, Briefcase, Shield, ShieldCheck, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { User } from '@/lib/types'
import { toast } from 'sonner'

const roleIcons: Record<string, typeof Shield> = {
  admin: ShieldCheck,
  manager: Briefcase,
  cashier: Shield,
  holder: ShieldX,
}

function getRoleBadgeClass(roleCode: string) {
  switch (roleCode) {
    case 'admin':
      return 'border-primary/30 bg-primary/10 text-primary'
    case 'manager':
      return 'border-blue-300/30 bg-blue-100 text-blue-800'
    case 'cashier':
      return 'border-accent/30 bg-accent/10 text-accent-foreground'
    case 'holder':
      return 'border-border bg-muted text-muted-foreground'
    default:
      return ''
  }
}

export default function AdminUsersPage() {
  const { users, branches, roles, addUser, updateUser, deleteUser } = useStore()
  const localize = useLocalizedName()
  const t = useTranslations('users')
  const tc = useTranslations('common')

  const assignableRoles = roles
    .filter((r) => r.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))

  const defaultRoleId = () => {
    const holder = assignableRoles.find((r) => r.code === 'holder')
    return holder?.id ?? assignableRoles[0]?.id ?? ''
  }

  const resolveRoleCode = (user: User) =>
    user.roleCode ?? assignableRoles.find((r) => r.id === user.roleId)?.code ?? user.role

  const getRoleLabel = (role: { code?: string; name: string }) => {
    if (role.code && ['admin', 'manager', 'cashier', 'holder'].includes(role.code)) {
      return t(`roles.${role.code}` as 'roles.admin')
    }
    return role.name
  }

  const displayRoleName = (user: User) => {
    if (user.roleName) return user.roleName
    const role = assignableRoles.find((r) => r.id === user.roleId)
    if (role) return getRoleLabel(role)
    const code = resolveRoleCode(user)
    if (['admin', 'manager', 'cashier', 'holder'].includes(code)) {
      return t(`roles.${code}` as 'roles.admin')
    }
    return code
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const activeBranches = branches.filter((b) => b.isActive)

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    roleId: '',
    isActive: true,
    branchIds: [] as string[],
    defaultBranchId: '',
  })

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    const firstBranchId = activeBranches[0]?.id || ''
    setFormData({
      username: '',
      fullName: '',
      roleId: defaultRoleId(),
      isActive: true,
      branchIds: firstBranchId ? [firstBranchId] : [],
      defaultBranchId: firstBranchId,
    })
    setEditingUser(null)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId ?? assignableRoles.find((r) => r.code === user.roleCode)?.id ?? defaultRoleId(),
      isActive: user.isActive,
      branchIds: [...user.branchIds],
      defaultBranchId: user.defaultBranchId || user.branchIds[0] || '',
    })
    setIsDialogOpen(true)
  }

  const toggleBranch = (branchId: string, checked: boolean) => {
    const nextIds = checked
      ? [...formData.branchIds, branchId]
      : formData.branchIds.filter((id) => id !== branchId)

    let nextDefault = formData.defaultBranchId
    if (!checked && formData.defaultBranchId === branchId) {
      nextDefault = nextIds[0] || ''
    }
    if (checked && nextIds.length === 1) {
      nextDefault = branchId
    }

    setFormData({ ...formData, branchIds: nextIds, defaultBranchId: nextDefault })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.branchIds.length === 0) return

    const payload = {
      username: formData.username,
      fullName: formData.fullName,
      roleId: formData.roleId,
      isActive: formData.isActive,
      branchIds: formData.branchIds,
      defaultBranchId: formData.defaultBranchId || formData.branchIds[0],
    }

    try {
      if (editingUser) await updateUser(editingUser.id, payload)
      else await addUser(payload)
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast.error(tc('error'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id)
      setDeleteConfirm(null)
    } catch {
      toast.error(tc('error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (open && !editingUser) resetForm()
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingUser(null); resetForm() }}>
              <Plus className="h-4 w-4" />
              {t('addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? t('editUser') : t('addUser')}</DialogTitle>
              <DialogDescription>{t('subtitle')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
                {!editingUser && (
                  <p className="text-xs text-muted-foreground">{t('passwordHint')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')}</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('role')} />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => {
                      const code = role.code ?? role.name.toLowerCase()
                      const Icon = roleIcons[code] ?? Shield
                      return (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {getRoleLabel(role)}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('branches')}</Label>
                <p className="text-xs text-muted-foreground">{t('branchesHint')}</p>
                <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                  {activeBranches.map((branch) => (
                    <label key={branch.id} className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={formData.branchIds.includes(branch.id)}
                        onCheckedChange={(checked) => toggleBranch(branch.id, checked === true)}
                      />
                      <span className="text-sm">{localize(branch)}</span>
                      <span className="text-xs text-muted-foreground">({branch.code})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('defaultBranch')}</Label>
                <p className="text-xs text-muted-foreground">{t('defaultBranchHint')}</p>
                <Select
                  value={formData.defaultBranchId}
                  onValueChange={(value) => setFormData({ ...formData, defaultBranchId: value })}
                  disabled={formData.branchIds.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectBranchesFirst')} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.branchIds.map((id) => {
                      const branch = branches.find((b) => b.id === id)
                      if (!branch) return null
                      return (
                        <SelectItem key={id} value={id}>
                          {localize(branch)}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                <Label htmlFor="isActive" className="cursor-pointer">{t('activeStatus')}</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  {tc('cancel')}
                </Button>
                <Button type="submit" className="flex-1" disabled={formData.branchIds.length === 0 || !formData.roleId}>
                  {editingUser ? tc('save') : tc('add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">{t('fullName')}</TableHead>
                <TableHead className="font-medium">{t('role')}</TableHead>
                <TableHead className="font-medium">{t('branches')}</TableHead>
                <TableHead className="font-medium">{t('status')}</TableHead>
                <TableHead className="text-right font-medium">{tc('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleCode = resolveRoleCode(user)
                const RoleIcon = roleIcons[roleCode] ?? Shield
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-semibold text-foreground">{user.fullName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 font-normal ${getRoleBadgeClass(roleCode)}`}>
                        <RoleIcon className="h-4 w-4" />
                        {displayRoleName(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.branchIds.map((id) => {
                          const branch = branches.find((b) => b.id === id)
                          if (!branch) return null
                          return (
                            <Badge
                              key={id}
                              variant={user.defaultBranchId === id ? 'default' : 'secondary'}
                              className="font-normal"
                            >
                              {localize(branch)}
                            </Badge>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? 'default' : 'secondary'}
                        className={user.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                      >
                        {user.isActive ? t('active') : t('inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(user.id)}
                          disabled={user.username === 'demo'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {t('noUsers')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteUser')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteHint')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {tc('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
