import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, CreditCard, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/money'

function VisaLogo({ className = 'h-5 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-label="Visa" role="img">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M19.5 21.5h-2.7l1.7-10.5h2.7l-1.7 10.5zm11.4-10.2c-.5-.2-1.4-.4-2.4-.4-2.7 0-4.5 1.4-4.5 3.4 0 1.5 1.4 2.3 2.4 2.8 1.1.5 1.4.9 1.4 1.3 0 .7-.9 1.1-1.7 1.1-1.1 0-1.8-.2-2.7-.6l-.4-.2-.4 2.4c.7.3 2 .6 3.3.6 3.1 0 5.1-1.4 5.1-3.5 0-1.2-.7-2.1-2.3-2.8-1-.5-1.5-.8-1.5-1.3 0-.4.5-.9 1.5-.9.9 0 1.5.2 2 .4l.2.1.5-2.4zm7.5-.3h-2.1c-.6 0-1.1.2-1.4.9l-3.9 9.6h2.8l.5-1.5h3.4l.3 1.5h2.4l-2-10.5zm-3.3 6.8.9-2.6.2-.5.1.5.5 2.6h-1.7zm-15.7-6.8-2.6 7.1-.3-1.4c-.5-1.6-1.9-3.3-3.6-4.2l2.4 8.9h2.8l4.2-10.4h-2.9z"
      />
      <path fill="#F9A01B" d="M12.2 11H9.6l-.1.3C13 12.2 15.2 14.5 16 17l-.9-4.6c-.1-.7-.7-1.1-1.3-1.1-.2 0-.4 0-.6.1z" />
    </svg>
  )
}

function MastercardLogo({ className = 'h-5 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-label="Mastercard" role="img">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19.5" cy="16" r="7.5" fill="#EB001B" />
      <circle cx="28.5" cy="16" r="7.5" fill="#F79E1B" />
      <path
        d="M24 10.7a7.48 7.48 0 0 1 2.7 5.3 7.48 7.48 0 0 1-2.7 5.3 7.48 7.48 0 0 1-2.7-5.3 7.48 7.48 0 0 1 2.7-5.3z"
        fill="#FF5F00"
      />
    </svg>
  )
}

function AmexLogo({ className = 'h-5 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-label="American Express" role="img">
      <rect width="48" height="32" rx="4" fill="#2E77BC" />
      <path
        fill="#fff"
        d="M8.5 20.5 11 11.5h3.2l1.1 2.6 1.1-2.6h3.1l2.5 9h-2.7l-.5-1.8h-2.9l-.5 1.8H13l1.6-3.8.6 1.5-1.2 2.3H8.5zm6.4-3.8.9-2.6.9 2.6h-1.8zm10.2 3.8V11.5h4.3c2.1 0 3.5 1.1 3.5 2.9 0 1.3-.7 2.2-1.8 2.6l2.2 3.5h-3l-1.8-3h-.8v3h-2.6zm2.6-4.8h1.4c.7 0 1.1-.4 1.1-1s-.4-1-1.1-1h-1.4v2zm7.8 4.8-1.5-2.2h-.8v2.2h-2.6V11.5h4.5c2 0 3.4 1.1 3.4 2.8 0 1.2-.6 2.1-1.7 2.5l2 3.7h-3.3zm-.1-7.2h-1.3v2.1h1.3c.6 0 1-.3 1-1.05 0-.7-.4-1.05-1-1.05z"
      />
    </svg>
  )
}

const STEPS = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
]

const initial = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: '',
  city: '',
  country: 'United States',
  postal_code: '',
  payment_method: 'cash_on_delivery',
}

function Stepper({ step }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const active = step === s.id
        const done = step > s.id
        return (
          <div key={s.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                  active || done
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 text-slate'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.id}
              </span>
              <span
                className={`hidden text-sm font-semibold sm:inline ${
                  active ? 'text-blue-600' : done ? 'text-ink' : 'text-slate'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 rounded sm:w-16 ${
                  done ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderSummary({ items, subtotal, shipping, tax, taxPercent, total }) {
  return (
    <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-ink">Order Summary</h2>
      <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3 text-sm">
            <img
              src={i.image_url}
              alt=""
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-100"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{i.name}</p>
              <p className="text-xs text-slate">Qty {i.quantity}</p>
            </div>
            <span className="shrink-0 font-semibold text-ink">
              {formatMoney(i.price * i.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
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
        <div className="flex justify-between border-t border-slate-100 pt-3 font-display text-lg font-bold text-ink">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, shipping, tax, taxPercent, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-slate">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block font-medium text-blue-600 hover:underline">
          Go shopping
        </Link>
      </div>
    )
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validateShipping = () => {
    const e = {}
    if (!form.customer_name.trim()) e.customer_name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) e.customer_email = 'Valid email required'
    if (!form.customer_phone.trim()) e.customer_phone = 'Required'
    if (!form.shipping_address.trim()) e.shipping_address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    if (!form.postal_code.trim()) e.postal_code = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goPayment = () => {
    if (validateShipping()) setStep(2)
  }

  const placeOrder = async () => {
    if (!agreed) {
      toast.error('Please agree to the Terms and Conditions')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      })
      clearCart()
      toast.success(data.message || 'Check your email to verify the order')
      navigate('/order-check-email', {
        state: {
          customer_email: data.customer_email || form.customer_email,
          order_number: data.order_number,
          verification_url: data.verification_url,
          email_sent: data.email_sent,
        },
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (name) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
      errors[name] ? 'border-red-400' : 'border-slate-200'
    }`

  const field = (name, label, props = {}) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        className={inputClass(name)}
        {...props}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="bg-fog/50 min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-center font-display text-3xl font-bold text-ink sm:text-4xl">
          Checkout
        </h1>
        <Stepper step={step} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Step 1 — Shipping */}
            {step === 1 && (
              <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 font-display text-xl font-bold text-ink">Shipping Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field('customer_name', 'Full Name', { placeholder: 'John Doe' })}
                  {field('customer_email', 'Email', { type: 'email', placeholder: 'john@email.com' })}
                  {field('customer_phone', 'Phone Number', { placeholder: '+1 555 000 0000' })}
                  <div className="sm:col-span-2">
                    {field('shipping_address', 'Address', { placeholder: '123 Main Street, Apt 4' })}
                  </div>
                  {field('city', 'City', { placeholder: 'San Francisco' })}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => set('country', e.target.value)}
                      className={inputClass('country')}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Germany</option>
                      <option>Morocco</option>
                      <option>Other</option>
                    </select>
                  </div>
                  {field('postal_code', 'Postal Code', { placeholder: '94102' })}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goPayment}
                    className="btn-press rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 font-display text-xl font-bold text-ink">Payment Method</h2>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                      form.payment_method === 'cash_on_delivery'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment_method === 'cash_on_delivery'}
                      onChange={() => set('payment_method', 'cash_on_delivery')}
                      className="accent-blue-600"
                    />
                    <Banknote className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Cash on Delivery</p>
                      <p className="text-xs text-slate">Pay when your order arrives</p>
                    </div>
                  </label>

                  <label
                    className="relative flex cursor-not-allowed items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 opacity-70"
                  >
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="accent-blue-600"
                    />
                    <CreditCard className="h-5 w-5 text-slate" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink">Credit / Debit Card</p>
                        <span className="rounded-full bg-amber/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-slate">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <VisaLogo />
                      <MastercardLogo />
                      <AmexLogo />
                    </div>
                  </label>
                </div>

                <div className="mt-8 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate transition hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-press rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 font-display text-xl font-bold text-ink">Review Order</h2>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-fog p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink">Shipping Information</h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-slate">
                      <p className="font-medium text-ink">{form.customer_name}</p>
                      <p>{form.customer_email}</p>
                      <p>{form.customer_phone}</p>
                      <p>
                        {form.shipping_address}, {form.city}, {form.country} {form.postal_code}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-fog p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink">Payment Method</h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-slate">
                      {form.payment_method === 'cash_on_delivery'
                        ? 'Cash on Delivery'
                        : 'Credit / Debit Card'}
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <span>
                      I agree to the{' '}
                      <a href="#" className="font-medium text-blue-600 hover:underline">
                        Terms and Conditions
                      </a>
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate transition hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting}
                    className="btn-press rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            taxPercent={taxPercent}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}
