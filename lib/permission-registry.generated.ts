/** AUTO-GENERATED — run: pnpm sync:permissions (from aquawash-frontend) */
/* eslint-disable */

export const PERMISSION_DEFINITIONS = [
  { code: 'dashboard.view', name: "View Dashboard", module: "Dashboard" },
  { code: 'services.view', name: "View Products", module: "Products" },
  { code: 'services.create', name: "Create Products", module: "Products" },
  { code: 'services.edit', name: "Edit Products", module: "Products" },
  { code: 'services.delete', name: "Delete Products", module: "Products" },
  { code: 'services.activate', name: "Activate/Deactivate Products", module: "Products" },
  { code: 'invoices.view', name: "View Invoices", module: "Invoices" },
  { code: 'invoices.create', name: "Create Invoices", module: "Invoices" },
  { code: 'invoices.edit', name: "Edit Invoices", module: "Invoices" },
  { code: 'invoices.delete', name: "Delete Invoices", module: "Invoices" },
  { code: 'invoices.print', name: "Print Invoices", module: "Invoices" },
  { code: 'reports.view', name: "View Reports", module: "Reports" },
  { code: 'reports.export', name: "Export Reports", module: "Reports" },
  { code: 'users.view', name: "View Users", module: "Users" },
  { code: 'users.create', name: "Create Users", module: "Users" },
  { code: 'users.edit', name: "Edit Users", module: "Users" },
  { code: 'users.delete', name: "Delete Users", module: "Users" },
  { code: 'roles.view', name: "View Roles", module: "Access Control" },
  { code: 'roles.manage', name: "Manage Roles", module: "Access Control" },
  { code: 'permissions.view', name: "View Permissions", module: "Access Control" },
  { code: 'permissions.assign', name: "Assign Permissions", module: "Access Control" },
  { code: 'pos.access', name: "Access POS", module: "POS" },
  { code: 'pos.discount', name: "Apply Discounts", module: "POS" },
] as const

export const PERMISSION_CODES = [
  'dashboard.view',
  'services.view',
  'services.create',
  'services.edit',
  'services.delete',
  'services.activate',
  'invoices.view',
  'invoices.create',
  'invoices.edit',
  'invoices.delete',
  'invoices.print',
  'reports.view',
  'reports.export',
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'roles.view',
  'roles.manage',
  'permissions.view',
  'permissions.assign',
  'pos.access',
  'pos.discount',
] as const

export type PermissionCode = (typeof PERMISSION_CODES)[number]

export const ROLE_PERMISSIONS = {
  admin: '*' as const,
  manager: ['dashboard.view', 'services.view', 'services.create', 'services.edit', 'services.activate', 'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.print', 'reports.view', 'reports.export', 'users.view', 'pos.access', 'pos.discount'] as const,
  cashier: ['services.view', 'invoices.view', 'invoices.create', 'invoices.print', 'pos.access'] as const,
  holder: ['services.view', 'services.activate', 'invoices.view', 'invoices.create', 'invoices.print', 'pos.access'] as const,
} as const
