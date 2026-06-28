export type UserRole = 'admin' | 'holder' | 'cashier'

export type PaymentMethod = 'cash' | 'card' | 'transfer'

export type InvoiceStatus = 'pending' | 'completed' | 'cancelled'

export interface User {
  id: string
  username: string
  fullName: string
  role: UserRole
  roleId?: string
  /** Backend role display name (e.g. Manager) */
  roleName?: string
  /** Backend role code (e.g. manager) — distinct from portal `role` */
  roleCode?: string
  isActive: boolean
  branchIds: string[]
  defaultBranchId?: string
  /** Populated from API login/me — used for permission checks without RBAC store data */
  permissionCodes?: string[]
}

/** Laundry branch / location */
export interface Branch {
  id: string
  name: string
  nameAr?: string
  code: string
  address?: string
  phone?: string
  isActive: boolean
  createdAt: Date
}

/** Equipment & consumables (not POS catalog) */
export type StockItemCategory = 'equipment' | 'consumable' | 'spare_part'

export interface StockItem {
  id: string
  name: string
  nameAr?: string
  sku: string
  category: StockItemCategory
  unit: string
  minQuantity?: number
  isActive: boolean
}

/** Stock level per branch */
export interface Inventory {
  id: string
  branchId: string
  stockItemId: string
  quantity: number
  updatedAt: Date
}

/** Laundry customer — individuals, hotels, companies (all washing clients) */
export type CustomerType = 'individual' | 'company'

export interface Customer {
  id: string
  type: CustomerType
  customId?: string
  name: string
  nameAr?: string
  phone: string
  email?: string
  contactPerson?: string
  address?: string
  taxId?: string
  notes?: string
  createdAt: Date
}

/** Supplier, driver, partner — not laundry customers */
export type StakeholderType = 'supplier' | 'driver' | 'partner' | 'other'

export interface Stakeholder {
  id: string
  type: StakeholderType
  name: string
  nameAr?: string
  phone?: string
  email?: string
  contactPerson?: string
  address?: string
  taxId?: string
  notes?: string
  isActive: boolean
  createdAt: Date
}

export type ContractPartyType = 'customer' | 'stakeholder'

/** laundry = washing service; supply, maintenance, logistics = stakeholder-side */
export type ContractPurpose = 'laundry' | 'supply' | 'maintenance' | 'logistics' | 'other'

export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated'

export interface Contract {
  id: string
  contractNumber: string
  partyType: ContractPartyType
  partyId: string
  branchId: string
  purpose: ContractPurpose
  title: string
  startDate: Date
  endDate?: Date
  status: ContractStatus
  monthlyValue?: number
  terms?: string
  notes?: string
  createdAt: Date
}

/** Garment / item type (cap, t-shirt, dishdasha, etc.) */
export interface Entity {
  id: string
  name: string
  nameAr?: string
  description?: string
  category?: string
  icon?: string
  isActive: boolean
}

/** Laundry service type (wash, iron, express, etc.) — no price on its own */
export interface LaundryService {
  id: string
  name: string
  nameAr?: string
  description?: string
  durationMinutes?: number
  icon?: string
  isActive: boolean
}

/** Entity + Service mapping — this is what POS sells, with price */
export interface Product {
  id: string
  entityId: string
  serviceId: string
  name: string
  nameAr?: string
  price: number
  icon?: string
  isActive: boolean
}

export interface InvoiceItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  lineDiscount?: number
  totalPrice: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  branchId: string
  branchName?: string
  branchNameAr?: string
  branchCode?: string
  customerPhone?: string
  customerName?: string
  orderTag?: string
  items: InvoiceItem[]
  subtotal: number
  discount: number
  total: number
  status: InvoiceStatus
  paymentMethod: PaymentMethod
  notes?: string
  createdBy: string
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  /** Percentage discount (0–100), not OMR amount */
  discount?: number
}

export interface Role {
  id: string
  code?: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
}

export interface Permission {
  id: string
  code: string
  name: string
  description?: string
  module: string
  isActive: boolean
}

export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
}

export interface UserPermission {
  id: string
  userId: string
  permissionId: string
}
