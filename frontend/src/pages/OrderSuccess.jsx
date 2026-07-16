import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle, Download, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import usePageTitle from '../hooks/usePageTitle'
import { downloadInvoicePdf } from '../utils/generateInvoice'
import { formatMoney } from '../utils/money'

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  const { state } = useLocation()
  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(!state?.order)
  usePageTitle('Order Confirmed')

  useEffect(() => {
    if (state?.order || !orderNumber) return
    setLoading(true)
    api
      .get(`/orders/${orderNumber}`)
      .then((res) => setOrder(res.data))
      .catch(() => toast.error('Could not load order details'))
      .finally(() => setLoading(false))
  }, [orderNumber, state?.order])

  const handleDownloadInvoice = () => {
    if (!order) {
      toast.error('Order details not available')
      return
    }
    try {
      downloadInvoicePdf(order)
      toast.success('Invoice downloaded')
    } catch {
      toast.error('Failed to generate invoice')
    }
  }

  const paymentLabel =
    order?.payment_method === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : order?.payment_method === 'card'
        ? 'Credit / Debit Card'
        : order?.payment_method || '—'

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <CheckCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">Order Confirmed!</h1>
      <p className="mt-2 text-slate">Thank you for shopping with TechStore.</p>
      <p className="mt-4 rounded-xl bg-white px-4 py-3 font-mono text-sm font-semibold text-blue-600 ring-1 ring-ink/5">
        Order ID: {order?.order_number || orderNumber}
      </p>

      {loading && (
        <div className="mt-8 space-y-3">
          <div className="skeleton h-40 w-full rounded-2xl" />
        </div>
      )}

      {!loading && order && (
        <div className="mt-8 rounded-2xl bg-white p-6 text-left ring-1 ring-ink/5">
          <h2 className="font-display font-bold text-ink">Order Details</h2>
          <div className="mt-3 space-y-1 text-sm text-slate">
            <p><span className="font-medium text-ink">Name:</span> {order.customer_name}</p>
            <p><span className="font-medium text-ink">Email:</span> {order.customer_email}</p>
            <p><span className="font-medium text-ink">Phone:</span> {order.customer_phone}</p>
            <p>
              <span className="font-medium text-ink">Ship to:</span>{' '}
              {order.shipping_address}, {order.city}, {order.country} {order.postal_code}
            </p>
            <p><span className="font-medium text-ink">Payment:</span> {paymentLabel}</p>
            <p><span className="font-medium text-ink">Total:</span> {formatMoney(order.total)}</p>
          </div>
          {order.items?.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-ink/5 pt-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate">{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">{formatMoney(item.total_price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownloadInvoice}
          disabled={!order}
          className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download Invoice (PDF)
        </button>
        <Link
          to="/products"
          className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}
