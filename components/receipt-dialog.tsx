'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Invoice } from '@/lib/types'
import { ReceiptPaper, printReceipt } from '@/components/receipt-paper'
import { downloadReceiptPng } from '@/lib/receipt-export'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, Download, Loader2, Printer, X } from 'lucide-react'
import { toast } from 'sonner'

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  customerName?: string
  title?: string
  showSuccessIcon?: boolean
}

export function ReceiptDialog({
  open,
  onOpenChange,
  invoice,
  customerName,
  title,
  showSuccessIcon = true,
}: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const t = useTranslations('pos')
  const tc = useTranslations('common')

  if (!invoice) return null

  const handlePrint = () => {
    printReceipt(receiptRef.current)
  }

  const handleDownloadPng = async () => {
    if (!receiptRef.current) return
    setIsDownloading(true)
    try {
      await downloadReceiptPng(receiptRef.current, invoice.invoiceNumber)
    } catch {
      toast.error(tc('error'))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showSuccessIcon && <Check className="size-5 text-green-600" />}
            {title ?? t('transactionComplete')}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto rounded-lg border border-border bg-muted/30 p-4">
          <ReceiptPaper ref={receiptRef} invoice={invoice} customerName={customerName} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="me-2 size-4" /> {tc('close')}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPng}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="me-2 size-4 animate-spin" />
            ) : (
              <Download className="me-2 size-4" />
            )}
            {t('downloadReceipt')}
          </Button>
          <Button className="flex-1" onClick={handlePrint}>
            <Printer className="me-2 size-4" /> {t('printReceipt')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
