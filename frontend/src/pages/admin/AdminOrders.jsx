import { useEffect, useState } from 'react'
import { Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { formatMoney } from '../../utils/money'

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColor = {
  pending: 'bg-orange-50 text-orange-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get('/admin/orders', { params: { status: filter || undefined } })
      .then((res) => setOrders(res.data.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const viewOrder = async (id) => {
    try {
      const { data } = await api.get(`/admin/orders/${id}`)
      setSelected(data)
    } catch {
      toast.error('Failed to load order')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { status })
      toast.success('Status updated')
      setSelected(data)
      load()
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-ink/10 outline-none"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/5">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/5 text-xs uppercase text-slate">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate">No orders found</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-teal">{o.order_number}</td>
                  <td className="px-4 py-3 font-medium">{o.customer_name}</td>
                  <td className="px-4 py-3 text-slate">{o.customer_email}</td>
                  <td className="px-4 py-3 text-slate">{o.customer_phone}</td>
                  <td className="px-4 py-3 text-slate">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold">{formatMoney(o.total)}</td>
                  <td className="px-4 py-3 text-xs capitalize text-slate">{o.payment_method.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => viewOrder(o.id)} className="rounded-lg p-2 hover:bg-fog">
                      <Eye className="h-4 w-4 text-slate" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Order {selected.order_number}</h2>
              <button type="button" onClick={() => setSelected(null)}><X /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Customer:</span> {selected.customer_name}</p>
              <p><span className="font-medium">Email:</span> {selected.customer_email}</p>
              <p><span className="font-medium">Phone:</span> {selected.customer_phone}</p>
              <p>
                <span className="font-medium">Address:</span>{' '}
                {selected.shipping_address}, {selected.city}, {selected.country} {selected.postal_code}
              </p>
              <p><span className="font-medium">Total:</span> {formatMoney(selected.total)}</p>
            </div>
            <ul className="mt-4 space-y-2 border-t border-ink/5 pt-4">
              {selected.items?.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">{formatMoney(item.total_price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">Update Status</label>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="w-full rounded-xl bg-fog px-3 py-2 text-sm capitalize ring-1 ring-ink/10 outline-none"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
