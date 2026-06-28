'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Entity, LaundryService, Product } from '@/lib/types'
import { getCatalogIcon } from '@/lib/icons'
import { buildProductFromMapping } from '@/lib/dummy-data'
import {
  Plus, Pencil, Trash2, Search, Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export default function AdminServicesPage() {
  const {
    entities, laundryServices, products,
    addEntity, updateEntity, deleteEntity, toggleEntityActive,
    addLaundryService, updateLaundryService, deleteLaundryService, toggleLaundryServiceActive,
    addProduct, updateProduct, deleteProduct, toggleProductActive,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'entity' | 'service' | 'product'; id: string } | null>(null)

  // Entity form
  const [entityDialogOpen, setEntityDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [entityForm, setEntityForm] = useState({ name: '', nameAr: '', category: 'Casual' })

  // Service form
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<LaundryService | null>(null)
  const [serviceForm, setServiceForm] = useState({ name: '', nameAr: '', durationMinutes: '30' })

  // Product form
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({ entityId: '', serviceId: '', price: '' })

  const q = searchQuery.toLowerCase()
  const filteredEntities = entities.filter((e) => e.name.toLowerCase().includes(q) || e.nameAr?.toLowerCase().includes(q))
  const filteredServices = laundryServices.filter((s) => s.name.toLowerCase().includes(q) || s.nameAr?.toLowerCase().includes(q))
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(q) || p.nameAr?.toLowerCase().includes(q))

  const getEntityName = (id: string) => entities.find((e) => e.id === id)?.name ?? '-'
  const getServiceName = (id: string) => laundryServices.find((s) => s.id === id)?.name ?? '-'

  const handleEntitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { name: entityForm.name, nameAr: entityForm.nameAr || undefined, category: entityForm.category, isActive: true }
    if (editingEntity) updateEntity(editingEntity.id, data)
    else addEntity(data)
    setEntityDialogOpen(false)
    setEditingEntity(null)
    setEntityForm({ name: '', nameAr: '', category: 'Casual' })
  }

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: serviceForm.name,
      nameAr: serviceForm.nameAr || undefined,
      durationMinutes: parseInt(serviceForm.durationMinutes),
      isActive: true,
    }
    if (editingService) updateLaundryService(editingService.id, data)
    else addLaundryService(data)
    setServiceDialogOpen(false)
    setEditingService(null)
    setServiceForm({ name: '', nameAr: '', durationMinutes: '30' })
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entity = entities.find((en) => en.id === productForm.entityId)
    const service = laundryServices.find((s) => s.id === productForm.serviceId)
    if (!entity || !service) return

    const base = buildProductFromMapping(entity, service, parseFloat(productForm.price))
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...base, price: parseFloat(productForm.price) })
    } else {
      addProduct({ ...base, price: parseFloat(productForm.price) })
    }
    setProductDialogOpen(false)
    setEditingProduct(null)
    setProductForm({ entityId: '', serviceId: '', price: '' })
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type === 'entity') deleteEntity(deleteConfirm.id)
    else if (deleteConfirm.type === 'service') deleteLaundryService(deleteConfirm.id)
    else deleteProduct(deleteConfirm.id)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Catalog</h1>
        <p className="text-sm text-muted-foreground">
          Manage item types, services, and product pricing (entity + service mapping)
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="entities">Entities ({entities.length})</TabsTrigger>
          <TabsTrigger value="services">Services ({laundryServices.length})</TabsTrigger>
          <TabsTrigger value="products">Products / Pricing ({products.length})</TabsTrigger>
        </TabsList>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={entityDialogOpen} onOpenChange={setEntityDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => { setEditingEntity(null); setEntityForm({ name: '', nameAr: '', category: 'Casual' }) }}>
                  <Plus className="h-4 w-4" /> Add Entity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEntity ? 'Edit Entity' : 'Add Entity'}</DialogTitle>
                  <DialogDescription>Garment or item type (cap, t-shirt, dishdasha...)</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEntitySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name (English)</Label>
                      <Input value={entityForm.name} onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Arabic)</Label>
                      <Input value={entityForm.nameAr} onChange={(e) => setEntityForm({ ...entityForm, nameAr: e.target.value })} dir="rtl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={entityForm.category} onValueChange={(v) => setEntityForm({ ...entityForm, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Accessories', 'Casual', 'Traditional', 'Household'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">{editingEntity ? 'Update' : 'Create'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>
                      <p className="font-medium">{entity.name}</p>
                      {entity.nameAr && <p className="text-sm text-muted-foreground" dir="rtl">{entity.nameAr}</p>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{entity.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={entity.isActive ? 'default' : 'secondary'}>{entity.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleEntityActive(entity.id)}>
                          <Power className={`h-4 w-4 ${entity.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setEditingEntity(entity)
                          setEntityForm({ name: entity.name, nameAr: entity.nameAr || '', category: entity.category || 'Casual' })
                          setEntityDialogOpen(true)
                        }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm({ type: 'entity', id: entity.id })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => { setEditingService(null); setServiceForm({ name: '', nameAr: '', durationMinutes: '30' }) }}>
                  <Plus className="h-4 w-4" /> Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
                  <DialogDescription>Laundry service type (wash, iron, express...)</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name (English)</Label>
                      <Input value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Arabic)</Label>
                      <Input value={serviceForm.nameAr} onChange={(e) => setServiceForm({ ...serviceForm, nameAr: e.target.value })} dir="rtl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input type="number" min="5" value={serviceForm.durationMinutes} onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full">{editingService ? 'Update' : 'Create'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <p className="font-medium">{service.name}</p>
                      {service.nameAr && <p className="text-sm text-muted-foreground" dir="rtl">{service.nameAr}</p>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{service.durationMinutes} min</TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? 'default' : 'secondary'}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleLaundryServiceActive(service.id)}>
                          <Power className={`h-4 w-4 ${service.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setEditingService(service)
                          setServiceForm({ name: service.name, nameAr: service.nameAr || '', durationMinutes: String(service.durationMinutes || 30) })
                          setServiceDialogOpen(true)
                        }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm({ type: 'service', id: service.id })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => { setEditingProduct(null); setProductForm({ entityId: '', serviceId: '', price: '' }) }}>
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                  <DialogDescription>Map an entity + service with a price (POS sellable item)</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Entity (Item Type)</Label>
                    <Select value={productForm.entityId} onValueChange={(v) => setProductForm({ ...productForm, entityId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select entity" /></SelectTrigger>
                      <SelectContent>
                        {entities.filter((e) => e.isActive).map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select value={productForm.serviceId} onValueChange={(v) => setProductForm({ ...productForm, serviceId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>
                        {laundryServices.filter((s) => s.isActive).map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price (OMR)</Label>
                    <Input type="number" step="0.001" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                  </div>
                  {productForm.entityId && productForm.serviceId && (
                    <p className="rounded-lg bg-muted p-2 text-sm text-muted-foreground">
                      Preview: {getEntityName(productForm.entityId)} — {getServiceName(productForm.serviceId)}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={!productForm.entityId || !productForm.serviceId || !productForm.price}>
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const Icon = getCatalogIcon(product.icon)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.nameAr && <p className="text-xs text-muted-foreground" dir="rtl">{product.nameAr}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getEntityName(product.entityId)}</TableCell>
                      <TableCell>{getServiceName(product.serviceId)}</TableCell>
                      <TableCell className="font-medium">{product.price.toFixed(3)} OMR</TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleProductActive(product.id)}>
                            <Power className={`h-4 w-4 ${product.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            setEditingProduct(product)
                            setProductForm({ entityId: product.entityId, serviceId: product.serviceId, price: String(product.price) })
                            setProductDialogOpen(true)
                          }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
