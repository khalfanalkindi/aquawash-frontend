'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { usePosCheckout } from '@/hooks/use-pos-checkout'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { getActiveProductsForEntity, filterProductsBySearch, getCartLineTotal, getCartLineDiscountAmount } from '@/lib/pos'
import { Customer } from '@/lib/types'
import { getCatalogIcon } from '@/lib/icons'
import {
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Building2,
  X,
  Search,
  Check,
  ShoppingCart,
  Percent,
  User,
  UserPlus,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ReceiptDialog } from '@/components/receipt-dialog'

export default function AdminPOSPage() {
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
    getDiscountMode,
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
    resetOrder,
    checkout,
    isCheckingOut,
  } = usePosCheckout()

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '', customId: '' })

  const activeEntities = entities.filter((e) => e.isActive)
  const entityProducts = getActiveProductsForEntity(
    products,
    entities,
    laundryServices,
    selectedEntityId,
    getProductsByEntity,
  )
  const filteredProducts = filterProductsBySearch(entityProducts, laundryServices, searchQuery)

  const filteredCustomers = customerSearch.trim()
    ? searchCustomers(customerSearch)
    : customers.slice(0, 5)

  const globalDiscountDisabled = discountMode === 'item'
  const itemDiscountDisabled = discountMode === 'global'

  const getServiceName = (serviceId: string) => {
    const service = laundryServices.find((s) => s.id === serviceId)
    return service ? localizedName(service) : ''
  }

  const handleAddNewCustomer = async () => {
    if (!newCustomerData.name.trim() || !newCustomerData.phone.trim()) return
    const newCustomer = await addCustomer({
      name: newCustomerData.name.trim(),
      phone: newCustomerData.phone.trim(),
      customId: newCustomerData.customId.trim() || undefined,
    })
    setSelectedCustomer(newCustomer)
    setShowNewCustomer(false)
    setNewCustomerData({ name: '', phone: '', customId: '' })
  }

  const handleCheckout = async () => {
    const invoice = await checkout()
    if (invoice) {
      setCheckoutOpen(false)
      setCartOpen(false)
    }
  }

  const CartContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-5 text-primary" />
            Cart
            {cartItemCount > 0 && (
              <Badge variant="secondary" className="ml-1">{cartItemCount}</Badge>
            )}
          </h2>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={resetOrder}>
              <X className="mr-1 size-4" /> Clear
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[selectedCustomer.customId, selectedCustomer.phone].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelectedCustomer(null)}>
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Search className="size-4" />
                  Search customer...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-3">
                  <Input
                    placeholder={t('searchCustomerPlaceholder')}
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="max-h-60 overflow-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">No customers found</div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                        onClick={() => { setSelectedCustomer(customer); setCustomerSearch('') }}
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                          <User className="size-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {[customer.customId, customer.phone].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <Separator />
                <div className="p-2">
                  <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setShowNewCustomer(true)}>
                    <UserPlus className="size-4" />
                    Add New Customer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Input
            placeholder={t('orderTag')}
            value={orderTag}
            onChange={(e) => setOrderTag(e.target.value.toUpperCase())}
            className="h-9"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <ShoppingCart className="mx-auto mb-3 size-12 opacity-50" />
            <p>No items in cart</p>
            <p className="mt-1 text-sm">Select an item and service to add</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => {
              const Icon = getCatalogIcon(item.product.icon)
              const lineTotal = getCartLineTotal(item)
              const lineDiscountAmount = getCartLineDiscountAmount(item)
              return (
                <div key={item.product.id} className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product.price.toFixed(3)} OMR x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {lineTotal.toFixed(3)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Percent className="size-3 text-muted-foreground" />
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={item.discount || ''}
                        onChange={(e) => updateCartItemDiscount(item.product.id, Number(e.target.value))}
                        placeholder="0"
                        disabled={itemDiscountDisabled}
                        className="h-7 w-20 text-sm disabled:opacity-50"
                      />
                    </div>
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
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <Textarea placeholder="Order notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="resize-none text-sm" />
      </div>

      <div className="shrink-0 space-y-4 border-t border-border p-4">
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-xs font-medium">{t('globalDiscountPercent')}</Label>
            <span className="text-[10px] text-muted-foreground">{t('discountModeHint')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="number"
              step="1"
              min="0"
              max="100"
              value={cartGlobalDiscount || ''}
              onChange={(e) => setCartGlobalDiscount(Number(e.target.value))}
              placeholder="0"
              disabled={globalDiscountDisabled}
              className="h-9 disabled:opacity-50"
            />
          </div>
          {globalDiscountDisabled && (
            <p className="mt-1.5 text-[10px] text-muted-foreground">{t('clearItemDiscounts')}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span>{cartItemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{subtotal.toFixed(3)} OMR</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{totalDiscount.toFixed(3)} OMR</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">{total.toFixed(3)} OMR</span>
          </div>
        </div>
        <Button className="w-full" size="lg" disabled={cart.length === 0} onClick={() => setCheckoutOpen(true)}>
          Checkout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="relative h-[calc(100vh-7rem)]">
      <div className="flex h-full flex-col overflow-hidden pr-4">
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>

          {/* Entity selector */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Item Type</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedEntityId === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedEntityId(null)}
              >
                All
              </Button>
              {activeEntities.map((entity) => {
                const EntityIcon = getCatalogIcon(entity.icon)
                return (
                  <Button
                    key={entity.id}
                    variant={selectedEntityId === entity.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedEntityId(entity.id)}
                    className="gap-1.5 shrink-0"
                  >
                    <EntityIcon className="size-3.5" />
                    {entity.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Products grid (entity + service mapping) */}
        <ScrollArea className="flex-1">
          {!selectedEntityId ? (
            <div className="py-8 text-center text-muted-foreground">
              <Tag className="mx-auto mb-3 size-10 opacity-50" />
              <p>Select an item type to see available services and prices</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-24 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => {
                const ProductIcon = getCatalogIcon(product.icon)
                const cartItem = cart.find((item) => item.product.id === product.id)
                const serviceName = getServiceName(product.serviceId)
                return (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      cartItem ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ProductIcon className="size-5" />
                        </div>
                        {cartItem && <Badge variant="default">{cartItem.quantity}</Badge>}
                      </div>
                      <h3 className="line-clamp-1 font-medium">{serviceName}</h3>
                      {product.nameAr && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground" dir="rtl">
                          {product.nameAr.split('—')[1]?.trim()}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {activeEntities.find((e) => e.id === product.entityId)?.name}
                        </Badge>
                        <p className="font-bold text-primary">{product.price.toFixed(3)} OMR</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="fixed bottom-6 end-6 h-14 gap-2 rounded-full px-6 shadow-lg">
            <ShoppingCart className="size-5" />
            Cart
            {cartItemCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-white text-primary">{cartItemCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
          <SheetHeader className="sr-only"><SheetTitle>Shopping Cart</SheetTitle></SheetHeader>
          {CartContent}
        </SheetContent>
      </Sheet>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Transaction</DialogTitle>
            <DialogDescription>Select payment method to complete</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              {selectedCustomer && (
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <User className="size-4" />
                  <span className="font-medium">{selectedCustomer.name}</span>
                  {orderTag && <Badge variant="secondary" className="ml-auto">{orderTag}</Badge>}
                </div>
              )}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{subtotal.toFixed(3)} OMR</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{totalDiscount.toFixed(3)} OMR</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{total.toFixed(3)} OMR</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['cash', 'card', 'transfer'] as const).map((method) => (
                  <Button
                    key={method}
                    type="button"
                    variant={paymentMethod === method ? 'default' : 'outline'}
                    className="flex-col gap-1 py-4"
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === 'cash' && <Banknote className="size-5" />}
                    {method === 'card' && <CreditCard className="size-5" />}
                    {method === 'transfer' && <Building2 className="size-5" />}
                    <span className="text-xs capitalize">{method}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCheckout}>
                <Check className="mr-2 size-4" /> Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        invoice={lastInvoice}
        customerName={lastCustomerName}
      />

      <Dialog open={showNewCustomer} onOpenChange={setShowNewCustomer}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer for this order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custName">Name</Label>
              <Input id="custName" value={newCustomerData.name} onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })} placeholder="Customer name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custPhone">{t('customerPhone')}</Label>
              <Input id="custPhone" value={newCustomerData.phone} onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })} placeholder="968XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custCustomId">{t('customId')}</Label>
              <Input id="custCustomId" value={newCustomerData.customId} onChange={(e) => setNewCustomerData({ ...newCustomerData, customId: e.target.value.toUpperCase() })} placeholder={t('customIdPlaceholder')} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewCustomer(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddNewCustomer}>Add Customer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
