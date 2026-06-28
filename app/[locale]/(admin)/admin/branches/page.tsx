'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { Branch } from '@/lib/types'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Search, Edit, Trash2, Building2, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function BranchesPage() {
  const { branches, addBranch, updateBranch, deleteBranch } = useStore()
  const t = useTranslations('branches')
  const tc = useTranslations('common')
  const localize = useLocalizedName()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [form, setForm] = useState({ name: '', nameAr: '', code: '', address: '', phone: '', isActive: true })

  const filtered = branches.filter((b) => {
    const q = search.toLowerCase()
    return !q || b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.nameAr?.includes(search)
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', nameAr: '', code: '', address: '', phone: '', isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (b: Branch) => {
    setEditing(b)
    setForm({
      name: b.name, nameAr: b.nameAr || '', code: b.code,
      address: b.address || '', phone: b.phone || '', isActive: b.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) return
    try {
      if (editing) await updateBranch(editing.id, form)
      else await addBranch(form)
      setDialogOpen(false)
    } catch {
      toast.error(tc('error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />{t('addBranch')}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={tc('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('branch')}</TableHead>
                <TableHead>{t('code')}</TableHead>
                <TableHead>{t('contact')}</TableHead>
                <TableHead>{tc('status')}</TableHead>
                <TableHead>{t('created')}</TableHead>
                <TableHead className="text-end">{tc('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-primary" />
                      <div>
                        <p className="font-medium">{localize(b)}</p>
                        {b.address && <p className="text-xs text-muted-foreground">{b.address}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{b.code}</Badge></TableCell>
                  <TableCell className="text-sm">{b.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={b.isActive ? 'default' : 'secondary'}>
                      {b.isActive ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(b.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-end">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Edit className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)}><Trash2 className="size-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('editBranch') : t('addBranch')}</DialogTitle>
            <DialogDescription>{t('branchFormHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('nameEn')}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('nameAr')}</Label>
                <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('code')}</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="MCT-KHW" />
            </div>
            <div className="space-y-2">
              <Label>{t('address')}</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('phone')}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>{t('activeBranch')}</Label>
            </div>
            <Button onClick={handleSave} className="w-full">{tc('save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteBranch')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteBranchHint')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (!deleteId) return
              void (async () => {
                try {
                  await deleteBranch(deleteId)
                  setDeleteId(null)
                } catch {
                  toast.error(tc('error'))
                }
              })()
            }}>{tc('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
