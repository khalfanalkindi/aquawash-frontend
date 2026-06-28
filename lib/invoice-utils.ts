import { Customer, Invoice } from './types'

export function resolveCustomerName(invoice: Invoice, customers: Customer[]): string | undefined {
  if (invoice.customerName) return invoice.customerName
  if (!invoice.customerPhone) return undefined
  return customers.find((c) => c.phone === invoice.customerPhone)?.name
}
