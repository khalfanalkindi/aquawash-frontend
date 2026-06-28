'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Calendar,
  Download,
  Car,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import {
  format,
  subDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
} from 'date-fns'

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export default function AdminReportsPage() {
  const { invoices } = useStore()
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month')

  const dateRange = useMemo(() => {
    const now = new Date()
    switch (period) {
      case 'week':
        return { start: subDays(now, 7), end: now }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'all':
        return { start: new Date(2024, 0, 1), end: now }
    }
  }, [period])

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (inv) =>
        inv.status === 'completed' &&
        isWithinInterval(new Date(inv.createdAt), dateRange)
    )
  }, [invoices, dateRange])

  const stats = useMemo(() => {
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + inv.discount, 0)
    const avgTransaction = filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0

    // Payment method breakdown
    const paymentMethods = { cash: 0, card: 0, transfer: 0 }
    filteredInvoices.forEach((inv) => {
      paymentMethods[inv.paymentMethod] += inv.total
    })

    return {
      totalRevenue,
      totalDiscount,
      totalInvoices: filteredInvoices.length,
      avgTransaction,
      paymentMethods,
    }
  }, [filteredInvoices])

  const dailyRevenueData = useMemo(() => {
    const days = eachDayOfInterval(dateRange)
    return days.map((day) => {
      const dayStart = startOfDay(day)
      const dayInvoices = filteredInvoices.filter((inv) => {
        const invDate = startOfDay(new Date(inv.createdAt))
        return invDate.getTime() === dayStart.getTime()
      })
      return {
        date: format(day, period === 'week' ? 'EEE' : 'dd'),
        fullDate: format(day, 'dd/MM'),
        revenue: dayInvoices.reduce((sum, inv) => sum + inv.total, 0),
        count: dayInvoices.length,
      }
    })
  }, [filteredInvoices, dateRange, period])

  const productRevenueData = useMemo(() => {
    const productRevenue: Record<string, { name: string; revenue: number; count: number }> = {}

    filteredInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        if (!productRevenue[item.productId]) {
          productRevenue[item.productId] = {
            name: item.productName,
            revenue: 0,
            count: 0,
          }
        }
        productRevenue[item.productId].revenue += item.totalPrice
        productRevenue[item.productId].count += item.quantity
      })
    })

    return Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [filteredInvoices])

  const paymentMethodData = useMemo(() => {
    return [
      { name: 'Cash', value: stats.paymentMethods.cash },
      { name: 'Card', value: stats.paymentMethods.card },
      { name: 'Transfer', value: stats.paymentMethods.transfer },
    ].filter((m) => m.value > 0)
  }, [stats.paymentMethods])

  const handleExportReport = () => {
    const reportData = {
      period: period,
      dateRange: {
        from: format(dateRange.start, 'dd/MM/yyyy'),
        to: format(dateRange.end, 'dd/MM/yyyy'),
      },
      summary: {
        totalRevenue: stats.totalRevenue.toFixed(3),
        totalInvoices: stats.totalInvoices,
        avgTransaction: stats.avgTransaction.toFixed(3),
        totalDiscount: stats.totalDiscount.toFixed(3),
      },
      dailyRevenue: dailyRevenueData,
      topProducts: productRevenueData,
      paymentBreakdown: stats.paymentMethods,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Analyze your business performance</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={handleExportReport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalRevenue.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalInvoices}</div>
            <p className="mt-1 text-xs text-muted-foreground">Completed invoices</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Car className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgTransaction.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Per invoice</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Discounts</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalDiscount.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">OMR</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Given discounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={dailyRevenueData}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                <ChartTooltip
                  content={({ payload }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border border-border bg-background p-2 text-sm shadow-md">
                          <p className="font-medium">{data.fullDate}</p>
                          <p className="text-muted-foreground">Revenue: {data.revenue.toFixed(3)} OMR</p>
                          <p className="text-muted-foreground">Transactions: {data.count}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-revenue)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={productRevenueData} layout="vertical">
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Payment Methods</CardTitle>
            <CardDescription>Revenue distribution by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ payload }) => {
                        if (payload && payload[0]) {
                          return (
                            <div className="rounded-lg border border-border bg-background p-2 text-sm shadow-md">
                              <p className="font-medium">{payload[0].name}</p>
                              <p className="text-muted-foreground">{(payload[0].value as number).toFixed(3)} OMR</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">Product Performance</CardTitle>
          <CardDescription>Detailed breakdown by product</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Product</TableHead>
                <TableHead className="text-right font-medium">Units Sold</TableHead>
                <TableHead className="text-right font-medium">Revenue</TableHead>
                <TableHead className="text-right font-medium">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productRevenueData.map((product) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{product.count}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {product.revenue.toFixed(3)} OMR
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {stats.totalRevenue > 0
                      ? ((product.revenue / stats.totalRevenue) * 100).toFixed(1)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
