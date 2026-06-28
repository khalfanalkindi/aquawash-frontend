'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { Contract, ContractPartyType, ContractPurpose, ContractStatus } from '@/lib/types'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Search, Edit, Trash2, FileText, Eye } from 'lucide-react'
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
import { format } from 'date-fns'
import { toast } from 'sonner'

const STATUSES: ContractStatus[] = ['draft', 'active', 'expired', 'terminated']
const PURPOSES: ContractPurpose[] = ['laundry', 'supply', 'maintenance', 'logistics', 'other']

const statusVariant: Record<ContractStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline', active: 'default', expired: 'secondary', terminated: 'destructive',
}

export default function ContractsPage() {
  const {
    contracts, customers, stakeholders, branches, currentBranchId,
    addContract, updateContract, deleteContract,
  } = useStore()
  const t = useTranslations('contracts')
  const tc = useTranslations('common')
  const tCust = useTranslations('customers')
  const ts = useTranslations('stakeholders')
  const localize = useLocalizedName()
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewContract, setViewContract] = useState<Contract | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Contract | null>(null)
  const [form, setForm] = useState({
    contractNumber: '', partyType: 'customer' as ContractPartyType, partyId: '',
    branchId: currentBranchId || '', purpose: 'laundry' as ContractPurpose,
    title: '', startDate: '', endDate: '', status: 'draft' as ContractStatus,
    monthlyValue: '', terms: '', notes: '',
  })

  const getPartyName = (c: Contract) => {
    if (c.partyType === 'customer') {
      const cust = customers.find((x) => x.id === c.partyId)
      return cust ? localize(cust) : '—'
    }
    const sh = stakeholders.find((x) => x.id === c.partyId)
    return sh ? localize(sh) : '—'
  }

  const filtered = contracts.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    const q = search.toLowerCase()
    return !q || c.contractNumber.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || getPartyName(c).toLowerCase().includes(q)
  })

  const partyOptions = form.partyType === 'customer'
    ? customers.map((c) => ({ id: c.id, label: `${localize(c)} (${tCust(`types.${c.type}`)})` }))
    : stakeholders.map((s) => ({ id: s.id, label: `${localize(s)} (${ts(`types.${s.type}`)})` }))

  const onPartyTypeChange = (partyType: ContractPartyType) => {
    const defaultPurpose: ContractPurpose = partyType === 'customer' ? 'laundry' : 'supply'
    const firstId = partyType === 'customer' ? customers[0]?.id : stakeholders[0]?.id
    setForm({ ...form, partyType, partyId: firstId || '', purpose: defaultPurpose })
  }

  const openAdd = () => {
    setEditing(null)
    setForm({
      contractNumber: `CNT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
      partyType: 'customer', partyId: customers[0]?.id || '',
      branchId: currentBranchId || branches[0]?.id || '',
      purpose: 'laundry', title: '',
      startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '',
      status: 'draft', monthlyValue: '', terms: '', notes: '',
    })
    setDialogOpen(true)
  }

  const openEdit = (c: Contract) => {
    setEditing(c)
    setForm({
      contractNumber: c.contractNumber, partyType: c.partyType, partyId: c.partyId,
      branchId: c.branchId, purpose: c.purpose, title: c.title,
      startDate: format(new Date(c.startDate), 'yyyy-MM-dd'),
      endDate: c.endDate ? format(new Date(c.endDate), 'yyyy-MM-dd') : '',
      status: c.status,
      monthlyValue: c.monthlyValue?.toString() || '', terms: c.terms || '', notes: c.notes || '',
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.title.trim() || !form.partyId || !form.branchId) return
    const payload = {
      contractNumber: form.contractNumber,
      partyType: form.partyType,
      partyId: form.partyId,
      branchId: form.branchId,
      purpose: form.purpose,
      title: form.title,
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      status: form.status,
      monthlyValue: form.monthlyValue ? Number(form.monthlyValue) : undefined,
      terms: form.terms || undefined,
      notes: form.notes || undefined,
    }
    try {
      if (editing) await updateContract(editing.id, payload)
      else await addContract(payload)
      setDialogOpen(false)
    } catch {
      toast.error(tc('error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={openAdd} className="gap-2"><Plus className="size-4" />{t('addContract')}</Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as ContractStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          {STATUSES.map((s) => <TabsTrigger key={s} value={s}>{t(`status.${s}`)}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={tc('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contractNumber')}</TableHead>
                <TableHead>{t('contractTitle')}</TableHead>
                <TableHead>{t('party')}</TableHead>
                <TableHead>{t('purpose')}</TableHead>
                <TableHead>{t('branch')}</TableHead>
                <TableHead>{t('value')}</TableHead>
                <TableHead>{tc('status')}</TableHead>
                <TableHead className="text-end">{tc('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const br = branches.find((b) => b.id === c.branchId)
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        <span className="font-mono text-sm">{c.contractNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[160px] truncate">{c.title}</TableCell>
                    <TableCell>
                      <p className="text-sm">{getPartyName(c)}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {c.partyType === 'customer' ? t('partyCustomer') : t('partyStakeholder')}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{t(`purposes.${c.purpose}`)}</Badge></TableCell>
                    <TableCell className="text-sm">{br ? localize(br) : '—'}</TableCell>
                    <TableCell>{c.monthlyValue ? `${c.monthlyValue.toFixed(3)} OMR` : '—'}</TableCell>
                    <TableCell><Badge variant={statusVariant[c.status]}>{t(`status.${c.status}`)}</Badge></TableCell>
                    <TableCell className="text-end">
                      <Button variant="ghost" size="icon" onClick={() => setViewContract(c)}><Eye className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 className="size-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t('editContract') : t('addContract')}</DialogTitle>
            <DialogDescription>{t('formHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>{t('contractNumber')}</Label><Input value={form.contractNumber} onChange={(e) => setForm({ ...form, contractNumber: e.target.value })} /></div>
            <div className="space-y-2"><Label>{t('contractTitle')}</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('partyType')}</Label>
                <Select value={form.partyType} onValueChange={(v) => onPartyTypeChange(v as ContractPartyType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">{t('partyCustomer')}</SelectItem>
                    <SelectItem value="stakeholder">{t('partyStakeholder')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('purpose')}</Label>
                <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v as ContractPurpose })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PURPOSES.map((p) => <SelectItem key={p} value={p}>{t(`purposes.${p}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{form.partyType === 'customer' ? t('selectCustomer') : t('selectStakeholder')}</Label>
              <Select value={form.partyId} onValueChange={(v) => setForm({ ...form, partyId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {partyOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('branch')}</Label>
              <Select value={form.branchId} onValueChange={(v) => setForm({ ...form, branchId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {branches.filter((b) => b.isActive).map((b) => <SelectItem key={b.id} value={b.id}>{localize(b)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('startDate')}</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('endDate')}</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{tc('status')}</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ContractStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>{t('monthlyValue')}</Label><Input type="number" step="0.001" value={form.monthlyValue} onChange={(e) => setForm({ ...form, monthlyValue: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>{t('terms')}</Label><Textarea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></div>
            <Button onClick={save} className="w-full">{tc('save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewContract} onOpenChange={() => setViewContract(null)}>
        <DialogContent>
          {viewContract && (
            <>
              <DialogHeader>
                <DialogTitle>{viewContract.title}</DialogTitle>
                <DialogDescription>{viewContract.contractNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>{t('party')}:</strong> {getPartyName(viewContract)} ({viewContract.partyType === 'customer' ? t('partyCustomer') : t('partyStakeholder')})</p>
                <p><strong>{t('purpose')}:</strong> {t(`purposes.${viewContract.purpose}`)}</p>
                <p><strong>{t('branch')}:</strong> {localize(branches.find((b) => b.id === viewContract.branchId) || { name: '—' })}</p>
                <p><strong>{t('period')}:</strong> {format(new Date(viewContract.startDate), 'dd MMM yyyy')} – {viewContract.endDate ? format(new Date(viewContract.endDate), 'dd MMM yyyy') : t('openEnded')}</p>
                {viewContract.monthlyValue && <p><strong>{t('monthlyValue')}:</strong> {viewContract.monthlyValue.toFixed(3)} OMR</p>}
                {viewContract.terms && <p><strong>{t('terms')}:</strong> {viewContract.terms}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteContract')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteHint')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (!deleteId) return
              void (async () => {
                try {
                  await deleteContract(deleteId)
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
