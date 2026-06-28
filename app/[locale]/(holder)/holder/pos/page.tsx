'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { usePosCheckout } from '@/hooks/use-pos-checkout'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { getActiveProductsForEntity, filterProductsBySearch, getCartLineTotal, getCartLineDiscountAmount } from '@/lib/pos'
import { Customer } from '@/lib/types'
import { getCatalogIcon } from '@/lib/icons'
import {
  Plus, Minus, Trash2, CreditCard, Banknote, Building2, X, ShoppingCart,
  Check, Search, User, UserPlus, Percent, Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ReceiptDialog } from '@/components/receipt-dialog'
import { cn } from '@/lib/utils'

export default function HolderPOSPage() {
  const t = useTranslations('pos')
  const tc = useTranslations('common')
  const localizedName = useLocalizedName()
  const {
    entities,
    laundryServices,
    products,
    getProductsByEntity,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartItemDiscount,
    setCartGlobalDiscount,
    cartGlobalDiscount,
    customers,
    searchCustomers,
    addCustomer,
  } = useStore()

  const {
    selectedCustomer,
    setSelectedCustomer,
    orderTag,
    setOrderTag,
    notes,
    setNotes,
    paymentMethod,
    setPaymentMethod,
    lastInvoice,
    lastCustomerName,
    showReceipt,
    setShowReceipt,
    subtotal,
    totalDiscount,
    total,
    discountMode,
    cartItemCount,
    checkout,
    resetOrder,
    isCheckingOut,
  } = usePosCheckout()

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newCustomerCustomId, setNewCustomerCustomId] = useState('')

  const activeEntities = entities.filter((e) => e.isActive)
  const entityProducts = getActiveProductsForEntity(
    products,
    entities,
    laundryServices,
    selectedEntityId,
    getProductsByEntity,
  )
  const filteredProducts = filterProductsBySearch(entityProducts, laundryServices, searchQuery)

  const globalDiscountDisabled = discountMode === 'item'
  const itemDiscountDisabled = discountMode === 'global'

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 5)
    return searchCustomers(customerSearch)
  }, [customerSearch, customers, searchCustomers])

  const getServiceName = (serviceId: string) => {
    const service = laundryServices.find((s) => s.id === serviceId)
    return service ? localizedName(service) : ''
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearch(customer.customId || customer.name)
    setShowCustomerList(false)
  }

  const handleAddNewCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return
    const customer = await addCustomer({
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      customId: newCustomerCustomId.trim() || undefined,
    })
    setSelectedCustomer(customer)
    setCustomerSearch(customer.customId || customer.name)
    setShowAddCustomer(false)
    setNewCustomerName('')
    setNewCustomerPhone('')
    setNewCustomerCustomId('')
  }

  const handleCheckout = async () => {
    const invoice = await checkout()
    if (invoice) {
      setCheckoutOpen(false)
      setCartOpen(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="space-y-2 border-b border-border bg-card/50 p-3">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchProducts')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 ps-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={selectedEntityId === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEntityId(null)}
            className="shrink-0"
          >
            {t('all')}
          </Button>
        {activeEntities.map((entity) => {
          const EntityIcon = getCatalogIcon(entity.icon)
          return (
            <Button
              key={entity.id}
              variant={selectedEntityId === entity.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedEntityId(entity.id)}
              className="shrink-0 gap-1.5"
            >
              <EntityIcon className="size-3.5" />
              {localizedName(entity)}
            </Button>
          )
        })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <Tag className="mb-3 size-10 opacity-50" />
            <p className="text-sm">{t('selectEntityHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id)
              const ProductIcon = getCatalogIcon(product.icon)
              const serviceName = getServiceName(product.serviceId)
              return (
                <Card
                  key={product.id}
                  className={cn(
                    'cursor-pointer border-border transition-all active:scale-[0.98]',
                    cartItem ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-primary/50'
                  )}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <div className={cn(
                        'flex size-10 items-center justify-center rounded-xl',
                        cartItem ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                      )}>
                        <ProductIcon className="size-5" />
                      </div>
                      {cartItem && (
                        <Badge className="bg-primary text-primary-foreground">{cartItem.quantity}</Badge>
                      )}
                    </div>
                    <h3 className="line-clamp-1 font-medium text-foreground">{serviceName}</h3>
                    {product.nameAr && (
                      <p className="line-clamp-1 text-xs text-muted-foreground" dir="rtl">
                        {product.nameAr.split('—')[1]?.trim()}
                      </p>
                    )}
                    <p className="mt-2 text-lg font-bold text-primary">
                      {product.price.toFixed(3)} <span className="text-xs font-normal">OMR</span>
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="fixed bottom-20 end-4 z-40 h-14 gap-3 rounded-full px-6 shadow-lg shadow-primary/30">
              <ShoppingCart className="size-5" />
              <span className="font-semibold">{total.toFixed(3)} OMR</span>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">{cartItemCount}</Badge>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex h-[90vh] flex-col gap-0 overflow-hidden rounded-t-3xl p-0">
            <SheetHeader className="shrink-0 px-4 pb-2 pt-4">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-primary" />
                Cart ({cartItemCount})
              </SheetTitle>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 pb-4">
              <div className="shrink-0 space-y-2 rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="size-4 text-primary" /> Customer
                  </Label>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setShowAddCustomer(true)}>
                    <UserPlus className="size-3" /> New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('searchCustomerPlaceholder')}
                    value={customerSearch}
                    onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerList(true); if (!e.target.value) setSelectedCustomer(null) }}
                    onFocus={() => setShowCustomerList(true)}
                    className="h-9 ps-9"
                  />
                  {selectedCustomer && (
                    <Button variant="ghost" size="icon" className="absolute end-1 top-1/2 size-7 -translate-y-1/2"
                      onClick={() => { setSelectedCustomer(null); setCustomerSearch('') }}>
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
                {showCustomerList && !selectedCustomer && (
                  <div className="max-h-32 overflow-auto rounded-lg border border-border bg-background shadow-md">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-2 text-center text-xs text-muted-foreground">No customers found</div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <button key={customer.id} className="flex w-full items-center gap-2 p-2 text-left hover:bg-muted"
                          onClick={() => handleSelectCustomer(customer)}>
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="size-3 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{customer.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {[customer.customId, customer.phone].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
                <Input placeholder={t('orderTag')} value={orderTag}
                  onChange={(e) => setOrderTag(e.target.value.toUpperCase())} className="h-9" />
                <Textarea
                  placeholder={t('orderNotes')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                {cart.map((item) => {
                  const ItemIcon = getCatalogIcon(item.product.icon)
                  const itemTotal = getCartLineTotal(item)
                  const lineDiscountAmount = getCartLineDiscountAmount(item)
                  return (
                    <div key={item.product.id} className="rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ItemIcon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.product.price.toFixed(3)} OMR x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{itemTotal.toFixed(3)}</p>
                          <p className="text-xs text-muted-foreground">OMR</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <div className="flex flex-1 items-center gap-1">
                          <Percent className="size-3 text-muted-foreground" />
                          <Input type="number" step="1" min="0" max="100" placeholder="0"
                            value={item.discount || ''}
                            onChange={(e) => updateCartItemDiscount(item.product.id, Number(e.target.value))}
                            disabled={itemDiscountDisabled}
                            className="h-7 text-xs disabled:opacity-50" />
                        </div>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive"
                          onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      {item.discount && item.discount > 0 && (
                        <p className="mt-1 text-xs text-green-600">
                          {t('itemDiscount')}: -{lineDiscountAmount.toFixed(3)} OMR ({item.discount}%)
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              <Separator className="shrink-0" />

              <div className="shrink-0 rounded-lg border border-dashed border-border bg-muted/20 p-2.5">
                <Label className="text-[10px] font-medium uppercase text-muted-foreground">{t('globalDiscountPercent')}</Label>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Percent className="size-3 shrink-0 text-muted-foreground" />
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={cartGlobalDiscount || ''}
                    onChange={(e) => setCartGlobalDiscount(Number(e.target.value))}
                    placeholder="0"
                    disabled={globalDiscountDisabled}
                    className="h-8 text-xs disabled:opacity-50"
                  />
                </div>
                <p className="mt-1 text-[9px] text-muted-foreground">{t('discountModeHint')}</p>
              </div>

              <div className="shrink-0 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{subtotal.toFixed(3)} OMR</span></div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-destructive"><span>Discount</span><span>-{totalDiscount.toFixed(3)} OMR</span></div>
                )}
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{total.toFixed(3)} OMR</span></div>
              </div>
              <div className="shrink-0 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={resetOrder}><X className="me-2 size-4" /> {t('clearCart')}</Button>
                <Button className="flex-1" onClick={() => setCheckoutOpen(true)}>{t('checkout')}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="size-5 text-primary" /> Add Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name *</Label>
              <Input placeholder="Customer name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('customerPhone')} *</Label>
              <Input placeholder="96891234567" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('customId')}</Label>
              <Input placeholder={t('customIdPlaceholder')} value={newCustomerCustomId} onChange={(e) => setNewCustomerCustomId(e.target.value.toUpperCase())} className="h-10" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddCustomer(false)}>Cancel</Button>
            <Button onClick={handleAddNewCustomer} disabled={!newCustomerName.trim() || !newCustomerPhone.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t('confirmPayment')}</DialogTitle>
            <DialogDescription>{t('reviewTransaction')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
            {selectedCustomer && (
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4 text-primary" />
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{selectedCustomer.name}</span>
              </div>
            )}
            {orderTag && (
              <div className="flex items-center gap-2 text-sm">
                <Tag className="size-4 text-primary" />
                <span className="text-muted-foreground">Tag:</span>
                <span className="font-medium">{orderTag}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(3)} OMR</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'cash', label: 'Cash', icon: Banknote },
                { value: 'card', label: 'Card', icon: CreditCard },
                { value: 'transfer', label: 'Transfer', icon: Building2 },
              ].map((method) => (
                <Button key={method.value} type="button"
                  variant={paymentMethod === method.value ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(method.value as typeof paymentMethod)}
                  className="flex h-auto flex-col gap-1.5 py-3">
                  <method.icon className="size-5" />
                  <span className="text-xs">{method.label}</span>
                </Button>
              ))}
            </div>
          </div>
          <Button className="w-full gap-2" size="lg" onClick={handleCheckout}>
            <Check className="size-5" /> {t('confirmAndPrint')}
          </Button>
        </DialogContent>
      </Dialog>

      <ReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        invoice={lastInvoice}
        customerName={lastCustomerName}
      />
    </div>
  )
}
