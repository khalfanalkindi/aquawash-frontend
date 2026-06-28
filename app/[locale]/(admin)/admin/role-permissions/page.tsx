"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import {
  ShieldCheck,
  Search,
  X,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function RolePermissionsPage() {
  const { roles, permissions, rolePermissions, setRolePermissions } = useStore()
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const selectedRole = roles.find((r) => r.id === selectedRoleId)

  // Get permissions for selected role
  const rolePermissionIds = useMemo(() => {
    return rolePermissions
      .filter((rp) => rp.roleId === selectedRoleId)
      .map((rp) => rp.permissionId)
  }, [rolePermissions, selectedRoleId])

  // Filter permissions by search
  const filteredPermissions = permissions.filter(
    (p) =>
      p.isActive &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.module.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof permissions> = {}
    filteredPermissions.forEach((perm) => {
      if (!groups[perm.module]) {
        groups[perm.module] = []
      }
      groups[perm.module].push(perm)
    })
    return groups
  }, [filteredPermissions])

  const toggleModule = (module: string) => {
    setExpandedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    )
  }

  const applyRolePermissions = async (permissionIds: string[]) => {
    if (!selectedRoleId) return
    try {
      await setRolePermissions(selectedRoleId, permissionIds)
    } catch {
      toast.error("Failed to update role permissions")
    }
  }

  const togglePermission = (permissionId: string) => {
    const newPermissionIds = rolePermissionIds.includes(permissionId)
      ? rolePermissionIds.filter((id) => id !== permissionId)
      : [...rolePermissionIds, permissionId]
    void applyRolePermissions(newPermissionIds)
  }

  const toggleAllInModule = (module: string, perms: typeof permissions) => {
    const modulePermIds = perms.map((p) => p.id)
    const allSelected = modulePermIds.every((id) => rolePermissionIds.includes(id))

    if (allSelected) {
      const newPermissionIds = rolePermissionIds.filter((id) => !modulePermIds.includes(id))
      void applyRolePermissions(newPermissionIds)
    } else {
      const newPermissionIds = [...new Set([...rolePermissionIds, ...modulePermIds])]
      void applyRolePermissions(newPermissionIds)
    }
  }

  const selectAll = () => {
    const allPermIds = permissions.filter((p) => p.isActive).map((p) => p.id)
    void applyRolePermissions(allPermIds)
  }

  const clearAll = () => {
    void applyRolePermissions([])
  }

  const getModuleStatus = (perms: typeof permissions) => {
    const modulePermIds = perms.map((p) => p.id)
    const selectedCount = modulePermIds.filter((id) => rolePermissionIds.includes(id)).length
    if (selectedCount === 0) return "none"
    if (selectedCount === modulePermIds.length) return "all"
    return "partial"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Role Permissions</h1>
          <p className="text-sm text-muted-foreground">Assign permissions to roles</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Role Selection */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Role</CardTitle>
              <CardDescription>Choose a role to manage permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedRole && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{selectedRole.name}</CardTitle>
                <CardDescription>{selectedRole.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Permissions</span>
                  <Badge variant="secondary">{rolePermissionIds.length}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Permissions Grid */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">Permissions</CardTitle>
                <CardDescription>Select permissions to assign to this role</CardDescription>
              </div>
              <div className="relative max-w-sm">
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
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(groupedPermissions).length === 0 ? (
              <div className="py-8 text-center">
                <ShieldCheck className="mx-auto mb-3 size-10 text-muted-foreground" />
                <p className="text-muted-foreground">No permissions found</p>
              </div>
            ) : (
              Object.entries(groupedPermissions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([module, perms]) => {
                  const status = getModuleStatus(perms)
                  const isExpanded = expandedModules.includes(module)

                  return (
                    <Collapsible
                      key={module}
                      open={isExpanded}
                      onOpenChange={() => toggleModule(module)}
                    >
                      <div className="rounded-lg border border-border">
                        <CollapsibleTrigger asChild>
                          <div className="flex cursor-pointer items-center justify-between p-3 hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="size-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="size-4 text-muted-foreground" />
                              )}
                              <span className="font-medium text-foreground">{module}</span>
                              <Badge variant="secondary" className="text-xs">
                                {perms.filter((p) => rolePermissionIds.includes(p.id)).length}/{perms.length}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-7 px-2 text-xs",
                                status === "all" && "text-green-600"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleAllInModule(module, perms)
                              }}
                            >
                              {status === "all" ? (
                                <>
                                  <Check className="mr-1 size-3" />
                                  All Selected
                                </>
                              ) : status === "partial" ? (
                                "Select All"
                              ) : (
                                "Select All"
                              )}
                            </Button>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t border-border bg-muted/30 p-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                              {perms.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-background"
                                >
                                  <Checkbox
                                    checked={rolePermissionIds.includes(permission.id)}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                      {permission.name}
                                    </p>
                                    <code className="text-xs text-muted-foreground">
                                      {permission.code}
                                    </code>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )
                })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
