'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { Customer, CustomerType } from '@/lib/types'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Search, Edit, Trash2, Phone, User, Building2, X } from 'lucide-react'
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

const CUSTOMER_TYPES: CustomerType[] = ['individual', 'company']

export default function CustomersPage() {
  const { customers, contracts, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const t = useTranslations('customers')
  const tc = useTranslations('common')
  const localize = useLocalizedName()
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    type: 'individual' as CustomerType,
    name: '', nameAr: '', customId: '', phone: '', email: '',
    contactPerson: '', address: '', taxId: '', notes: '',
  })

  const filteredCustomers = customers.filter((c) => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.customId?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
  })

  const contractCount = (id: string) =>
    contracts.filter((c) => c.partyType === 'customer' && c.partyId === id).length

  const openAddDialog = () => {
    setEditingCustomer(null)
    setFormData({ type: typeFilter === 'all' ? 'individual' : typeFilter, name: '', nameAr: '', customId: '', phone: '', email: '', contactPerson: '', address: '', taxId: '', notes: '' })
    setDialogOpen(true)
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      type: customer.type, name: customer.name, nameAr: customer.nameAr || '',
      customId: customer.customId || '',
      phone: customer.phone, email: customer.email || '',
      contactPerson: customer.contactPerson || '', address: customer.address || '',
      taxId: customer.taxId || '', notes: customer.notes || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim()) return
    const payload = {
      type: formData.type,
      name: formData.name.trim(),
      nameAr: formData.nameAr.trim() || undefined,
      customId: formData.customId.trim() || undefined,
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      contactPerson: formData.contactPerson.trim() || undefined,
      address: formData.address.trim() || undefined,
      taxId: formData.taxId.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    }
    if (editingCustomer) updateCustomer(editingCustomer.id, payload)
    else addCustomer(payload)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2"><Plus className="size-4" />{t('addCustomer')}</Button>
      </div>

      <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as CustomerType | 'all')}>
        <TabsList>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          <TabsTrigger value="individual">{t('types.individual')}</TabsTrigger>
          <TabsTrigger value="company">{t('types.company')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ps-9" />
        {searchQuery && (
          <Button variant="ghost" size="icon" className="absolute inset-e-1 top-1/2 size-7 -translate-y-1/2" onClick={() => setSearchQuery('')}>
            <X className="size-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center">
              <Phone className="mx-auto mb-3 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">{t('noCustomers')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customer')}</TableHead>
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('customId')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('email')}</TableHead>
                  <TableHead>{t('contracts')}</TableHead>
                  <TableHead className="text-end">{tc('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const Icon = customer.type === 'company' ? Building2 : User
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4 text-primary" />
                          <div>
                            <p className="font-medium">{localize(customer)}</p>
                            {customer.contactPerson && <p className="text-xs text-muted-foreground">{customer.contactPerson}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{t(`types.${customer.type}`)}</Badge></TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.customId || '—'}</TableCell>
                      <TableCell className="hidden md:table-cell">{customer.email || '—'}</TableCell>
                      <TableCell>{contractCount(customer.id)}</TableCell>
                      <TableCell className="text-end">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}><Edit className="size-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(customer.id)}><Trash2 className="size-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? t('editCustomer') : t('addCustomer')}</DialogTitle>
            <DialogDescription>{t('formHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as CustomerType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map((type) => <SelectItem key={type} value={type}>{t(`types.${type}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('nameEn')}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('nameAr')}</Label><Input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} dir="rtl" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('phone')}</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('customId')}</Label><Input value={formData.customId} onChange={(e) => setFormData({ ...formData, customId: e.target.value.toUpperCase() })} placeholder={t('customIdHint')} /></div>
            </div>
            <div className="space-y-2"><Label>{t('email')}</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            {formData.type === 'company' && (
              <>
                <div className="space-y-2"><Label>{t('contactPerson')}</Label><Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>{t('address')}</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{t('taxId')}</Label><Input value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} /></div>
                </div>
              </>
            )}
            <div className="space-y-2"><Label>{tc('notes')}</Label><Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
            <Button onClick={handleSubmit} className="w-full" disabled={!formData.name.trim() || !formData.phone.trim()}>{tc('save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCustomer')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteHint')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { if (deleteConfirm) deleteCustomer(deleteConfirm); setDeleteConfirm(null) }}>{tc('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
