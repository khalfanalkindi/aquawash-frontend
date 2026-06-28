'use client'

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Clock,
  CreditCard,
  Banknote,
  Building2,
  ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfDay, isAfter } from 'date-fns'

export default function AdminDashboardPage() {
  const { products, currentBranchId, getInvoicesForBranch } = useStore()
  const invoices = getInvoicesForBranch(currentBranchId)

  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const last7Days = subDays(today, 7)
    
    const todayInvoices = invoices.filter(inv => 
      isAfter(new Date(inv.createdAt), today) && inv.status === 'completed'
    )
    const weekInvoices = invoices.filter(inv => 
      isAfter(new Date(inv.createdAt), last7Days) && inv.status === 'completed'
    )
    
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const weekRevenue = weekInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalRevenue = invoices.filter(i => i.status === 'completed').reduce((sum, inv) => sum + inv.total, 0)
    
    return {
      todayInvoices: todayInvoices.length,
      todayRevenue,
      weekInvoices: weekInvoices.length,
      weekRevenue,
      totalRevenue,
      totalInvoices: invoices.length,
      activeProducts: products.filter((p) => p.isActive).length,
      avgTransaction: invoices.length > 0 ? totalRevenue / invoices.filter(i => i.status === 'completed').length : 0,
    }
  }, [invoices, products])

  const dailyRevenueData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date: format(date, 'EEE'),
        fullDate: startOfDay(date),
      }
    })

    return days.map(day => {
      const dayInvoices = invoices.filter(inv => {
        const invDate = startOfDay(new Date(inv.createdAt))
        return invDate.getTime() === day.fullDate.getTime() && inv.status === 'completed'
      })
      return {
        name: day.date,
        revenue: dayInvoices.reduce((sum, inv) => sum + inv.total, 0),
      }
    })
  }, [invoices])

  const paymentMethodData = useMemo(() => {
    const methods = { cash: 0, card: 0, transfer: 0 }
    invoices.filter(i => i.status === 'completed').forEach(inv => {
      methods[inv.paymentMethod] += inv.total
    })
    return [
      { name: 'Cash', value: methods.cash, color: 'hsl(var(--chart-1))' },
      { name: 'Card', value: methods.card, color: 'hsl(var(--chart-2))' },
      { name: 'Transfer', value: methods.transfer, color: 'hsl(var(--chart-3))' },
    ].filter(m => m.value > 0)
  }, [invoices])

  const recentInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5)
  }, [invoices])

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.todayRevenue.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              {stats.todayInvoices} transactions today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Week Revenue</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.weekRevenue.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              {stats.weekInvoices} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalInvoices}</div>
            <p className="mt-1 text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgTransaction.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.activeProducts} active products</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Weekly Revenue</CardTitle>
            <CardDescription>Revenue over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={dailyRevenueData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Payment Methods</CardTitle>
            <CardDescription>Revenue by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              {paymentMethodData.length > 0 ? (
                <PieChart width={200} height={200}>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        return (
                          <div className="rounded-lg border border-border bg-background p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{(payload[0].value as number).toFixed(3)} OMR</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
          <CardDescription>Latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {invoice.paymentMethod === 'cash' && <Banknote className="h-5 w-5 text-muted-foreground" />}
                    {invoice.paymentMethod === 'card' && <CreditCard className="h-5 w-5 text-muted-foreground" />}
                    {invoice.paymentMethod === 'transfer' && <Building2 className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.orderTag || 'Walk-in'} · {format(new Date(invoice.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{invoice.total.toFixed(3)} OMR</p>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === 'completed'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : invoice.status === 'pending'
                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
