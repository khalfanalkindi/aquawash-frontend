import type {
  Branch,
  Contract,
  Customer,
  Entity,
  Inventory,
  Invoice,
  InvoiceItem,
  LaundryService,
  Permission,
  Product,
  Role,
  RolePermission,
  Stakeholder,
  StockItem,
  User,
  UserPermission,
} from '@/lib/types'
import { toId } from './constants'

type ApiEntity = {
  id: number
  name: string
  name_ar?: string
  category?: string | null
  description?: string
  icon?: string
  is_active: boolean
}

type ApiService = {
  id: number
  name: string
  name_ar?: string
  description?: string
  duration_minutes?: number | null
  icon?: string
  is_active: boolean
}

type ApiProduct = {
  id: number
  entity_id: number
  service_id: number
  name: string
  name_ar?: string
  price: string | number
  icon?: string
  is_active: boolean
}

type ApiBranch = {
  id: number
  name: string
  name_ar?: string
  code: string
  address?: string
  phone?: string
  is_active: boolean
  created_at: string
}

type ApiCustomer = {
  id: number
  type: Customer['type']
  custom_id?: string
  name: string
  name_ar?: string
  phone: string
  email?: string
  contact_person?: string
  address?: string
  tax_id?: string
  notes?: string
  created_at: string
}

type ApiInvoiceItem = {
  id: number
  product_id?: number | null
  product_name: string
  quantity: number
  unit_price: string | number
  line_discount?: string | number
  total_price: string | number
}

type ApiInvoice = {
  id: number
  invoice_number: string
  branch_id: number | null
  branch_name?: string | null
  branch_name_ar?: string | null
  branch_code?: string | null
  customer_phone?: string
  customer_name?: string
  order_tag?: string
  items: ApiInvoiceItem[]
  subtotal: string | number
  discount: string | number
  total: string | number
  status: string
  payment_method: string
  notes?: string
  created_by: number
  created_at: string
}

type ApiUserRecord = {
  id: number
  username: string
  full_name: string
  role: string
  role_id?: number | null
  role_name?: string
  role_code?: string | null
  is_active: boolean
  branch_ids?: number[]
  default_branch_id?: number | null
}

type ApiRole = {
  id: number
  code?: string
  name: string
  description?: string
  is_active: boolean
  created_at?: string
}

type ApiPermission = {
  id: number
  code: string
  name: string
  module: string
  description?: string
  is_active: boolean
}

type ApiRolePermission = { id: number; role: number; permission: number }
type ApiUserPermission = { id: number; user: number; permission: number }

type ApiStockItem = {
  id: number
  name: string
  name_ar?: string
  sku: string
  category: StockItem['category']
  unit: string
  min_quantity?: number | null
  is_active: boolean
}

type ApiInventory = {
  id: number
  branch_id: number
  stock_item_id: number
  quantity: number
  updated_at: string
  stock_item?: ApiStockItem
}

type ApiStakeholder = {
  id: number
  type: Stakeholder['type']
  name: string
  name_ar?: string
  phone?: string
  email?: string
  contact_person?: string
  address?: string
  tax_id?: string
  notes?: string
  is_active: boolean
  created_at: string
}

type ApiContract = {
  id: number
  contract_number: string
  party_type: Contract['partyType']
  party_id: number
  branch_id: number
  purpose: Contract['purpose']
  title: string
  start_date: string
  end_date: string | null
  status: Contract['status']
  monthly_value?: string | number | null
  terms?: string
  notes?: string
  created_at: string
}

const num = (v: string | number) => (typeof v === 'number' ? v : parseFloat(v))

export function mapList<M extends (arg: never) => unknown>(
  items: unknown[],
  mapper: M,
): ReturnType<M>[] {
  return items.map((item) => mapper(item as Parameters<M>[0])) as ReturnType<M>[]
}

export function mapOne<M extends (arg: never) => unknown>(item: unknown, mapper: M): ReturnType<M> {
  return mapper(item as Parameters<M>[0]) as ReturnType<M>
}

export function mapApiUser(apiUser: ApiUserRecord): User {
  return {
    id: toId(apiUser.id),
    username: apiUser.username,
    fullName: apiUser.full_name,
    role: apiUser.role as User['role'],
    roleId: apiUser.role_id != null ? toId(apiUser.role_id) : undefined,
    roleName: apiUser.role_name || undefined,
    roleCode: apiUser.role_code || undefined,
    isActive: apiUser.is_active,
    branchIds: (apiUser.branch_ids ?? []).map(toId),
    defaultBranchId: apiUser.default_branch_id != null ? toId(apiUser.default_branch_id) : undefined,
  }
}

export function mapUser(u: ApiUserRecord): User {
  return mapApiUser(u)
}

export function mapEntity(e: ApiEntity): Entity {
  return {
    id: toId(e.id),
    name: e.name,
    nameAr: e.name_ar || undefined,
    category: e.category || undefined,
    description: e.description || undefined,
    icon: e.icon || undefined,
    isActive: e.is_active,
  }
}

export function mapService(s: ApiService): LaundryService {
  return {
    id: toId(s.id),
    name: s.name,
    nameAr: s.name_ar || undefined,
    description: s.description || undefined,
    durationMinutes: s.duration_minutes ?? undefined,
    icon: s.icon || undefined,
    isActive: s.is_active,
  }
}

export function mapProduct(p: ApiProduct): Product {
  return {
    id: toId(p.id),
    entityId: toId(p.entity_id),
    serviceId: toId(p.service_id),
    name: p.name,
    nameAr: p.name_ar || undefined,
    price: num(p.price),
    icon: p.icon || undefined,
    isActive: p.is_active,
  }
}

export function mapBranch(b: ApiBranch): Branch {
  return {
    id: toId(b.id),
    name: b.name,
    nameAr: b.name_ar || undefined,
    code: b.code,
    address: b.address || undefined,
    phone: b.phone || undefined,
    isActive: b.is_active,
    createdAt: new Date(b.created_at),
  }
}

export function mapCustomer(c: ApiCustomer): Customer {
  return {
    id: toId(c.id),
    type: c.type,
    customId: c.custom_id || undefined,
    name: c.name,
    nameAr: c.name_ar || undefined,
    phone: c.phone,
    email: c.email || undefined,
    contactPerson: c.contact_person || undefined,
    address: c.address || undefined,
    taxId: c.tax_id || undefined,
    notes: c.notes || undefined,
    createdAt: new Date(c.created_at),
  }
}

export function mapInvoiceItem(item: ApiInvoiceItem): InvoiceItem {
  const lineDiscount = item.line_discount != null ? num(item.line_discount) : undefined
  return {
    id: toId(item.id),
    productId: item.product_id != null ? toId(item.product_id) : '',
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: num(item.unit_price),
    lineDiscount: lineDiscount && lineDiscount > 0 ? lineDiscount : undefined,
    totalPrice: num(item.total_price),
  }
}

export function mapInvoice(inv: ApiInvoice): Invoice {
  return {
    id: toId(inv.id),
    invoiceNumber: inv.invoice_number,
    branchId: inv.branch_id != null ? toId(inv.branch_id) : '',
    branchName: inv.branch_name || undefined,
    branchNameAr: inv.branch_name_ar || undefined,
    branchCode: inv.branch_code || undefined,
    customerPhone: inv.customer_phone || undefined,
    customerName: inv.customer_name || undefined,
    orderTag: inv.order_tag || undefined,
    items: (inv.items ?? []).map(mapInvoiceItem),
    subtotal: num(inv.subtotal),
    discount: num(inv.discount),
    total: num(inv.total),
    status: inv.status as Invoice['status'],
    paymentMethod: inv.payment_method as Invoice['paymentMethod'],
    notes: inv.notes || undefined,
    createdBy: toId(inv.created_by),
    createdAt: new Date(inv.created_at),
  }
}

export function mapRole(r: ApiRole): Role {
  return {
    id: toId(r.id),
    code: r.code || undefined,
    name: r.name,
    description: r.description || undefined,
    isActive: r.is_active,
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
  }
}

export function mapPermission(p: ApiPermission): Permission {
  return {
    id: toId(p.id),
    code: p.code,
    name: p.name,
    module: p.module,
    description: p.description || undefined,
    isActive: p.is_active,
  }
}

export function mapRolePermission(rp: ApiRolePermission): RolePermission {
  return { id: toId(rp.id), roleId: toId(rp.role), permissionId: toId(rp.permission) }
}

export function mapUserPermission(up: ApiUserPermission): UserPermission {
  return { id: toId(up.id), userId: toId(up.user), permissionId: toId(up.permission) }
}

export function mapStockItem(s: ApiStockItem): StockItem {
  return {
    id: toId(s.id),
    name: s.name,
    nameAr: s.name_ar || undefined,
    sku: s.sku,
    category: s.category,
    unit: s.unit,
    minQuantity: s.min_quantity ?? undefined,
    isActive: s.is_active,
  }
}

export function mapInventory(i: ApiInventory): Inventory {
  return {
    id: toId(i.id),
    branchId: toId(i.branch_id),
    stockItemId: toId(i.stock_item_id),
    quantity: i.quantity,
    updatedAt: new Date(i.updated_at),
  }
}

export function mapStakeholder(s: ApiStakeholder): Stakeholder {
  return {
    id: toId(s.id),
    type: s.type,
    name: s.name,
    nameAr: s.name_ar || undefined,
    phone: s.phone || undefined,
    email: s.email || undefined,
    contactPerson: s.contact_person || undefined,
    address: s.address || undefined,
    taxId: s.tax_id || undefined,
    notes: s.notes || undefined,
    isActive: s.is_active,
    createdAt: new Date(s.created_at),
  }
}

export function mapContract(c: ApiContract): Contract {
  return {
    id: toId(c.id),
    contractNumber: c.contract_number,
    partyType: c.party_type,
    partyId: toId(c.party_id),
    branchId: toId(c.branch_id),
    purpose: c.purpose,
    title: c.title,
    startDate: new Date(c.start_date),
    endDate: c.end_date ? new Date(c.end_date) : undefined,
    status: c.status,
    monthlyValue: c.monthly_value != null ? num(c.monthly_value) : undefined,
    terms: c.terms || undefined,
    notes: c.notes || undefined,
    createdAt: new Date(c.created_at),
  }
}
