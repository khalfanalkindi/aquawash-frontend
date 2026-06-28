import { apiClient } from './client'
import { toNumId } from './constants'
import { mapCustomer, mapInvoice, mapList, mapOne } from './mappers'
import type { CreateInvoiceRequest } from './types'
import type { Customer, Invoice } from '@/lib/types'

export async function fetchCustomers() {
  const data = await apiClient<unknown[]>('/sales/customers/')
  return mapList(data, mapCustomer)
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
  const data = await apiClient<unknown>('/sales/customers/', {
    method: 'POST',
    body: {
      type: customer.type,
      custom_id: customer.customId ?? '',
      name: customer.name,
      name_ar: customer.nameAr ?? '',
      phone: customer.phone,
      email: customer.email ?? '',
      contact_person: customer.contactPerson ?? '',
      address: customer.address ?? '',
      tax_id: customer.taxId ?? '',
      notes: customer.notes ?? '',
    },
  })
  return mapOne(data, mapCustomer)
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const body: Record<string, unknown> = {}
  if (customer.type !== undefined) body.type = customer.type
  if (customer.customId !== undefined) body.custom_id = customer.customId
  if (customer.name !== undefined) body.name = customer.name
  if (customer.nameAr !== undefined) body.name_ar = customer.nameAr
  if (customer.phone !== undefined) body.phone = customer.phone
  if (customer.email !== undefined) body.email = customer.email
  if (customer.contactPerson !== undefined) body.contact_person = customer.contactPerson
  if (customer.address !== undefined) body.address = customer.address
  if (customer.taxId !== undefined) body.tax_id = customer.taxId
  if (customer.notes !== undefined) body.notes = customer.notes
  const data = await apiClient<unknown>(`/sales/customers/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapCustomer)
}

export async function deleteCustomer(id: string) {
  return apiClient<void>(`/sales/customers/${id}/`, { method: 'DELETE' })
}

export async function fetchInvoices(branchId?: string) {
  const query = branchId ? `?branch_id=${branchId}` : ''
  const data = await apiClient<unknown[]>(`/sales/invoices/${query}`)
  return mapList(data, mapInvoice)
}

export async function createInvoice(data: CreateInvoiceRequest) {
  const body = {
    branch_id: toNumId(data.branch_id),
    customer_phone: data.customer_phone ?? '',
    customer_name: data.customer_name ?? '',
    order_tag: data.order_tag ?? '',
    items: data.items.map((item) => ({
      product_id: toNumId(item.product_id),
      quantity: item.quantity,
      line_discount: item.line_discount ?? 0,
    })),
    discount: data.discount,
    payment_method: data.payment_method,
    notes: data.notes ?? '',
    status: data.status ?? 'completed',
  }
  const result = await apiClient<unknown>('/sales/invoices/', { method: 'POST', body })
  return mapOne(result, mapInvoice)
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']) {
  const data = await apiClient<unknown>(`/sales/invoices/${id}/`, {
    method: 'PATCH',
    body: { status },
  })
  return mapOne(data, mapInvoice)
}

export async function deleteInvoice(id: string) {
  return apiClient<void>(`/sales/invoices/${id}/`, { method: 'DELETE' })
}
