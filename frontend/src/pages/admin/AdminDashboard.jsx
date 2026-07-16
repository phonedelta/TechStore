import { useEffect, useMemo, useState } from 'react'
import {
  Package,
  DollarSign,
  MessageSquare,
  Bell,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { formatMoney } from '../../utils/money'

const STATUS_COLORS = {
  pending: '#ef4444',
  processing: '#f97316',
  shipped: '#3b82f6',
  delivered: '#22c55e',
  cancelled: '#94a3b8',
}

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function formatMonth(monthKey) {
  if (!monthKey) return ''
  const [y, m] = String(monthKey).split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleString('en', { month: 'short' })
}

function StatCard({ label, value, delta, up, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
        {up ? (
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
        )}
        <span className={up ? 'text-emerald-500' : 'text-red-500'}>{delta}</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const salesData = useMemo(() => {
    if (!stats?.sales_by_month?.length) return []
    return stats.sales_by_month.map((row) => ({
      month: formatMonth(row.month),
      revenue: Number(row.revenue) || 0,
      orders: Number(row.orders) || 0,
    }))
  }, [stats])

  const statusData = useMemo(() => {
    if (!stats?.orders_by_status?.length) return []
    return stats.orders_by_status.map((row) => ({
      name: STATUS_LABELS[row.status] || row.status,
      value: Number(row.count) || 0,
      color: STATUS_COLORS[row.status] || '#64748b',
    }))
  }, [stats])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-36 rounded-[20px]" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Products',
      value: stats.total_products,
      delta: '+0',
      up: true,
      icon: Package,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Total Revenue',
      value: formatMoney(stats.total_revenue),
      delta: '+0%',
      up: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Messages',
      value: stats.unread_messages ?? 0,
      delta: (stats.unread_messages ?? 0) > 0 ? `+${stats.unread_messages}` : '+0',
      up: (stats.unread_messages ?? 0) === 0,
      icon: MessageSquare,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Pending Orders',
      value: stats.pending_orders,
      delta: stats.pending_orders > 0 ? `+${stats.pending_orders}` : '+0',
      up: stats.pending_orders === 0,
      icon: Bell,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
  ]

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[20px] bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Sales History</h2>
          <p className="mt-0.5 text-sm text-slate">Track revenue variations over time</p>
          <div className="mt-6 h-72">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value) => [formatMoney(value), 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate">
                No sales data yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Order Status</h2>
          <p className="mt-0.5 text-sm text-slate">Distribution by status</p>
          <div className="mt-4 h-56">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate">
                No orders yet
              </div>
            )}
          </div>
          {statusData.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders + low stock */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[20px] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Recent Orders</h2>
          <div className="space-y-2.5">
            {stats.recent_orders?.length === 0 && (
              <p className="text-sm text-slate">No orders yet</p>
            )}
            {stats.recent_orders?.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl bg-[#f7f8fa] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{o.order_number}</p>
                  <p className="text-xs text-slate">{o.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">{formatMoney(o.total)}</p>
                  <p className="text-xs capitalize text-slate">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Low Stock Alerts</h2>
          {stats.low_stock?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/5 text-xs uppercase tracking-wide text-slate">
                    <th className="pb-2.5 font-medium">Product</th>
                    <th className="pb-2.5 font-medium">Category</th>
                    <th className="pb-2.5 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock.map((p) => (
                    <tr key={p.id} className="border-b border-ink/5 last:border-0">
                      <td className="py-3 font-medium text-ink">{p.name}</td>
                      <td className="py-3 text-slate">{p.category?.name}</td>
                      <td className="py-3 font-semibold text-red-500">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate">All products are sufficiently stocked.</p>
          )}
        </div>
      </div>
    </div>
  )
}
