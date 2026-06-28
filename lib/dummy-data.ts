import {
  Entity,
  LaundryService,
  Product,
  Invoice,
  User,
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
import { PERMISSION_DEFINITIONS, ROLE_PERMISSIONS } from './permission-registry.generated'

const DUMMY_ROLE_IDS = {
  admin: 'role-1',
  manager: 'role-2',
  cashier: 'role-3',
  holder: 'role-4',
} as const

// Roles
export const dummyRoles: Role[] = [
  {
    id: DUMMY_ROLE_IDS.admin,
    code: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: DUMMY_ROLE_IDS.manager,
    code: 'manager',
    name: 'Manager',
    description: 'Can manage products, invoices, and view reports',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: DUMMY_ROLE_IDS.cashier,
    code: 'cashier',
    name: 'Cashier',
    description: 'Can create invoices and view products',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: DUMMY_ROLE_IDS.holder,
    code: 'holder',
    name: 'Holder Operator',
    description: 'Limited access for handheld POS devices',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
]

// Permissions — synced from shared/permissions.json
export const dummyPermissions: Permission[] = PERMISSION_DEFINITIONS.map((perm, idx) => ({
  id: `perm-${idx + 1}`,
  code: perm.code,
  name: perm.name,
  module: perm.module,
  isActive: true,
}))

const permissionIdByCode = Object.fromEntries(
  dummyPermissions.map((perm) => [perm.code, perm.id]),
)

function codesForRole(roleCode: keyof typeof ROLE_PERMISSIONS): string[] {
  const entry = ROLE_PERMISSIONS[roleCode]
  if (entry === '*') return dummyPermissions.map((perm) => perm.code)
  return [...entry]
}

export const dummyRolePermissions: RolePermission[] = Object.entries(DUMMY_ROLE_IDS).flatMap(
  ([roleCode, roleId], roleIndex) =>
    codesForRole(roleCode as keyof typeof ROLE_PERMISSIONS).map((code, permIndex) => ({
      id: `rp-${roleCode}-${roleIndex}-${permIndex}`,
      roleId,
      permissionId: permissionIdByCode[code],
    })),
)

export const dummyUserPermissions: UserPermission[] = [
  { id: 'up-1', userId: '3', permissionId: 'perm-23' },
]

export const dummyCustomers: Customer[] = [
  {
    id: 'cust-1',
    type: 'individual',
    customId: 'AAW',
    name: 'Mohammed Al Harthi',
    nameAr: 'محمد الحارثي',
    phone: '96891234567',
    email: 'mohammed@email.com',
    notes: 'VIP — weekly laundry pickup',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'cust-2',
    type: 'individual',
    name: 'Ahmed Al Balushi',
    phone: '96899876543',
    email: 'ahmed@email.com',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'cust-3',
    type: 'individual',
    name: 'Fatima Al Lawati',
    phone: '96895551234',
    notes: 'Prefers express service for dishdashas',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'cust-4',
    type: 'company',
    name: 'Grand Muscat Hotel',
    nameAr: 'فندق مسقط الكبير',
    phone: '96824561234',
    email: 'laundry@grandmuscat.om',
    contactPerson: 'Salem Al Hinai',
    address: 'Ruwi, Muscat',
    taxId: 'OM-VAT-1001',
    notes: 'Hotel linen — daily pickup',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'cust-5',
    type: 'company',
    name: 'Qurum Beach Resort',
    nameAr: 'منتجع شاطئ القرم',
    phone: '96824567890',
    email: 'ops@qurumresort.om',
    contactPerson: 'Fatima Al Lawati',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'cust-6',
    type: 'company',
    name: 'PDO Staff Housing',
    nameAr: 'سكن موظفي PDO',
    phone: '96824680000',
    contactPerson: 'Ahmed Al Balushi',
    notes: 'Corporate uniforms contract',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'cust-7',
    type: 'individual',
    name: 'Sara Al Kindi',
    phone: '96894445566',
    createdAt: new Date('2024-01-15'),
  },
]

export const dummyStakeholders: Stakeholder[] = [
  { id: 'sh-1', type: 'supplier', name: 'Gulf Chem Supplies LLC', nameAr: 'مورد الخليج للمواد الكيميائية', phone: '96824112233', email: 'sales@gulfchem.om', contactPerson: 'Rajesh Kumar', address: 'Rusayl Industrial', taxId: 'OM-CR-8821', isActive: true, createdAt: new Date('2024-01-01') },
  { id: 'sh-2', type: 'supplier', name: 'Oman Equipment Trading', nameAr: 'عمان لتجارة المعدات', phone: '96899887766', email: 'info@omanequip.om', contactPerson: 'Yousuf Al Rashdi', isActive: true, createdAt: new Date('2024-01-15') },
  { id: 'sh-3', type: 'driver', name: 'FastRoute Delivery', nameAr: 'فاست رووت للتوصيل', phone: '96899001122', contactPerson: 'Khalid Al Amri', notes: 'Pickup & delivery runs', isActive: true, createdAt: new Date('2024-02-01') },
  { id: 'sh-4', type: 'partner', name: 'CleanTech Maintenance', nameAr: 'كلين تك للصيانة', phone: '96824553344', email: 'service@cleantech.om', contactPerson: 'Hassan Al Farsi', isActive: true, createdAt: new Date('2024-01-20') },
]

export const dummyContracts: Contract[] = [
  {
    id: 'ct-1',
    contractNumber: 'CNT-2024-001',
    partyType: 'customer',
    partyId: 'cust-4',
    branchId: 'br-1',
    purpose: 'laundry',
    title: 'Hotel Linen — Monthly Service',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    monthlyValue: 4500,
    terms: 'Daily pickup/delivery. Express turnaround 24h for guest laundry.',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'ct-2',
    contractNumber: 'CNT-2024-002',
    partyType: 'customer',
    partyId: 'cust-5',
    branchId: 'br-2',
    purpose: 'laundry',
    title: 'Resort Towels & Spa Linen',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    monthlyValue: 3200,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'ct-3',
    contractNumber: 'CNT-2024-003',
    partyType: 'stakeholder',
    partyId: 'sh-1',
    branchId: 'br-1',
    purpose: 'supply',
    title: 'Detergent Supply Agreement',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    monthlyValue: 850,
    terms: 'Bulk pricing on detergents and softeners. Net-30 payment.',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'ct-4',
    contractNumber: 'CNT-2024-004',
    partyType: 'customer',
    partyId: 'cust-6',
    branchId: 'br-3',
    purpose: 'laundry',
    title: 'Corporate Staff Uniforms',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-31'),
    status: 'draft',
    monthlyValue: 1800,
    createdAt: new Date('2024-05-20'),
  },
  {
    id: 'ct-5',
    contractNumber: 'CNT-2023-012',
    partyType: 'stakeholder',
    partyId: 'sh-2',
    branchId: 'br-1',
    purpose: 'maintenance',
    title: 'Washer Maintenance & Parts',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    status: 'expired',
    monthlyValue: 500,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'ct-6',
    contractNumber: 'CNT-2024-005',
    partyType: 'stakeholder',
    partyId: 'sh-3',
    branchId: 'br-1',
    purpose: 'logistics',
    title: 'Daily Pickup & Delivery Routes',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    monthlyValue: 1200,
    createdAt: new Date('2024-04-01'),
  },
]

export const dummyUsers: User[] = [
  {
    id: '1',
    username: 'demo',
    fullName: 'Demo User',
    role: 'admin',
    roleId: 'role-1',
    isActive: true,
    branchIds: ['br-1', 'br-2', 'br-3'],
    defaultBranchId: 'br-1',
  },
  {
    id: '2',
    username: 'holder1',
    fullName: 'Holder Device 1',
    role: 'holder',
    roleId: 'role-4',
    isActive: true,
    branchIds: ['br-1', 'br-2'],
    defaultBranchId: 'br-1',
  },
  {
    id: '3',
    username: 'cashier1',
    fullName: 'Ahmed Al Balushi',
    role: 'cashier',
    roleId: 'role-3',
    isActive: true,
    branchIds: ['br-2'],
    defaultBranchId: 'br-2',
  },
]

export const dummyBranches: Branch[] = [
  {
    id: 'br-1',
    name: 'AquaWash — Al Khuwair',
    nameAr: 'أكواواش — الخوير',
    code: 'MCT-KHW',
    address: 'Al Khuwair, Muscat',
    phone: '968 2200 1234',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'br-2',
    name: 'AquaWash — Al Qurum',
    nameAr: 'أكواواش — القرم',
    code: 'MCT-QUR',
    address: 'Al Qurum, Muscat',
    phone: '968 2200 5678',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'br-3',
    name: 'AquaWash — Sohar',
    nameAr: 'أكواواش — صحار',
    code: 'SHR-MAIN',
    address: 'Sohar Industrial Area',
    phone: '968 2680 9000',
    isActive: true,
    createdAt: new Date('2024-03-15'),
  },
]

export const dummyStockItems: StockItem[] = [
  { id: 'si-1', name: 'Industrial Washer 25kg', nameAr: 'غسالة صناعية 25 كغ', sku: 'EQ-WASH-25', category: 'equipment', unit: 'pcs', minQuantity: 1, isActive: true },
  { id: 'si-2', name: 'Flatwork Ironer', nameAr: 'مكواة صناعية', sku: 'EQ-IRON-01', category: 'equipment', unit: 'pcs', minQuantity: 1, isActive: true },
  { id: 'si-3', name: 'Laundry Detergent (20L)', nameAr: 'منظف غسيل 20 لتر', sku: 'CON-DET-20', category: 'consumable', unit: 'drum', minQuantity: 5, isActive: true },
  { id: 'si-4', name: 'Fabric Softener (10L)', nameAr: 'منعم أقمشة 10 لتر', sku: 'CON-SOFT-10', category: 'consumable', unit: 'drum', minQuantity: 3, isActive: true },
  { id: 'si-5', name: 'Garment Hangers (pack 100)', nameAr: 'علاقات ملابس (100)', sku: 'CON-HANG-100', category: 'consumable', unit: 'pack', minQuantity: 10, isActive: true },
  { id: 'si-6', name: 'Washer Drain Pump', nameAr: 'مضخة تصريف غسالة', sku: 'SP-PUMP-01', category: 'spare_part', unit: 'pcs', minQuantity: 2, isActive: true },
  { id: 'si-7', name: 'POS Thermal Printer', nameAr: 'طابعة حرارية POS', sku: 'EQ-PRINT-01', category: 'equipment', unit: 'pcs', minQuantity: 1, isActive: true },
]

export const dummyInventory: Inventory[] = [
  { id: 'inv-1', branchId: 'br-1', stockItemId: 'si-1', quantity: 3, updatedAt: new Date('2024-06-01') },
  { id: 'inv-2', branchId: 'br-1', stockItemId: 'si-2', quantity: 2, updatedAt: new Date('2024-06-01') },
  { id: 'inv-3', branchId: 'br-1', stockItemId: 'si-3', quantity: 8, updatedAt: new Date('2024-06-10') },
  { id: 'inv-4', branchId: 'br-1', stockItemId: 'si-4', quantity: 4, updatedAt: new Date('2024-06-10') },
  { id: 'inv-5', branchId: 'br-1', stockItemId: 'si-5', quantity: 25, updatedAt: new Date('2024-06-15') },
  { id: 'inv-6', branchId: 'br-1', stockItemId: 'si-6', quantity: 3, updatedAt: new Date('2024-05-20') },
  { id: 'inv-7', branchId: 'br-1', stockItemId: 'si-7', quantity: 2, updatedAt: new Date('2024-01-01') },
  { id: 'inv-8', branchId: 'br-2', stockItemId: 'si-1', quantity: 2, updatedAt: new Date('2024-06-01') },
  { id: 'inv-9', branchId: 'br-2', stockItemId: 'si-3', quantity: 5, updatedAt: new Date('2024-06-08') },
  { id: 'inv-10', branchId: 'br-2', stockItemId: 'si-5', quantity: 12, updatedAt: new Date('2024-06-12') },
  { id: 'inv-11', branchId: 'br-2', stockItemId: 'si-7', quantity: 1, updatedAt: new Date('2024-01-01') },
  { id: 'inv-12', branchId: 'br-3', stockItemId: 'si-1', quantity: 4, updatedAt: new Date('2024-06-01') },
  { id: 'inv-13', branchId: 'br-3', stockItemId: 'si-3', quantity: 10, updatedAt: new Date('2024-06-05') },
]

// ─── Entities (garment / item types) ───────────────────────────────────────

export const dummyEntities: Entity[] = [
  {
    id: 'ent-1',
    name: 'Cap',
    nameAr: 'قبعة',
    category: 'Accessories',
    icon: 'Crown',
    isActive: true,
  },
  {
    id: 'ent-2',
    name: 'T-Shirt',
    nameAr: 'تيشيرت',
    category: 'Casual',
    icon: 'Shirt',
    isActive: true,
  },
  {
    id: 'ent-3',
    name: 'Omani Dishdasha',
    nameAr: 'دشداشة عمانية',
    category: 'Traditional',
    icon: 'User',
    isActive: true,
  },
  {
    id: 'ent-4',
    name: 'Abaya',
    nameAr: 'عباءة',
    category: 'Traditional',
    icon: 'UserRound',
    isActive: true,
  },
  {
    id: 'ent-5',
    name: 'Trousers',
    nameAr: 'بنطلون',
    category: 'Casual',
    icon: 'Shirt',
    isActive: true,
  },
  {
    id: 'ent-6',
    name: 'Thobe',
    nameAr: 'ثوب',
    category: 'Traditional',
    icon: 'User',
    isActive: true,
  },
  {
    id: 'ent-7',
    name: 'Bedsheet',
    nameAr: 'ملاية',
    category: 'Household',
    icon: 'Bed',
    isActive: true,
  },
  {
    id: 'ent-8',
    name: 'Towel',
    nameAr: 'منشفة',
    category: 'Household',
    icon: 'Bath',
    isActive: true,
  },
]

// ─── Laundry Services (wash, iron, express, etc.) ───────────────────────────

export const dummyLaundryServices: LaundryService[] = [
  {
    id: 'svc-1',
    name: 'Wash',
    nameAr: 'غسيل',
    description: 'Standard machine wash',
    durationMinutes: 120,
    icon: 'Droplets',
    isActive: true,
  },
  {
    id: 'svc-2',
    name: 'Iron',
    nameAr: 'كي',
    description: 'Press and iron',
    durationMinutes: 30,
    icon: 'Sparkles',
    isActive: true,
  },
  {
    id: 'svc-3',
    name: 'Express',
    nameAr: 'سريع',
    description: 'Same-day wash & iron',
    durationMinutes: 180,
    icon: 'Zap',
    isActive: true,
  },
  {
    id: 'svc-4',
    name: 'Dry Clean',
    nameAr: 'دراي كلين',
    description: 'Professional dry cleaning',
    durationMinutes: 240,
    icon: 'Wind',
    isActive: true,
  },
  {
    id: 'svc-5',
    name: 'Wash & Iron',
    nameAr: 'غسيل وكي',
    description: 'Full wash and press service',
    durationMinutes: 150,
    icon: 'Layers',
    isActive: true,
  },
]

// Price matrix: entityId → serviceId → price (OMR)
const priceMatrix: Record<string, Record<string, number>> = {
  'ent-1': { 'svc-1': 0.500, 'svc-2': 0.300, 'svc-3': 1.000, 'svc-4': 1.500, 'svc-5': 0.700 },
  'ent-2': { 'svc-1': 0.800, 'svc-2': 0.500, 'svc-3': 1.500, 'svc-4': 2.000, 'svc-5': 1.200 },
  'ent-3': { 'svc-1': 1.500, 'svc-2': 1.000, 'svc-3': 2.500, 'svc-4': 3.500, 'svc-5': 2.200 },
  'ent-4': { 'svc-1': 2.000, 'svc-2': 1.500, 'svc-3': 3.500, 'svc-4': 4.500, 'svc-5': 3.000 },
  'ent-5': { 'svc-1': 1.000, 'svc-2': 0.700, 'svc-3': 2.000, 'svc-4': 2.500, 'svc-5': 1.500 },
  'ent-6': { 'svc-1': 1.200, 'svc-2': 0.800, 'svc-3': 2.200, 'svc-4': 3.000, 'svc-5': 1.800 },
  'ent-7': { 'svc-1': 2.500, 'svc-2': 1.500, 'svc-3': 4.000, 'svc-4': 5.000, 'svc-5': 3.500 },
  'ent-8': { 'svc-1': 1.000, 'svc-2': 0.500, 'svc-3': 1.800, 'svc-4': 2.000, 'svc-5': 1.300 },
}

function buildProductName(entityName: string, serviceName: string) {
  return `${entityName} — ${serviceName}`
}

function buildProductNameAr(entityNameAr: string | undefined, serviceNameAr: string | undefined) {
  if (!entityNameAr || !serviceNameAr) return undefined
  return `${entityNameAr} — ${serviceNameAr}`
}

// ─── Products (entity + service mappings with prices) ───────────────────────

export const dummyProducts: Product[] = dummyEntities.flatMap((entity) =>
  dummyLaundryServices
    .filter((svc) => priceMatrix[entity.id]?.[svc.id] != null)
    .map((svc) => ({
      id: `prod-${entity.id}-${svc.id}`,
      entityId: entity.id,
      serviceId: svc.id,
      name: buildProductName(entity.name, svc.name),
      nameAr: buildProductNameAr(entity.nameAr, svc.nameAr),
      price: priceMatrix[entity.id][svc.id],
      icon: svc.icon,
      isActive: true,
    }))
)

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    branchId: 'br-1',
    customerPhone: '96891234567',
    orderTag: 'A-101',
    items: [
      { id: '1', productId: 'prod-ent-3-svc-5', productName: 'Omani Dishdasha — Wash & Iron', quantity: 2, unitPrice: 2.200, totalPrice: 4.400 },
      { id: '2', productId: 'prod-ent-2-svc-1', productName: 'T-Shirt — Wash', quantity: 3, unitPrice: 0.800, totalPrice: 2.400 },
    ],
    subtotal: 6.800,
    discount: 0,
    total: 6.800,
    status: 'completed',
    paymentMethod: 'cash',
    createdBy: '1',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    branchId: 'br-1',
    customerPhone: '96899876543',
    orderTag: 'A-102',
    items: [
      { id: '3', productId: 'prod-ent-4-svc-4', productName: 'Abaya — Dry Clean', quantity: 1, unitPrice: 4.500, totalPrice: 4.500 },
    ],
    subtotal: 4.500,
    discount: 0.500,
    total: 4.000,
    status: 'completed',
    paymentMethod: 'card',
    createdBy: '1',
    createdAt: new Date('2024-01-15T14:00:00'),
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    branchId: 'br-2',
    customerPhone: '96895551234',
    orderTag: 'B-045',
    items: [
      { id: '4', productId: 'prod-ent-3-svc-3', productName: 'Omani Dishdasha — Express', quantity: 1, unitPrice: 2.500, totalPrice: 2.500 },
    ],
    subtotal: 2.500,
    discount: 0,
    total: 2.500,
    status: 'pending',
    paymentMethod: 'cash',
    createdBy: '2',
    createdAt: new Date('2024-01-16T09:15:00'),
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    branchId: 'br-2',
    customerPhone: '96891112233',
    orderTag: 'C-220',
    items: [
      { id: '5', productId: 'prod-ent-7-svc-1', productName: 'Bedsheet — Wash', quantity: 4, unitPrice: 2.500, totalPrice: 10.000 },
      { id: '6', productId: 'prod-ent-8-svc-5', productName: 'Towel — Wash & Iron', quantity: 6, unitPrice: 1.300, totalPrice: 7.800 },
    ],
    subtotal: 17.800,
    discount: 1.800,
    total: 16.000,
    status: 'completed',
    paymentMethod: 'transfer',
    createdBy: '3',
    createdAt: new Date('2024-01-16T11:45:00'),
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    branchId: 'br-1',
    customerPhone: '96894445566',
    orderTag: 'A-103',
    items: [
      { id: '7', productId: 'prod-ent-1-svc-2', productName: 'Cap — Iron', quantity: 2, unitPrice: 0.300, totalPrice: 0.600 },
      { id: '8', productId: 'prod-ent-2-svc-2', productName: 'T-Shirt — Iron', quantity: 5, unitPrice: 0.500, totalPrice: 2.500 },
    ],
    subtotal: 3.100,
    discount: 0,
    total: 3.100,
    status: 'completed',
    paymentMethod: 'cash',
    createdBy: '1',
    createdAt: new Date('2024-01-17T08:30:00'),
  },
]

let invoiceCounter = 6
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const number = String(invoiceCounter++).padStart(3, '0')
  return `INV-${year}-${number}`
}

export function buildProductFromMapping(
  entity: Entity,
  service: LaundryService,
  price: number
): Omit<Product, 'id'> {
  return {
    entityId: entity.id,
    serviceId: service.id,
    name: buildProductName(entity.name, service.name),
    nameAr: buildProductNameAr(entity.nameAr, service.nameAr),
    price,
    icon: service.icon,
    isActive: true,
  }
}
