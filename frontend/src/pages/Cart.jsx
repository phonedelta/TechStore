import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/money'

export default function Cart() {
  const { items, subtotal, shipping, tax, taxPercent, total, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-200" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-slate">Looks like you haven&apos;t added anything yet.</p>
        <Link
          to="/products"
          className="btn-press mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-fog/50 min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Quantity</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-100"
                          />
                          <Link
                            to={`/products/${item.id}`}
                            className="font-display text-sm font-semibold text-ink transition hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate">
                        {formatMoney(item.price)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-slate transition hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-slate transition hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-ink">
                        {formatMoney(item.price * item.quantity)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <Link
                to="/products"
                className="inline-flex rounded-xl border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-ink">Cart Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate">
                <span>Subtotal</span>
                <span className="font-medium text-ink">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Shipping</span>
                <span className="font-medium text-ink">
                  {shipping === 0 ? 'Free' : formatMoney(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Tax ({Number(taxPercent)}%)</span>
                <span className="font-medium text-ink">{formatMoney(tax)}</span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600">Free shipping applied</p>
              )}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between font-display text-lg font-bold text-ink">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-press mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
