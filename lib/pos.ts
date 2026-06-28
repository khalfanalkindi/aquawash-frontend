import type { CartItem, Entity, InvoiceItem, LaundryService, Product } from '@/lib/types'

export function getCartLineSubtotal(item: CartItem): number {
  return item.product.price * item.quantity
}

/** Cart item `discount` is stored as a percentage (0–100). */
export function getCartLineDiscountAmount(item: CartItem): number {
  return getCartLineSubtotal(item) * ((item.discount || 0) / 100)
}

export function getCartLineTotal(item: CartItem): number {
  return getCartLineSubtotal(item) - getCartLineDiscountAmount(item)
}

export function buildInvoiceItemsFromCart(
  cart: CartItem[],
  discountMode: 'none' | 'global' | 'item',
): InvoiceItem[] {
  return cart.map((item, index) => {
    const lineSubtotal = getCartLineSubtotal(item)
    const lineDiscount = discountMode === 'item' ? getCartLineDiscountAmount(item) : 0
    return {
      id: String(index),
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineDiscount: lineDiscount > 0 ? lineDiscount : undefined,
      totalPrice: lineSubtotal - lineDiscount,
    }
  })
}

export function getActiveProductsForEntity(
  products: Product[],
  entities: Entity[],
  laundryServices: LaundryService[],
  entityId: string | null,
  getProductsByEntity: (entityId: string) => Product[],
): Product[] {
  if (entityId) return getProductsByEntity(entityId)
  return products.filter((p) => {
    const entity = entities.find((e) => e.id === p.entityId)
    const service = laundryServices.find((s) => s.id === p.serviceId)
    return p.isActive && entity?.isActive && service?.isActive
  })
}

export function filterProductsBySearch(
  products: Product[],
  laundryServices: LaundryService[],
  query: string,
): Product[] {
  const q = query.toLowerCase().trim()
  if (!q) return products
  return products.filter((p) => {
    const service = laundryServices.find((s) => s.id === p.serviceId)
    return (
      p.name.toLowerCase().includes(q) ||
      p.nameAr?.toLowerCase().includes(q) ||
      service?.name.toLowerCase().includes(q) ||
      service?.nameAr?.toLowerCase().includes(q)
    )
  })
}
