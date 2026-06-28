'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { StockItem, StockItemCategory } from '@/lib/types'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const CATEGORIES: StockItemCategory[] = ['equipment', 'consumable', 'spare_part']

export default function InventoryPage() {
  const {
    stockItems, branches, currentBranchId,
    addStockItem, updateStockItem, upsertInventory, getInventoryByBranch,
  } = useStore()
  const t = useTranslations('inventory')
  const tc = useTranslations('common')
  const localize = useLocalizedName()
  const [tab, setTab] = useState('stock')
  const [search, setSearch] = useState('')
  const [itemDialog, setItemDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [qtyDialog, setQtyDialog] = useState<{ stockItemId: string; quantity: number } | null>(null)
  const [form, setForm] = useState({
    name: '', nameAr: '', sku: '', category: 'equipment' as StockItemCategory,
    unit: 'pcs', minQuantity: 0, isActive: true,
  })

  const branchId = currentBranchId || branches[0]?.id
  const branchInventory = branchId ? getInventoryByBranch(branchId) : []
  const currentBranch = branches.find((b) => b.id === branchId)

  const filteredItems = stockItems.filter((i) => {
    const q = search.toLowerCase()
    return !q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
  })

  const openAddItem = () => {
    setEditingItem(null)
    setForm({ name: '', nameAr: '', sku: '', category: 'equipment', unit: 'pcs', minQuantity: 0, isActive: true })
    setItemDialog(true)
  }

  const saveItem = async () => {
    if (!form.name.trim() || !form.sku.trim()) return
    try {
      if (editingItem) await updateStockItem(editingItem.id, form)
      else await addStockItem(form)
      setItemDialog(false)
    } catch {
      toast.error(tc('error'))
    }
  }

  const saveQty = async () => {
    if (!qtyDialog || !branchId) return
    try {
      await upsertInventory(branchId, qtyDialog.stockItemId, qtyDialog.quantity)
      setQtyDialog(null)
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
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="stock">{t('stockItems')}</TabsTrigger>
          <TabsTrigger value="branch">{t('branchInventory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={tc('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
            </div>
            <Button onClick={openAddItem} className="gap-2"><Plus className="size-4" />{t('addItem')}</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Package className="size-5 text-primary" />
                    <Badge variant="outline">{t(`category.${item.category}`)}</Badge>
                  </div>
                  <CardTitle className="text-base">{localize(item)}</CardTitle>
                  <CardDescription>{item.sku} · {item.unit}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    {t('minQty')}: {item.minQuantity ?? 0}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setForm({ ...item, nameAr: item.nameAr || '', minQuantity: item.minQuantity ?? 0 }); setItemDialog(true) }}>
                    <Edit className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="branch" className="space-y-4 mt-4">
          {currentBranch && (
            <p className="text-sm text-muted-foreground">
              {t('viewingBranch')}: <strong>{localize(currentBranch)}</strong> ({currentBranch.code})
            </p>
          )}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('item')}</TableHead>
                    <TableHead>{t('sku')}</TableHead>
                    <TableHead>{t('categoryLabel')}</TableHead>
                    <TableHead>{tc('quantity')}</TableHead>
                    <TableHead>{t('minQty')}</TableHead>
                    <TableHead className="text-end">{tc('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.filter((i) => i.isActive).map((item) => {
                    const inv = branchInventory.find((i) => i.stockItemId === item.id)
                    const qty = inv?.quantity ?? 0
                    const low = item.minQuantity != null && qty < item.minQuantity
                    return (
                      <TableRow key={item.id} className={cn(low && 'bg-destructive/5')}>
                        <TableCell className="font-medium">{localize(item)}</TableCell>
                        <TableCell><Badge variant="outline">{item.sku}</Badge></TableCell>
                        <TableCell>{t(`category.${item.category}`)}</TableCell>
                        <TableCell>
                          <span className={cn('font-semibold', low && 'text-destructive')}>{qty}</span>
                          {low && <AlertTriangle className="inline ms-1 size-4 text-destructive" />}
                        </TableCell>
                        <TableCell>{item.minQuantity ?? '—'}</TableCell>
                        <TableCell className="text-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQtyDialog({ stockItemId: item.id, quantity: qty })}
                          >
                            {t('adjustQty')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? t('editItem') : t('addItem')}</DialogTitle>
            <DialogDescription>{t('itemFormHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('nameEn')}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('nameAr')}</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('sku')}</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>{t('categoryLabel')}</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as StockItemCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(`category.${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>{t('unit')}</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('minQty')}</Label><Input type="number" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: Number(e.target.value) })} /></div>
            </div>
            <Button onClick={saveItem} className="w-full">{tc('save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!qtyDialog} onOpenChange={() => setQtyDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('adjustQty')}</DialogTitle></DialogHeader>
          {qtyDialog && (
            <div className="space-y-4">
              <Input type="number" min={0} value={qtyDialog.quantity} onChange={(e) => setQtyDialog({ ...qtyDialog, quantity: Number(e.target.value) })} />
              <Button onClick={saveQty} className="w-full">{tc('save')}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
