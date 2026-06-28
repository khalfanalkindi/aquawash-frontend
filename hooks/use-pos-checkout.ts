'use client'

import { useCallback, useState } from 'react'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { useStore } from '@/lib/store'
import { buildInvoiceItemsFromCart } from '@/lib/pos'
import type { Customer, Invoice, PaymentMethod } from '@/lib/types'

export function usePosCheckout() {
  const { user } = useAuth()
  const locale = useLocale()
  const {
    cart,
    clearCart,
    getCartSubtotal,
    getCartTotal,
    getCartTotalDiscount,
    getDiscountMode,
    addInvoice,
    currentBranchId,
    branches,
  } = useStore()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [orderTag, setOrderTag] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null)
  const [lastCustomerName, setLastCustomerName] = useState<string | undefined>()
  const [showReceipt, setShowReceipt] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = getCartSubtotal()
  const totalDiscount = getCartTotalDiscount()
  const total = getCartTotal()
  const discountMode = getDiscountMode()
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const resetOrder = useCallback(() => {
    clearCart()
    setSelectedCustomer(null)
    setOrderTag('')
    setNotes('')
    setPaymentMethod('cash')
  }, [clearCart])

  const checkout = useCallback(async () => {
    if (cart.length === 0 || isCheckingOut) return null

    const branchId =
      currentBranchId ?? branches.find((b) => b.isActive)?.id ?? branches[0]?.id
    if (!branchId) {
      toast.error(locale === 'ar' ? 'اختر فرعاً أولاً' : 'Select a branch first')
      return null
    }

    setIsCheckingOut(true)
    try {
      const items = buildInvoiceItemsFromCart(cart, discountMode)

      const invoice = await addInvoice({
        branchId,
        customerPhone: selectedCustomer?.phone || undefined,
        customerName: selectedCustomer?.name || undefined,
        orderTag: orderTag || undefined,
        items,
        subtotal,
        discount: totalDiscount,
        total,
        status: 'completed',
        paymentMethod,
        notes: notes || undefined,
        createdBy: user?.id || '',
      })

      setLastInvoice(invoice)
      setLastCustomerName(selectedCustomer?.name)
      clearCart()
      setShowReceipt(true)
      setSelectedCustomer(null)
      setOrderTag('')
      setNotes('')
      setPaymentMethod('cash')

      toast.success(locale === 'ar' ? 'تم إتمام الطلب' : 'Order completed')
      return invoice
    } catch {
      toast.error(locale === 'ar' ? 'فشل إتمام الطلب' : 'Checkout failed')
      return null
    } finally {
      setIsCheckingOut(false)
    }
  }, [
    cart,
    isCheckingOut,
    discountMode,
    currentBranchId,
    branches,
    addInvoice,
    selectedCustomer,
    orderTag,
    subtotal,
    totalDiscount,
    total,
    paymentMethod,
    notes,
    user?.id,
    clearCart,
    locale,
  ])

  return {
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
    isCheckingOut,
    resetOrder,
    checkout,
  }
}
