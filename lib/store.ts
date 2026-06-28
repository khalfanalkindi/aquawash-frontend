import { create } from 'zustand'
import {
  Product,
  Entity,
  LaundryService,
  Invoice,
  User,
  CartItem,
  Role,
  Permission,
  RolePermission,
  UserPermission,
  Customer,
  Branch,
  StockItem,
  Inventory,
  Stakeholder,
  Contract,
} from './types'
import {
  dummyProducts,
  dummyEntities,
  dummyLaundryServices,
  dummyInvoices,
  dummyUsers,
  generateInvoiceNumber,
  dummyRoles,
  dummyPermissions,
  dummyRolePermissions,
  dummyUserPermissions,
  dummyCustomers,
  dummyBranches,
  dummyStockItems,
  dummyInventory,
  dummyStakeholders,
  dummyContracts,
  buildProductFromMapping,
} from './dummy-data'
import { isApiMode } from './api/constants'
import { hydrateStoreFromApi } from './api/hydrate'
import * as catalogApi from './api/catalog'
import * as salesApi from './api/sales'
import * as branchesApi from './api/branches'
import * as rbacApi from './api/rbac'
import { resolveRoleId } from './api/role-utils'

const BRANCH_STORAGE_KEY = 'aquawash_current_branch'
const useApi = isApiMode()

interface StoreState {
  // Catalog
  entities: Entity[]
  addEntity: (entity: Omit<Entity, 'id'>) => void
  updateEntity: (id: string, entity: Partial<Entity>) => void
  deleteEntity: (id: string) => void
  toggleEntityActive: (id: string) => void

  laundryServices: LaundryService[]
  addLaundryService: (service: Omit<LaundryService, 'id'>) => void
  updateLaundryService: (id: string, service: Partial<LaundryService>) => void
  deleteLaundryService: (id: string) => void
  toggleLaundryServiceActive: (id: string) => void

  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductActive: (id: string) => void
  getProductsByEntity: (entityId: string) => Product[]
  getProductByMapping: (entityId: string, serviceId: string) => Product | undefined

  // Invoices
  invoices: Invoice[]
  addInvoice: (
    invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>,
  ) => Promise<Invoice>
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void | Promise<void>
  deleteInvoice: (id: string) => void | Promise<void>
  getInvoicesForBranch: (branchId: string | null) => Invoice[]

  // Users
  users: User[]
  addUser: (user: Omit<User, 'id' | 'role'> & { role?: User['role']; roleId?: string }) => void | Promise<void>
  updateUser: (id: string, user: Partial<User>) => void | Promise<void>
  deleteUser: (id: string) => void | Promise<void>

  // Cart
  cart: CartItem[]
  cartGlobalDiscount: number // percentage when global discount mode
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  updateCartItemDiscount: (productId: string, discount: number) => void
  setCartGlobalDiscount: (discount: number) => void
  getDiscountMode: () => 'none' | 'global' | 'item'
  clearCart: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getCartTotalDiscount: () => number

  // Customers
  customers: Customer[]
  addCustomer: (
    customer: Omit<Customer, 'id' | 'createdAt' | 'type'> & { type?: Customer['type'] },
  ) => Promise<Customer>
  updateCustomer: (id: string, customer: Partial<Customer>) => void | Promise<void>
  deleteCustomer: (id: string) => void | Promise<void>
  searchCustomers: (query: string) => Customer[]

  // Roles
  roles: Role[]
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void | Promise<void>
  updateRole: (id: string, role: Partial<Role>) => void | Promise<void>
  deleteRole: (id: string) => void | Promise<void>

  // Permissions
  permissions: Permission[]
  addPermission: (permission: Omit<Permission, 'id'>) => void
  updatePermission: (id: string, permission: Partial<Permission>) => void
  deletePermission: (id: string) => void

  // Role Permissions
  rolePermissions: RolePermission[]
  addRolePermission: (roleId: string, permissionId: string) => void | Promise<void>
  removeRolePermission: (roleId: string, permissionId: string) => void | Promise<void>
  setRolePermissions: (roleId: string, permissionIds: string[]) => void | Promise<void>

  // User Permissions
  userPermissions: UserPermission[]
  addUserPermission: (userId: string, permissionId: string) => void | Promise<void>
  removeUserPermission: (userId: string, permissionId: string) => void | Promise<void>
  setUserPermissions: (userId: string, permissionIds: string[]) => void | Promise<void>

  getUserEffectivePermissions: (userId: string) => Permission[]

  // Branches
  branches: Branch[]
  currentBranchId: string | null
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => Branch | Promise<Branch>
  updateBranch: (id: string, branch: Partial<Branch>) => void | Promise<void>
  deleteBranch: (id: string) => void | Promise<void>
  setCurrentBranch: (branchId: string) => void
  initBranchForUser: (user: User) => void
  getUserBranches: (user: Pick<User, 'branchIds'>) => Branch[]

  // Stock items & inventory
  stockItems: StockItem[]
  inventory: Inventory[]
  addStockItem: (item: Omit<StockItem, 'id'>) => StockItem | Promise<StockItem>
  updateStockItem: (id: string, item: Partial<StockItem>) => void | Promise<void>
  deleteStockItem: (id: string) => void | Promise<void>
  upsertInventory: (branchId: string, stockItemId: string, quantity: number) => void | Promise<void>
  getInventoryByBranch: (branchId: string) => (Inventory & { stockItem: StockItem })[]

  // Stakeholders & contracts
  stakeholders: Stakeholder[]
  contracts: Contract[]
  addStakeholder: (s: Omit<Stakeholder, 'id' | 'createdAt'>) => Stakeholder | Promise<Stakeholder>
  updateStakeholder: (id: string, s: Partial<Stakeholder>) => void | Promise<void>
  deleteStakeholder: (id: string) => void | Promise<void>
  addContract: (c: Omit<Contract, 'id' | 'createdAt'>) => Contract | Promise<Contract>
  updateContract: (id: string, c: Partial<Contract>) => void | Promise<void>
  deleteContract: (id: string) => void | Promise<void>

  // API hydration
  isHydrated: boolean
  isHydrating: boolean
  hydrateFromApi: (locale?: string, user?: User) => Promise<void>
  resetStore: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  isHydrated: !useApi,
  isHydrating: false,
  hydrateFromApi: async (locale, user) => {
    if (!useApi || get().isHydrated || get().isHydrating) return
    if (!user) throw new Error('User is required for API hydration')
    set({ isHydrating: true })
    try {
      await hydrateStoreFromApi(user, locale as import('@/i18n/routing').Locale | undefined)
    } catch {
      set({ isHydrating: false })
      throw new Error('Failed to load data from server')
    }
  },
  resetStore: () =>
    set({
      entities: useApi ? [] : dummyEntities,
      laundryServices: useApi ? [] : dummyLaundryServices,
      products: useApi ? [] : dummyProducts,
      invoices: useApi ? [] : dummyInvoices,
      users: useApi ? [] : dummyUsers,
      customers: useApi ? [] : dummyCustomers,
      roles: useApi ? [] : dummyRoles,
      permissions: useApi ? [] : dummyPermissions,
      rolePermissions: useApi ? [] : dummyRolePermissions,
      userPermissions: useApi ? [] : dummyUserPermissions,
      branches: useApi ? [] : dummyBranches,
      stockItems: useApi ? [] : dummyStockItems,
      inventory: useApi ? [] : dummyInventory,
      stakeholders: useApi ? [] : dummyStakeholders,
      contracts: useApi ? [] : dummyContracts,
      currentBranchId: null,
      cart: [],
      cartGlobalDiscount: 0,
      isHydrated: !useApi,
      isHydrating: false,
    }),

  // Catalog
  entities: useApi ? [] : dummyEntities,
  addEntity: async (entity) => {
    if (useApi) {
      const created = await catalogApi.createEntity(entity)
      set((state) => ({ entities: [...state.entities, created] }))
      return
    }
    set((state) => ({
      entities: [...state.entities, { ...entity, id: `ent-${Date.now()}` }],
    }))
  },
  updateEntity: async (id, updates) => {
    if (useApi) {
      const updated = await catalogApi.updateEntity(id, updates)
      set((state) => ({
        entities: state.entities.map((e) => (e.id === id ? updated : e)),
      }))
      return
    }
    set((state) => ({
      entities: state.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }))
  },
  deleteEntity: async (id) => {
    if (useApi) await catalogApi.deleteEntity(id)
    set((state) => ({
      entities: state.entities.filter((e) => e.id !== id),
      products: state.products.filter((p) => p.entityId !== id),
    }))
  },
  toggleEntityActive: async (id) => {
    const entity = get().entities.find((e) => e.id === id)
    if (!entity) return
    await get().updateEntity(id, { isActive: !entity.isActive })
  },

  laundryServices: useApi ? [] : dummyLaundryServices,
  addLaundryService: async (service) => {
    if (useApi) {
      const created = await catalogApi.createLaundryService(service)
      set((state) => ({ laundryServices: [...state.laundryServices, created] }))
      return
    }
    set((state) => ({
      laundryServices: [...state.laundryServices, { ...service, id: `svc-${Date.now()}` }],
    }))
  },
  updateLaundryService: async (id, updates) => {
    if (useApi) {
      const updated = await catalogApi.updateLaundryService(id, updates)
      set((state) => ({
        laundryServices: state.laundryServices.map((s) => (s.id === id ? updated : s)),
      }))
      return
    }
    set((state) => ({
      laundryServices: state.laundryServices.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  },
  deleteLaundryService: async (id) => {
    if (useApi) await catalogApi.deleteLaundryService(id)
    set((state) => ({
      laundryServices: state.laundryServices.filter((s) => s.id !== id),
      products: state.products.filter((p) => p.serviceId !== id),
    }))
  },
  toggleLaundryServiceActive: async (id) => {
    const service = get().laundryServices.find((s) => s.id === id)
    if (!service) return
    await get().updateLaundryService(id, { isActive: !service.isActive })
  },

  products: useApi ? [] : dummyProducts,
  addProduct: async (product) => {
    if (useApi) {
      const created = await catalogApi.createProduct(product)
      set((state) => ({ products: [...state.products, created] }))
      return
    }
    set((state) => ({
      products: [...state.products, { ...product, id: `prod-${Date.now()}` }],
    }))
  },
  updateProduct: async (id, updates) => {
    if (useApi) {
      const updated = await catalogApi.updateProduct(id, updates)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }))
      return
    }
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  },
  deleteProduct: async (id) => {
    if (useApi) await catalogApi.deleteProduct(id)
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }))
  },
  toggleProductActive: async (id) => {
    const product = get().products.find((p) => p.id === id)
    if (!product) return
    await get().updateProduct(id, { isActive: !product.isActive })
  },
  getProductsByEntity: (entityId) => {
    const { products, entities, laundryServices } = get()
    return products.filter((p) => {
      if (p.entityId !== entityId || !p.isActive) return false
      const entity = entities.find((e) => e.id === p.entityId)
      const service = laundryServices.find((s) => s.id === p.serviceId)
      return entity?.isActive && service?.isActive
    })
  },
  getProductByMapping: (entityId, serviceId) => {
    const { products, entities, laundryServices } = get()
    const product = products.find((p) => p.entityId === entityId && p.serviceId === serviceId)
    if (!product || !product.isActive) return undefined
    const entity = entities.find((e) => e.id === entityId)
    const service = laundryServices.find((s) => s.id === serviceId)
    if (!entity?.isActive || !service?.isActive) return undefined
    return product
  },

  // Invoices
  invoices: useApi ? [] : dummyInvoices,
  addInvoice: async (invoiceData) => {
    if (useApi) {
      const created = await salesApi.createInvoice({
        branch_id: invoiceData.branchId,
        customer_phone: invoiceData.customerPhone,
        customer_name: invoiceData.customerName,
        order_tag: invoiceData.orderTag,
        items: invoiceData.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          line_discount: item.lineDiscount,
        })),
        discount: invoiceData.discount,
        payment_method: invoiceData.paymentMethod,
        notes: invoiceData.notes,
        status: invoiceData.status,
      })
      set((state) => ({ invoices: [created, ...state.invoices] }))
      return created
    }

    const branch = get().branches.find((b) => b.id === invoiceData.branchId)
    const newInvoice: Invoice = {
      ...invoiceData,
      id: String(Date.now()),
      invoiceNumber: generateInvoiceNumber(),
      branchName: branch?.name,
      branchNameAr: branch?.nameAr,
      branchCode: branch?.code,
      createdAt: new Date(),
    }
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
    }))
    return newInvoice
  },
  updateInvoice: async (id, updates) => {
    if (useApi && updates.status) {
      const updated = await salesApi.updateInvoiceStatus(id, updates.status)
      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? updated : i)),
      }))
      return
    }
    set((state) => ({
      invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
  },
  deleteInvoice: async (id) => {
    if (useApi) await salesApi.deleteInvoice(id)
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    }))
  },
  getInvoicesForBranch: (branchId) => {
    const { invoices } = get()
    if (!branchId) return invoices
    return invoices.filter((i) => i.branchId === branchId)
  },

  // Users
  users: useApi ? [] : dummyUsers,
  addUser: async (user) => {
    if (useApi) {
      const roleId =
        user.roleId ?? (user.role ? resolveRoleId(get().roles, user.role) : undefined)
      if (!roleId) throw new Error('Role is required')
      const created = await rbacApi.createUser({
        username: user.username,
        fullName: user.fullName,
        roleId,
        isActive: user.isActive,
        branchIds: user.branchIds,
        defaultBranchId: user.defaultBranchId,
        password: user.username,
      })
      set((state) => ({ users: [...state.users, created] }))
      return
    }
    set((state) => ({
      users: [
        ...state.users,
        {
          ...user,
          id: String(Date.now()),
          role: user.role ?? 'holder',
        },
      ],
    }))
  },
  updateUser: async (id, updates) => {
    if (useApi) {
      const roleId =
        updates.roleId ??
        (updates.role ? resolveRoleId(get().roles, updates.role) : undefined)
      const updated = await rbacApi.updateUser(id, {
        fullName: updates.fullName,
        roleId,
        isActive: updates.isActive,
        branchIds: updates.branchIds,
        defaultBranchId: updates.defaultBranchId,
      })
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updated : u)),
      }))
      return
    }
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }))
  },
  deleteUser: async (id) => {
    if (useApi) await rbacApi.deleteUser(id)
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }))
  },

  // Cart
  cart: [],
  cartGlobalDiscount: 0,
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id)
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }
    return { cart: [...state.cart, { product, quantity: 1 }] }
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product.id !== productId),
  })),
  updateCartQuantity: (productId, quantity) => set((state) => ({
    cart: quantity <= 0
      ? state.cart.filter((item) => item.product.id !== productId)
      : state.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
  })),
  updateCartItemDiscount: (productId, discountPercent) => set((state) => ({
    cartGlobalDiscount: 0,
    cart: state.cart.map((item) =>
      item.product.id === productId
        ? { ...item, discount: Math.min(100, Math.max(0, discountPercent)) }
        : item
    ),
  })),
  setCartGlobalDiscount: (discountPercent) => {
    set({
      cartGlobalDiscount: Math.min(100, Math.max(0, discountPercent)),
      cart: get().cart.map((item) => ({ ...item, discount: undefined })),
    })
  },
  getDiscountMode: () => {
    const { cart, cartGlobalDiscount } = get()
    if (cartGlobalDiscount > 0) return 'global'
    if (cart.some((item) => (item.discount || 0) > 0)) return 'item'
    return 'none'
  },
  clearCart: () => set({ cart: [], cartGlobalDiscount: 0 }),
  getCartSubtotal: () => {
    const { cart } = get()
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },
  getCartTotalDiscount: () => {
    const { cart, cartGlobalDiscount } = get()
    const subtotal = get().getCartSubtotal()
    if (cartGlobalDiscount > 0) return subtotal * cartGlobalDiscount / 100
    return cart.reduce((sum, item) => {
      const lineSubtotal = item.product.price * item.quantity
      return sum + lineSubtotal * ((item.discount || 0) / 100)
    }, 0)
  },
  getCartTotal: () => {
    const subtotal = get().getCartSubtotal()
    return Math.max(0, subtotal - get().getCartTotalDiscount())
  },

  // Customers
  customers: useApi ? [] : dummyCustomers,
  addCustomer: async (customer) => {
    if (useApi) {
      const created = await salesApi.createCustomer({
        ...customer,
        type: customer.type ?? 'individual',
      } as Omit<Customer, 'id' | 'createdAt'>)
      set((state) => ({ customers: [...state.customers, created] }))
      return created
    }
    const newCustomer: Customer = {
      ...customer,
      type: customer.type ?? 'individual',
      id: `cust-${Date.now()}`,
      createdAt: new Date(),
    }
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }))
    return newCustomer
  },
  updateCustomer: async (id, updates) => {
    if (useApi) {
      const updated = await salesApi.updateCustomer(id, updates)
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? updated : c)),
      }))
      return
    }
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
  },
  deleteCustomer: async (id) => {
    if (useApi) await salesApi.deleteCustomer(id)
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      contracts: state.contracts.filter(
        (c) => !(c.partyType === 'customer' && c.partyId === id),
      ),
    }))
  },
  searchCustomers: (query) => {
    const { customers } = get()
    const q = query.toLowerCase().trim()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.customId?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    )
  },

  // Roles
  roles: useApi ? [] : dummyRoles,
  addRole: async (role) => {
    if (useApi) {
      const created = await rbacApi.createRole(role)
      set((state) => ({ roles: [...state.roles, created] }))
      return
    }
    set((state) => ({
      roles: [...state.roles, { ...role, id: `role-${Date.now()}`, createdAt: new Date() }],
    }))
  },
  updateRole: async (id, updates) => {
    if (useApi) {
      const updated = await rbacApi.updateRole(id, updates)
      set((state) => ({
        roles: state.roles.map((r) => (r.id === id ? updated : r)),
      }))
      return
    }
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }))
  },
  deleteRole: async (id) => {
    if (useApi) await rbacApi.deleteRole(id)
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
      rolePermissions: state.rolePermissions.filter((rp) => rp.roleId !== id),
    }))
  },

  // Permissions
  permissions: useApi ? [] : dummyPermissions,
  addPermission: (permission) => set((state) => ({
    permissions: [...state.permissions, { ...permission, id: `perm-${Date.now()}` }],
  })),
  updatePermission: (id, updates) => set((state) => ({
    permissions: state.permissions.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  deletePermission: (id) => set((state) => ({
    permissions: state.permissions.filter((p) => p.id !== id),
    rolePermissions: state.rolePermissions.filter((rp) => rp.permissionId !== id),
    userPermissions: state.userPermissions.filter((up) => up.permissionId !== id),
  })),

  // Role Permissions
  rolePermissions: useApi ? [] : dummyRolePermissions,
  addRolePermission: async (roleId, permissionId) => {
    if (useApi) {
      const created = await rbacApi.createRolePermission(roleId, permissionId)
      set((state) => {
        const exists = state.rolePermissions.some(
          (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
        )
        if (exists) return state
        return { rolePermissions: [...state.rolePermissions, created] }
      })
      return
    }
    set((state) => {
      const exists = state.rolePermissions.some(
        (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
      )
      if (exists) return state
      return {
        rolePermissions: [
          ...state.rolePermissions,
          { id: `rp-${Date.now()}`, roleId, permissionId },
        ],
      }
    })
  },
  removeRolePermission: async (roleId, permissionId) => {
    if (useApi) {
      const existing = get().rolePermissions.find(
        (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
      )
      if (existing) await rbacApi.deleteRolePermission(existing.id)
    }
    set((state) => ({
      rolePermissions: state.rolePermissions.filter(
        (rp) => !(rp.roleId === roleId && rp.permissionId === permissionId),
      ),
    }))
  },
  setRolePermissions: async (roleId, permissionIds) => {
    if (useApi) {
      const rolePermissions = await rbacApi.syncRolePermissions(roleId, permissionIds)
      set({ rolePermissions })
      return
    }
    set((state) => ({
      rolePermissions: [
        ...state.rolePermissions.filter((rp) => rp.roleId !== roleId),
        ...permissionIds.map((permissionId, idx) => ({
          id: `rp-${Date.now()}-${idx}`,
          roleId,
          permissionId,
        })),
      ],
    }))
  },

  // User Permissions
  userPermissions: useApi ? [] : dummyUserPermissions,
  addUserPermission: async (userId, permissionId) => {
    if (useApi) {
      const created = await rbacApi.createUserPermission(userId, permissionId)
      set((state) => {
        const exists = state.userPermissions.some(
          (up) => up.userId === userId && up.permissionId === permissionId,
        )
        if (exists) return state
        return { userPermissions: [...state.userPermissions, created] }
      })
      return
    }
    set((state) => {
      const exists = state.userPermissions.some(
        (up) => up.userId === userId && up.permissionId === permissionId,
      )
      if (exists) return state
      return {
        userPermissions: [
          ...state.userPermissions,
          { id: `up-${Date.now()}`, userId, permissionId },
        ],
      }
    })
  },
  removeUserPermission: async (userId, permissionId) => {
    if (useApi) {
      const existing = get().userPermissions.find(
        (up) => up.userId === userId && up.permissionId === permissionId,
      )
      if (existing) await rbacApi.deleteUserPermission(existing.id)
    }
    set((state) => ({
      userPermissions: state.userPermissions.filter(
        (up) => !(up.userId === userId && up.permissionId === permissionId),
      ),
    }))
  },
  setUserPermissions: async (userId, permissionIds) => {
    if (useApi) {
      const userPermissions = await rbacApi.syncUserPermissions(userId, permissionIds)
      set({ userPermissions })
      return
    }
    set((state) => ({
      userPermissions: [
        ...state.userPermissions.filter((up) => up.userId !== userId),
        ...permissionIds.map((permissionId, idx) => ({
          id: `up-${Date.now()}-${idx}`,
          userId,
          permissionId,
        })),
      ],
    }))
  },

  getUserEffectivePermissions: (userId) => {
    const state = get()
    const user = state.users.find((u) => u.id === userId)
    if (!user) return []

    const rolePermissionIds = user.roleId
      ? state.rolePermissions
          .filter((rp) => rp.roleId === user.roleId)
          .map((rp) => rp.permissionId)
      : []

    const directPermissionIds = state.userPermissions
      .filter((up) => up.userId === userId)
      .map((up) => up.permissionId)

    const allPermissionIds = [...new Set([...rolePermissionIds, ...directPermissionIds])]
    return state.permissions.filter((p) => allPermissionIds.includes(p.id) && p.isActive)
  },

  // Branches
  branches: useApi ? [] : dummyBranches,
  currentBranchId: null,
  addBranch: async (branch) => {
    if (useApi) {
      const created = await branchesApi.createBranch(branch)
      set((state) => ({ branches: [...state.branches, created] }))
      return created
    }
    const newBranch: Branch = { ...branch, id: `br-${Date.now()}`, createdAt: new Date() }
    set((state) => ({ branches: [...state.branches, newBranch] }))
    return newBranch
  },
  updateBranch: async (id, updates) => {
    if (useApi) {
      const updated = await branchesApi.updateBranch(id, updates)
      set((state) => ({
        branches: state.branches.map((b) => (b.id === id ? updated : b)),
      }))
      return
    }
    set((state) => ({
      branches: state.branches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }))
  },
  deleteBranch: async (id) => {
    if (useApi) await branchesApi.deleteBranch(id)
    set((state) => ({
      branches: state.branches.filter((b) => b.id !== id),
      inventory: state.inventory.filter((i) => i.branchId !== id),
      contracts: state.contracts.filter((c) => c.branchId !== id),
      currentBranchId: state.currentBranchId === id ? null : state.currentBranchId,
    }))
  },
  setCurrentBranch: (branchId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BRANCH_STORAGE_KEY, branchId)
    }
    set({ currentBranchId: branchId })
  },
  initBranchForUser: (user) => {
    const { branches } = get()
    const allowed = branches.filter((b) => user.branchIds.includes(b.id) && b.isActive)
    if (allowed.length === 0) return

    let branchId: string | null = null
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BRANCH_STORAGE_KEY)
      if (stored && allowed.some((b) => b.id === stored)) {
        branchId = stored
      }
    }
    if (!branchId && user.defaultBranchId && allowed.some((b) => b.id === user.defaultBranchId)) {
      branchId = user.defaultBranchId
    }
    if (!branchId) branchId = allowed[0].id

    if (typeof window !== 'undefined') {
      localStorage.setItem(BRANCH_STORAGE_KEY, branchId)
    }
    set({ currentBranchId: branchId })
  },
  getUserBranches: (user) => {
    const { branches } = get()
    if (!user.branchIds.length) return []
    return branches.filter((b) => user.branchIds.includes(b.id) && b.isActive)
  },

  // Stock items & inventory
  stockItems: useApi ? [] : dummyStockItems,
  inventory: useApi ? [] : dummyInventory,
  addStockItem: async (item) => {
    if (useApi) {
      const created = await branchesApi.createStockItem(item)
      set((state) => ({ stockItems: [...state.stockItems, created] }))
      return created
    }
    const newItem: StockItem = { ...item, id: `si-${Date.now()}` }
    set((state) => ({ stockItems: [...state.stockItems, newItem] }))
    return newItem
  },
  updateStockItem: async (id, updates) => {
    if (useApi) {
      const updated = await branchesApi.updateStockItem(id, updates)
      set((state) => ({
        stockItems: state.stockItems.map((i) => (i.id === id ? updated : i)),
      }))
      return
    }
    set((state) => ({
      stockItems: state.stockItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
  },
  deleteStockItem: async (id) => {
    if (useApi) await branchesApi.deleteStockItem(id)
    set((state) => ({
      stockItems: state.stockItems.filter((i) => i.id !== id),
      inventory: state.inventory.filter((i) => i.stockItemId !== id),
    }))
  },
  upsertInventory: async (branchId, stockItemId, quantity) => {
    if (useApi) {
      const existing = get().inventory.find(
        (i) => i.branchId === branchId && i.stockItemId === stockItemId,
      )
      const record = await branchesApi.upsertInventoryRecord(
        branchId,
        stockItemId,
        quantity,
        existing?.id,
      )
      set((state) => {
        if (existing) {
          return {
            inventory: state.inventory.map((i) => (i.id === existing.id ? record : i)),
          }
        }
        return { inventory: [...state.inventory, record] }
      })
      return
    }
    set((state) => {
      const existing = state.inventory.find(
        (i) => i.branchId === branchId && i.stockItemId === stockItemId,
      )
      if (existing) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === existing.id ? { ...i, quantity, updatedAt: new Date() } : i,
          ),
        }
      }
      return {
        inventory: [
          ...state.inventory,
          {
            id: `inv-${Date.now()}`,
            branchId,
            stockItemId,
            quantity,
            updatedAt: new Date(),
          },
        ],
      }
    })
  },
  getInventoryByBranch: (branchId) => {
    const { inventory, stockItems } = get()
    return inventory
      .filter((i) => i.branchId === branchId)
      .map((i) => ({
        ...i,
        stockItem: stockItems.find((s) => s.id === i.stockItemId)!,
      }))
      .filter((i) => i.stockItem)
  },

  // Stakeholders & contracts
  stakeholders: useApi ? [] : dummyStakeholders,
  contracts: useApi ? [] : dummyContracts,
  addStakeholder: async (data) => {
    if (useApi) {
      const created = await branchesApi.createStakeholder(data)
      set((state) => ({ stakeholders: [...state.stakeholders, created] }))
      return created
    }
    const newStakeholder: Stakeholder = {
      ...data,
      id: `sh-${Date.now()}`,
      createdAt: new Date(),
    }
    set((state) => ({ stakeholders: [...state.stakeholders, newStakeholder] }))
    return newStakeholder
  },
  updateStakeholder: async (id, updates) => {
    if (useApi) {
      const updated = await branchesApi.updateStakeholder(id, updates)
      set((state) => ({
        stakeholders: state.stakeholders.map((s) => (s.id === id ? updated : s)),
      }))
      return
    }
    set((state) => ({
      stakeholders: state.stakeholders.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  },
  deleteStakeholder: async (id) => {
    if (useApi) await branchesApi.deleteStakeholder(id)
    set((state) => ({
      stakeholders: state.stakeholders.filter((s) => s.id !== id),
      contracts: state.contracts.filter(
        (c) => !(c.partyType === 'stakeholder' && c.partyId === id),
      ),
    }))
  },
  addContract: async (data) => {
    if (useApi) {
      const created = await branchesApi.createContract(data)
      set((state) => ({ contracts: [...state.contracts, created] }))
      return created
    }
    const newContract: Contract = {
      ...data,
      id: `ct-${Date.now()}`,
      createdAt: new Date(),
    }
    set((state) => ({ contracts: [...state.contracts, newContract] }))
    return newContract
  },
  updateContract: async (id, updates) => {
    if (useApi) {
      const updated = await branchesApi.updateContract(id, updates)
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id ? updated : c)),
      }))
      return
    }
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
  },
  deleteContract: async (id) => {
    if (useApi) await branchesApi.deleteContract(id)
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    }))
  },
}))

export { buildProductFromMapping }
