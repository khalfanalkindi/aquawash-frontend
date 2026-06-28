"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useStore } from "@/lib/store"
import { isApiMode } from "@/lib/api/constants"
import { PERMISSION_CODES } from "@/lib/permission-registry.generated"
import { Permission } from "@/lib/types"
import {
  Pencil,
  Trash2,
  Key,
  Search,
  X,
  Filter,
  Plus,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PermissionsPage() {
  const { permissions, addPermission, updatePermission, deletePermission } = useStore()
  const t = useTranslations("permissionsPage")
  const readOnly = isApiMode()
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    module: "",
    isActive: true,
  })

  const modules = useMemo(() => {
    const uniqueModules = [...new Set(permissions.map((p) => p.module))]
    return uniqueModules.sort()
  }, [permissions])

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = moduleFilter === "all" || permission.module === moduleFilter
    return matchesSearch && matchesModule
  })

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {}
    filteredPermissions.forEach((perm) => {
      if (!groups[perm.module]) {
        groups[perm.module] = []
      }
      groups[perm.module].push(perm)
    })
    return groups
  }, [filteredPermissions])

  const handleOpenDialog = (permission?: Permission) => {
    if (permission) {
      setEditingPermission(permission)
      setFormData({
        code: permission.code,
        name: permission.name,
        description: permission.description || "",
        module: permission.module,
        isActive: permission.isActive,
      })
    } else {
      setEditingPermission(null)
      setFormData({ code: "", name: "", description: "", module: "", isActive: true })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.module.trim()) return

    if (editingPermission) {
      updatePermission(editingPermission.id, formData)
    } else {
      addPermission(formData)
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    deletePermission(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {readOnly ? t("registryTitle") : t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {readOnly ? t("readOnlySubtitle") : t("subtitle")}
          </p>
        </div>
        {readOnly ? (
          <Badge variant="secondary" className="gap-1 self-start font-normal">
            <BookOpen className="size-3.5" />
            {t("registryBadge", { count: permissions.length })}
          </Badge>
        ) : (
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="size-4" />
            {t("addPermission")}
          </Button>
        )}
      </div>

      {readOnly && (
        <Card className="border-border bg-muted/40">
          <CardContent className="space-y-2 py-3 text-sm text-muted-foreground">
            <p>{t("readOnlyNotice")}</p>
            <p>{t("assignHint")}</p>
            <p className="font-mono text-xs text-foreground/70">
              {PERMISSION_CODES.length} codes · shared/permissions.json
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Permissions by Module */}
      {Object.keys(groupedPermissions).length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <Key className="mx-auto mb-3 size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No permissions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedPermissions)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([module, perms]) => (
              <Card key={module} className="border-border">
                <CardContent className="p-0">
                  <div className="border-b border-border bg-muted/50 px-4 py-3">
                    <h3 className="font-medium text-foreground">{module}</h3>
                    <p className="text-xs text-muted-foreground">{perms.length} permissions</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-medium">Permission</TableHead>
                        <TableHead className="hidden font-medium md:table-cell">Code</TableHead>
                        <TableHead className="hidden font-medium lg:table-cell">Description</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        {!readOnly && (
                          <TableHead className="text-right font-medium">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {perms.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                <Key className="size-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">{permission.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                              {permission.code}
                            </code>
                          </TableCell>
                          <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">
                            {permission.description || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={permission.isActive ? "default" : "secondary"} className={permission.isActive ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}>
                              {permission.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          {!readOnly && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => handleOpenDialog(permission)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteConfirm(permission.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      {!readOnly && (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPermission ? "Edit Permission" : "Add New Permission"}</DialogTitle>
            <DialogDescription>
              {editingPermission ? "Update permission details" : "Create a new system permission"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Permission Code</label>
                <Input
                  placeholder="e.g., users.create"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Module</label>
                <Input
                  placeholder="e.g., Users, Services"
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  list="modules"
                />
                <datalist id="modules">
                  {modules.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permission Name</label>
              <Input
                placeholder="e.g., Create Users"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what this permission allows..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active Status</label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.code.trim() || !formData.name.trim() || !formData.module.trim()}
            >
              {editingPermission ? "Save Changes" : "Create Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this permission? This will remove it from all roles and users. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </>
      )}
    </div>
  )
}
