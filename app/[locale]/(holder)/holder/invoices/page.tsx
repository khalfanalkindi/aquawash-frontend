'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { resolveCustomerName } from '@/lib/invoice-utils'
import { ReceiptDialog } from '@/components/receipt-dialog'
import { Search, Printer, X, FileText, Calendar, CreditCard, Banknote, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const paymentIcons = {
  cash: Banknote,
  card: CreditCard,
  transfer: Building2,
}

export default function HolderInvoicesPage() {
  const { customers, currentBranchId, getInvoicesForBranch } = useStore()
  const t = useTranslations('invoices')
  const branchInvoices = getInvoicesForBranch(currentBranchId)
  const [searchQuery, setSearchQuery] = useState('')
  const [receiptInvoice, setReceiptInvoice] = useState<(typeof branchInvoices)[0] | null>(null)

  const filteredInvoices = useMemo(() => {
    const sorted = [...branchInvoices].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    if (!searchQuery.trim()) return sorted.slice(0, 50)

    const query = searchQuery.toLowerCase().trim()
    return sorted.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.customerPhone?.includes(query) ||
        inv.orderTag?.toLowerCase().includes(query)
    )
  }, [branchInvoices, searchQuery])

  const getCustomerName = useCallback(
    (invoice: (typeof branchInvoices)[0]) => resolveCustomerName(invoice, customers),
    [customers]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-200'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-200'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card/50 p-4">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 ps-10 pe-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-1 top-1/2 size-8 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No invoices found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Invoices will appear here after checkout'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => {
              const PaymentIcon = paymentIcons[invoice.paymentMethod] || Banknote
              return (
                <Card key={invoice.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{invoice.invoiceNumber}</p>
                          <Badge variant="outline" className={cn('text-[10px]', getStatusColor(invoice.status))}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                        {invoice.orderTag && (
                          <p className="mt-2 text-sm">
                            <span className="text-muted-foreground">Tag:</span>{' '}
                            <span className="font-medium">{invoice.orderTag}</span>
                          </p>
                        )}
                        {getCustomerName(invoice) && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {getCustomerName(invoice)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                          <PaymentIcon className="size-4" />
                          <span className="text-xs capitalize">{invoice.paymentMethod}</span>
                        </div>
                        <p className="mt-1 text-xl font-bold text-primary">{invoice.total.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground">OMR</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-8 gap-1.5 text-xs"
                          onClick={() => setReceiptInvoice(invoice)}
                        >
                          <Printer className="size-3.5" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <ReceiptDialog
        open={!!receiptInvoice}
        onOpenChange={(open) => !open && setReceiptInvoice(null)}
        invoice={receiptInvoice}
        customerName={receiptInvoice ? getCustomerName(receiptInvoice) : undefined}
        title={receiptInvoice ? `Receipt — ${receiptInvoice.invoiceNumber}` : 'Receipt'}
        showSuccessIcon={false}
      />
    </div>
  )
}
