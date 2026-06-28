'use client'

import { useState, useMemo, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { usePermissions } from '@/hooks/use-permissions'
import { resolveCustomerName } from '@/lib/invoice-utils'
import { ReceiptDialog } from '@/components/receipt-dialog'
import {
  Search,
  Printer,
  Trash2,
  Eye,
  X,
  FileText,
  Filter,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Invoice } from '@/lib/types'
import { format } from 'date-fns'

export default function AdminInvoicesPage() {
  const { customers, deleteInvoice, updateInvoice, currentBranchId, getInvoicesForBranch } = useStore()
  const { can } = usePermissions()
  const branchInvoices = getInvoicesForBranch(currentBranchId)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredInvoices = useMemo(() => {
    return branchInvoices.filter((inv) => {
      const matchesSearch =
        !searchQuery.trim() ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerPhone?.includes(searchQuery) ||
        inv.orderTag?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [branchInvoices, searchQuery, statusFilter])

  const getCustomerName = useCallback(
    (invoice: Invoice) => resolveCustomerName(invoice, customers),
    [customers]
  )

  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Date', 'Order Tag', 'Phone', 'Total', 'Status', 'Payment']
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      format(new Date(inv.createdAt), 'dd/MM/yyyy HH:mm'),
      inv.orderTag || '-',
      inv.customerPhone || '-',
      inv.total.toFixed(3),
      inv.status,
      inv.paymentMethod,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleDelete = (id: string) => {
    deleteInvoice(id)
    setDeleteConfirm(null)
  }

  const handleStatusChange = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    updateInvoice(id, { status })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">View and manage all invoices</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice #, phone, or order tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium">Invoice #</TableHead>
                  <TableHead className="hidden font-medium md:table-cell">Date</TableHead>
                  <TableHead className="hidden font-medium sm:table-cell">Order Tag</TableHead>
                  <TableHead className="font-medium">Total</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="text-right font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {format(new Date(invoice.createdAt), 'dd/MM/yy HH:mm')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="hidden text-foreground sm:table-cell">
                      {invoice.orderTag || '-'}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {invoice.total.toFixed(3)} OMR
                    </TableCell>
                    <TableCell>
                      <Select
                        value={invoice.status}
                        onValueChange={(value) =>
                          handleStatusChange(invoice.id, value as Invoice['status'])
                        }
                      >
                        <SelectTrigger className={`h-7 w-[110px] text-xs ${getStatusColor(invoice.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View details"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Print receipt"
                          onClick={() => setReceiptInvoice(invoice)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        {can('invoices.delete') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(invoice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invoice summary dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice #</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedInvoice.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                {getCustomerName(selectedInvoice) && (
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{getCustomerName(selectedInvoice)}</p>
                  </div>
                )}
                {selectedInvoice.customerPhone && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedInvoice.customerPhone}</p>
                  </div>
                )}
                {selectedInvoice.orderTag && (
                  <div>
                    <p className="text-muted-foreground">Order Tag</p>
                    <p className="font-medium">{selectedInvoice.orderTag}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Products</h3>
                {selectedInvoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.productName} x{item.quantity}
                    </span>
                    <span>{item.totalPrice.toFixed(3)} OMR</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{selectedInvoice.subtotal.toFixed(3)} OMR</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Discount</span>
                    <span>-{selectedInvoice.discount.toFixed(3)} OMR</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">{selectedInvoice.total.toFixed(3)} OMR</span>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => {
                  setReceiptInvoice(selectedInvoice)
                  setSelectedInvoice(null)
                }}
              >
                <Printer className="h-4 w-4" />
                View & Print Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ReceiptDialog
        open={!!receiptInvoice}
        onOpenChange={(open) => !open && setReceiptInvoice(null)}
        invoice={receiptInvoice}
        customerName={receiptInvoice ? getCustomerName(receiptInvoice) : undefined}
        title={receiptInvoice ? `Receipt — ${receiptInvoice.invoiceNumber}` : 'Receipt'}
        showSuccessIcon={false}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
