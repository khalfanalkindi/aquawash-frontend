"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import {
  UserCog,
  Search,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  User,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function UserPermissionsPage() {
  const { 
    users, 
    roles, 
    permissions, 
    rolePermissions, 
    userPermissions, 
    setUserPermissions,
    getUserEffectivePermissions 
  } = useStore()
  
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("direct")

  const selectedUser = users.find((u) => u.id === selectedUserId)
  const selectedUserRole = selectedUser?.roleId ? roles.find((r) => r.id === selectedUser.roleId) : null

  // Get permissions from role
  const rolePermissionIds = useMemo(() => {
    if (!selectedUser?.roleId) return []
    return rolePermissions
      .filter((rp) => rp.roleId === selectedUser.roleId)
      .map((rp) => rp.permissionId)
  }, [rolePermissions, selectedUser])

  // Get direct user permissions
  const directPermissionIds = useMemo(() => {
    return userPermissions
      .filter((up) => up.userId === selectedUserId)
      .map((up) => up.permissionId)
  }, [userPermissions, selectedUserId])

  // Get all effective permissions
  const effectivePermissions = useMemo(() => {
    return getUserEffectivePermissions(selectedUserId)
  }, [getUserEffectivePermissions, selectedUserId])

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

  const applyUserPermissions = async (permissionIds: string[]) => {
    if (!selectedUserId) return
    try {
      await setUserPermissions(selectedUserId, permissionIds)
    } catch {
      toast.error("Failed to update user permissions")
    }
  }

  const toggleDirectPermission = (permissionId: string) => {
    const newPermissionIds = directPermissionIds.includes(permissionId)
      ? directPermissionIds.filter((id) => id !== permissionId)
      : [...directPermissionIds, permissionId]
    void applyUserPermissions(newPermissionIds)
  }

  const toggleAllDirectInModule = (module: string, perms: typeof permissions) => {
    const modulePermIds = perms.map((p) => p.id)
    const nonRolePermIds = modulePermIds.filter((id) => !rolePermissionIds.includes(id))
    const allSelected = nonRolePermIds.every((id) => directPermissionIds.includes(id))

    if (allSelected) {
      const newPermissionIds = directPermissionIds.filter((id) => !modulePermIds.includes(id))
      void applyUserPermissions(newPermissionIds)
    } else {
      const newPermissionIds = [...new Set([...directPermissionIds, ...nonRolePermIds])]
      void applyUserPermissions(newPermissionIds)
    }
  }

  const clearDirectPermissions = () => {
    void applyUserPermissions([])
  }

  const getPermissionSource = (permissionId: string) => {
    const fromRole = rolePermissionIds.includes(permissionId)
    const fromDirect = directPermissionIds.includes(permissionId)
    if (fromRole && fromDirect) return "both"
    if (fromRole) return "role"
    if (fromDirect) return "direct"
    return "none"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">User Permissions</h1>
          <p className="text-sm text-muted-foreground">Assign direct permissions to users (hybrid with role permissions)</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* User Selection */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select User</CardTitle>
              <CardDescription>Choose a user to manage permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        {user.fullName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedUser && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{selectedUser.fullName}</CardTitle>
                <CardDescription>@{selectedUser.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedUserRole && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                    <Shield className="size-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedUserRole.name}</p>
                      <p className="text-xs text-muted-foreground">Assigned Role</p>
                    </div>
                    <Badge variant="secondary">{rolePermissionIds.length}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">From Role</span>
                  <Badge variant="outline">{rolePermissionIds.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Direct Permissions</span>
                  <Badge variant="outline">{directPermissionIds.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Effective</span>
                  <Badge>{effectivePermissions.length}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={clearDirectPermissions}
                  disabled={directPermissionIds.length === 0}
                >
                  Clear Direct Permissions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Permissions Grid */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">Permissions</CardTitle>
                  <CardDescription>Manage direct user permissions</CardDescription>
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct">Direct Permissions</TabsTrigger>
                  <TabsTrigger value="effective">All Effective</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeTab === "effective" ? (
              // Show all effective permissions (read-only view)
              <div className="space-y-2">
                {Object.entries(groupedPermissions)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([module, perms]) => {
                    const effectiveInModule = perms.filter((p) => 
                      effectivePermissions.some((ep) => ep.id === p.id)
                    )
                    if (effectiveInModule.length === 0) return null

                    return (
                      <div key={module} className="rounded-lg border border-border">
                        <div className="flex items-center justify-between p-3 bg-muted/30">
                          <span className="font-medium text-foreground">{module}</span>
                          <Badge variant="secondary">
                            {effectiveInModule.length} active
                          </Badge>
                        </div>
                        <div className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {effectiveInModule.map((permission) => {
                              const source = getPermissionSource(permission.id)
                              return (
                                <Badge
                                  key={permission.id}
                                  variant="outline"
                                  className={cn(
                                    "gap-1",
                                    source === "role" && "border-primary/50 bg-primary/5",
                                    source === "direct" && "border-green-500/50 bg-green-500/5",
                                    source === "both" && "border-amber-500/50 bg-amber-500/5"
                                  )}
                                >
                                  {source === "role" && <Shield className="size-3 text-primary" />}
                                  {source === "direct" && <User className="size-3 text-green-600" />}
                                  {source === "both" && <UserCog className="size-3 text-amber-600" />}
                                  {permission.name}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="size-3 text-primary" />
                    From Role
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="size-3 text-green-600" />
                    Direct
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCog className="size-3 text-amber-600" />
                    Both
                  </div>
                </div>
              </div>
            ) : (
              // Direct permissions management
              Object.keys(groupedPermissions).length === 0 ? (
                <div className="py-8 text-center">
                  <UserCog className="mx-auto mb-3 size-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No permissions found</p>
                </div>
              ) : (
                Object.entries(groupedPermissions)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([module, perms]) => {
                    const isExpanded = expandedModules.includes(module)
                    const nonRolePerms = perms.filter((p) => !rolePermissionIds.includes(p.id))
                    const directCount = perms.filter((p) => directPermissionIds.includes(p.id)).length
                    const roleCount = perms.filter((p) => rolePermissionIds.includes(p.id)).length

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
                                <div className="flex gap-1">
                                  {roleCount > 0 && (
                                    <Badge variant="outline" className="text-xs border-primary/50 bg-primary/5">
                                      <Shield className="mr-1 size-3" />
                                      {roleCount}
                                    </Badge>
                                  )}
                                  {directCount > 0 && (
                                    <Badge variant="outline" className="text-xs border-green-500/50 bg-green-500/5">
                                      <User className="mr-1 size-3" />
                                      {directCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {nonRolePerms.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAllDirectInModule(module, perms)
                                  }}
                                >
                                  {nonRolePerms.every((p) => directPermissionIds.includes(p.id))
                                    ? "Clear Direct"
                                    : "Add All Direct"}
                                </Button>
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="border-t border-border bg-muted/30 p-3">
                              <div className="grid gap-2 sm:grid-cols-2">
                                {perms.map((permission) => {
                                  const isFromRole = rolePermissionIds.includes(permission.id)
                                  const isDirectAssigned = directPermissionIds.includes(permission.id)

                                  return (
                                    <label
                                      key={permission.id}
                                      className={cn(
                                        "flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-background",
                                        isFromRole && "opacity-60"
                                      )}
                                    >
                                      <Checkbox
                                        checked={isFromRole || isDirectAssigned}
                                        disabled={isFromRole}
                                        onCheckedChange={() => toggleDirectPermission(permission.id)}
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-medium text-foreground">
                                            {permission.name}
                                          </p>
                                          {isFromRole && (
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 border-primary/50 bg-primary/5">
                                              <Shield className="mr-0.5 size-2" />
                                              Role
                                            </Badge>
                                          )}
                                        </div>
                                        <code className="text-xs text-muted-foreground">
                                          {permission.code}
                                        </code>
                                      </div>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )
                  })
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
