# AquaWash — Database ERD

Full entity-relationship diagram for the Django backend (MySQL).

## Apps

| App | Tables |
|-----|--------|
| **rbac** | users, roles, permissions, role_permissions, user_permissions |
| **common** | list_parents, list_children, shop_settings, audit_log |
| **catalog** | entities, laundry_services, products |
| **operations** | branches, user_branches, stock_items, inventory, stakeholders, contracts |
| **sales** | customers, invoices, invoice_items, payments |

## Not stored in DB

- **Cart** — browser memory only
- **Auth sessions / JWT** — Django (same `users` table as `AUTH_USER_MODEL`)

## Export as image

1. Open [mermaid.live](https://mermaid.live)
2. Paste contents of `aquawash-erd.mmd`
3. Export → PNG, SVG, or PDF

## Diagram

```mermaid
erDiagram

    roles {
        bigint id PK
        varchar code UK
        varchar name
        varchar description
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    permissions {
        bigint id PK
        varchar code UK
        varchar name
        varchar module
        varchar description
        boolean is_active
        datetime created_at
    }

    users {
        bigint id PK
        varchar username UK
        varchar password
        varchar full_name
        bigint role_id FK
        boolean is_active
        boolean is_staff
        datetime last_login
        datetime created_at
        datetime updated_at
    }

    role_permissions {
        bigint id PK
        bigint role_id FK
        bigint permission_id FK
    }

    user_permissions {
        bigint id PK
        bigint user_id FK
        bigint permission_id FK
    }

    list_parents {
        bigint id PK
        varchar code UK
        varchar name
        varchar description
        boolean is_active
        datetime created_at
    }

    list_children {
        bigint id PK
        bigint parent_id FK
        varchar code
        varchar name
        varchar name_ar
        int sort_order
        boolean is_active
        datetime created_at
    }

    shop_settings {
        bigint id PK
        varchar shop_name
        varchar shop_name_ar
        varchar tagline
        varchar phone
        varchar address
        varchar currency
        varchar invoice_prefix
        text receipt_footer
        datetime updated_at
    }

    audit_log {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar entity_type
        bigint entity_id
        json old_values
        json new_values
        varchar ip_address
        datetime created_at
    }

    entities {
        bigint id PK
        varchar name
        varchar name_ar
        bigint category_id FK
        varchar description
        varchar icon
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    laundry_services {
        bigint id PK
        varchar name
        varchar name_ar
        varchar description
        int duration_minutes
        varchar icon
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    products {
        bigint id PK
        bigint entity_id FK
        bigint service_id FK
        varchar name
        varchar name_ar
        decimal price
        varchar icon
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    branches {
        bigint id PK
        varchar name
        varchar name_ar
        varchar code UK
        varchar address
        varchar phone
        boolean is_active
        datetime created_at
    }

    user_branches {
        bigint id PK
        bigint user_id FK
        bigint branch_id FK
        boolean is_default
    }

    stock_items {
        bigint id PK
        varchar name
        varchar name_ar
        varchar sku UK
        varchar category
        varchar unit
        int min_quantity
        boolean is_active
    }

    inventory {
        bigint id PK
        bigint branch_id FK
        bigint stock_item_id FK
        int quantity
        datetime updated_at
    }

    stakeholders {
        bigint id PK
        varchar type
        varchar name
        varchar name_ar
        varchar phone
        varchar email
        varchar contact_person
        varchar address
        varchar tax_id
        text notes
        boolean is_active
        datetime created_at
    }

    contracts {
        bigint id PK
        varchar contract_number UK
        varchar party_type
        bigint customer_id FK
        bigint stakeholder_id FK
        bigint branch_id FK
        varchar purpose
        varchar title
        date start_date
        date end_date
        varchar status
        decimal monthly_value
        text terms
        text notes
        datetime created_at
    }

    customers {
        bigint id PK
        varchar type
        varchar name
        varchar name_ar
        varchar phone
        varchar email
        varchar contact_person
        varchar address
        varchar tax_id
        text notes
        datetime created_at
        datetime updated_at
    }

    invoices {
        bigint id PK
        varchar invoice_number UK
        bigint branch_id FK
        bigint customer_id FK
        varchar customer_name
        varchar customer_phone
        varchar order_tag
        decimal subtotal
        decimal discount
        decimal total
        bigint status_id FK
        bigint payment_status_id FK
        varchar payment_method
        text notes
        bigint created_by FK
        datetime created_at
        datetime updated_at
    }

    invoice_items {
        bigint id PK
        bigint invoice_id FK
        bigint product_id FK
        varchar product_name
        int quantity
        decimal unit_price
        decimal line_discount
        decimal total_price
    }

    payments {
        bigint id PK
        bigint invoice_id FK
        decimal amount
        bigint method_id FK
        bigint status_id FK
        varchar reference
        text notes
        bigint created_by FK
        datetime paid_at
        datetime created_at
    }

    roles ||--o{ users : assigns
    roles ||--|{ role_permissions : has
    permissions ||--|{ role_permissions : granted_via
    users ||--|{ user_permissions : extra_grants
    permissions ||--|{ user_permissions : granted_via

    list_parents ||--|{ list_children : contains
    users ||--o{ audit_log : performed_by

    list_children ||--o{ entities : category
    entities ||--o{ products : entity
    laundry_services ||--o{ products : service

    users ||--|{ user_branches : assigned_to
    branches ||--|{ user_branches : has_users
    branches ||--|{ inventory : stocks
    stock_items ||--|{ inventory : tracked_in
    branches ||--o{ contracts : scoped_to
    customers ||--o{ contracts : party_laundry
    stakeholders ||--o{ contracts : party_supply

    branches ||--o{ invoices : issued_at
    customers ||--o{ invoices : places
    users ||--o{ invoices : created_by
    list_children ||--o{ invoices : order_status
    list_children ||--o{ invoices : payment_status
    invoices ||--|{ invoice_items : contains
    products ||--o{ invoice_items : references
    invoices ||--o{ payments : receives
    list_children ||--o{ payments : method
    list_children ||--o{ payments : payment_status
    users ||--o{ payments : recorded_by
```

## list_parents seed examples

| parent `code` | example children |
|---------------|------------------|
| `invoice_status` | pending, completed, cancelled |
| `payment_status` | unpaid, partial, paid, refunded |
| `payment_method` | cash, card, transfer |
| `entity_category` | traditional, casual, linen |

## Key cross-app links

| From | To | Purpose |
|------|----|---------|
| `users` | `user_branches` → `branches` | Branch access per user |
| `invoices` | `branches` | Which branch issued the sale |
| `contracts` | `customers` or `stakeholders` | Party depends on `party_type` |
| `contracts` | `branches` | Contract scoped to a branch |
| `inventory` | `branches` + `stock_items` | Stock levels per branch |
