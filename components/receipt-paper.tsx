'use client'

import { forwardRef, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Invoice } from '@/lib/types'
import { useShopSettings } from '@/hooks/use-shop-settings'
import { shopDisplayName } from '@/lib/shop-info'
import { localizedName } from '@/lib/localized'
import { useStore } from '@/lib/store'
import { format } from 'date-fns'

export interface ReceiptPaperProps {
  invoice: Invoice
  customerName?: string
  className?: string
}

export const ReceiptPaper = forwardRef<HTMLDivElement, ReceiptPaperProps>(
  function ReceiptPaper({ invoice, customerName, className = '' }, ref) {
    const locale = useLocale()
    const t = useTranslations('receipt')
    const tc = useTranslations('common')
    const tp = useTranslations('pos')
    const shop = useShopSettings()
    const branches = useStore((s) => s.branches)

    const shopName = shopDisplayName(shop, locale)
    const altShopName = locale === 'en' && shop.nameAr ? shop.nameAr : shop.name
    const tagline = shop.tagline || t('tagline')
    const paymentLabel =
      invoice.paymentMethod === 'cash'
        ? tc('cash')
        : invoice.paymentMethod === 'card'
          ? tc('card')
          : tc('transfer')

    const branchLabel = useMemo(() => {
      const fromStore = branches.find((b) => b.id === invoice.branchId)
      if (invoice.branchName || invoice.branchNameAr) {
        return localizedName(
          { name: invoice.branchName ?? fromStore?.name ?? '', nameAr: invoice.branchNameAr ?? fromStore?.nameAr },
          locale,
        )
      }
      if (fromStore) return localizedName(fromStore, locale)
      return null
    }, [branches, invoice.branchId, invoice.branchName, invoice.branchNameAr, locale])

    const branchCode =
      invoice.branchCode ?? branches.find((b) => b.id === invoice.branchId)?.code

    return (
      <div
        ref={ref}
        className={`receipt-print mx-auto box-border w-[80mm] max-w-[80mm] overflow-hidden bg-white p-2 font-mono text-[10px] leading-snug text-black ${className}`}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="border-b border-dashed border-black pb-2 text-center">
          <p className="text-sm font-bold uppercase tracking-wide">{shopName}</p>
          {locale === 'en' && shop.nameAr && altShopName !== shopName && (
            <p className="text-[10px]" dir="rtl">{shop.nameAr}</p>
          )}
          {tagline && <p className="mt-0.5 text-[10px]">{tagline}</p>}
          {shop.phone && <p className="text-[10px]">{shop.phone}</p>}
          {shop.address && <p className="text-[10px]">{shop.address}</p>}
        </div>

        <div className="border-b border-dashed border-black py-2">
          <div className="flex justify-between gap-1">
            <span className="shrink-0">{t('invoice')}:</span>
            <span className="min-w-0 truncate text-end font-bold">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span className="shrink-0">{t('date')}:</span>
            <span className="min-w-0 truncate text-end">{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          {branchLabel && (
            <div className="flex justify-between gap-1">
              <span className="shrink-0">{t('branch')}:</span>
              <span className="min-w-0 truncate text-end font-semibold">
                {branchLabel}
                {branchCode ? ` (${branchCode})` : ''}
              </span>
            </div>
          )}
          {invoice.orderTag && (
            <div className="flex justify-between gap-1">
              <span className="shrink-0">{t('order')}:</span>
              <span className="min-w-0 truncate text-end font-bold">{invoice.orderTag}</span>
            </div>
          )}
        </div>

        {(customerName || invoice.customerName || invoice.customerPhone) && (
          <div className="border-b border-dashed border-black py-2">
            <p className="mb-1 font-bold uppercase">{t('customer')}</p>
            {(customerName || invoice.customerName) && (
              <div className="flex justify-between gap-1">
                <span className="shrink-0">{t('customer')}:</span>
                <span className="min-w-0 truncate text-end font-semibold">{customerName || invoice.customerName}</span>
              </div>
            )}
            {invoice.customerPhone && (
              <div className="flex justify-between gap-1">
                <span className="shrink-0">{t('phone')}:</span>
                <span className="min-w-0 truncate text-end">{invoice.customerPhone}</span>
              </div>
            )}
          </div>
        )}

        <div className="border-b border-dashed border-black py-2">
          <div className="mb-1 grid grid-cols-[minmax(0,1fr)_22px_36px_36px] gap-0.5 text-[9px] font-bold uppercase">
            <span>{t('item')}</span>
            <span className="text-center">{t('qty')}</span>
            <span className="text-end">{tc('price')}</span>
            <span className="text-end">{t('amount')}</span>
          </div>
          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_22px_36px_36px] gap-0.5 border-t border-dotted border-gray-300 py-1">
              <span className="break-words pe-0.5">{item.productName}</span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-end tabular-nums">{item.unitPrice.toFixed(3)}</span>
              <span className="text-end tabular-nums">{item.totalPrice.toFixed(3)}</span>
            </div>
          ))}
        </div>

        <div className="py-2">
          <div className="flex justify-between gap-1">
            <span className="shrink-0">{tc('subtotal')}</span>
            <span className="min-w-0 truncate text-end tabular-nums">{invoice.subtotal.toFixed(3)} {shop.currency}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between gap-1">
              <span className="shrink-0">{tc('discount')}</span>
              <span className="min-w-0 truncate text-end tabular-nums">-{invoice.discount.toFixed(3)} {shop.currency}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between gap-1 border-t border-black pt-1 text-xs font-bold">
            <span className="shrink-0">{tc('total').toUpperCase()}</span>
            <span className="min-w-0 truncate text-end tabular-nums">{invoice.total.toFixed(3)} {shop.currency}</span>
          </div>
          <div className="mt-1 flex justify-between text-[10px]">
            <span>{t('payment')}</span>
            <span className="uppercase">{paymentLabel}</span>
          </div>
          {invoice.notes && (
            <p className="mt-1 text-[10px] text-gray-600">{tc('notes')}: {invoice.notes}</p>
          )}
        </div>

        <div className="border-t border-dashed border-black pt-2 text-center">
          <p className="font-bold">{shop.receiptFooter || tp('thankYou')}</p>
          <p className="mt-1 text-[9px] text-gray-500">{t('pickupNote')}</p>
        </div>
      </div>
    )
  }
)

export function printReceipt(element: HTMLElement | null) {
  if (!element) return
  const printRoot = document.getElementById('receipt-print-root')
  if (!printRoot) return
  printRoot.innerHTML = ''
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = '80mm'
  clone.style.maxWidth = '80mm'
  clone.style.boxSizing = 'border-box'
  clone.style.margin = '0'
  printRoot.appendChild(clone)
  window.print()
}
