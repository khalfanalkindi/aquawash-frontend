'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { Stakeholder, StakeholderType } from '@/lib/types'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Search, Edit, Trash2, Truck, Car, Handshake, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

const TYPES: StakeholderType[] = ['supplier', 'driver', 'partner', 'other']

const typeIcons: Record<StakeholderType, typeof Truck> = {
  supplier: Truck,
  driver: Car,
  partner: Handshake,
  other: HelpCircle,
}

export default function StakeholdersPage() {
  const { stakeholders, contracts, addStakeholder, updateStakeholder, deleteStakeholder } = useStore()
  const t = useTranslations('stakeholders')
  const tc = useTranslations('common')
  const localize = useLocalizedName()
  const [typeFilter, setTypeFilter] = useState<StakeholderType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Stakeholder | null>(null)
  const [form, setForm] = useState({
    type: 'supplier' as StakeholderType,
    name: '', nameAr: '', phone: '', email: '', contactPerson: '',
    address: '', taxId: '', notes: '', isActive: true,
  })

  const filtered = stakeholders.filter((s) => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    const q = search.toLowerCase()
    return !q || s.name.toLowerCase().includes(q) || s.phone?.includes(q) || s.email?.toLowerCase().includes(q)
  })

  const contractCount = (id: string) =>
    contracts.filter((c) => c.partyType === 'stakeholder' && c.partyId === id).length

  const openAdd = () => {
    setEditing(null)
    setForm({ type: typeFilter === 'all' ? 'supplier' : typeFilter, name: '', nameAr: '', phone: '', email: '', contactPerson: '', address: '', taxId: '', notes: '', isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (s: Stakeholder) => {
    setEditing(s)
    setForm({
      type: s.type, name: s.name, nameAr: s.nameAr || '', phone: s.phone || '',
      email: s.email || '', contactPerson: s.contactPerson || '', address: s.address || '',
      taxId: s.taxId || '', notes: s.notes || '', isActive: s.isActive,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    try {
      if (editing) await updateStakeholder(editing.id, form)
      else await addStakeholder(form)
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
        <Button onClick={openAdd} className="gap-2"><Plus className="size-4" />{t('addStakeholder')}</Button>
      </div>

      <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as StakeholderType | 'all')}>
        <TabsList>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          {TYPES.map((type) => <TabsTrigger key={type} value={type}>{t(`types.${type}`)}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={tc('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('stakeholder')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('contact')}</TableHead>
                <TableHead>{t('contracts')}</TableHead>
                <TableHead>{tc('status')}</TableHead>
                <TableHead className="text-end">{tc('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const Icon = typeIcons[s.type]
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        <div>
                          <p className="font-medium">{localize(s)}</p>
                          {s.contactPerson && <p className="text-xs text-muted-foreground">{s.contactPerson}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{t(`types.${s.type}`)}</Badge></TableCell>
                    <TableCell className="text-sm">
                      <p>{s.phone || '—'}</p>
                      {s.email && <p className="text-xs text-muted-foreground">{s.email}</p>}
                    </TableCell>
                    <TableCell>{contractCount(s.id)}</TableCell>
                    <TableCell>
                      <Badge variant={s.isActive ? 'default' : 'outline'}>{s.isActive ? t('active') : t('inactive')}</Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Edit className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="size-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t('editStakeholder') : t('addStakeholder')}</DialogTitle>
            <DialogDescription>{t('formHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as StakeholderType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => <SelectItem key={type} value={type}>{t(`types.${type}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('nameEn')}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('nameAr')}</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('phone')}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('email')}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>{t('contactPerson')}</Label><Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></div>
            <div className="space-y-2"><Label>{t('address')}</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="space-y-2"><Label>{t('taxId')}</Label><Input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} /></div>
            <div className="space-y-2"><Label>{tc('notes')}</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={save} className="w-full">{tc('save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteStakeholder')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteHint')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (!deleteId) return
              void (async () => {
                try {
                  await deleteStakeholder(deleteId)
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
