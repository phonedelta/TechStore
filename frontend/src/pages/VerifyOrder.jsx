import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import api from '../api/axios'

export default function VerifyOrder() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [order, setOrder] = useState(null)
  const ran = useRef(false)

  useEffect(() => {
    if (!token || ran.current) return
    ran.current = true

    api
      .get(`/orders/verify/${encodeURIComponent(token)}`, { timeout: 45000 })
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message || 'Order verified automatically.')
        setOrder(res.data.order)
        if (res.data.order?.order_number) {
          setTimeout(() => {
            navigate(`/order-success/${res.data.order.order_number}`, {
              state: { order: res.data.order },
              replace: true,
            })
          }, 1500)
        }
      })
      .catch((err) => {
        setStatus('error')
        const msg =
          err.code === 'ECONNABORTED'
            ? 'Verification is taking too long. Please try the link again.'
            : err.response?.data?.message || 'Verification failed.'
        setMessage(msg)
      })
  }, [token, navigate])

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h1 className="mt-6 font-display text-2xl font-bold text-ink">
            Verifying your order…
          </h1>
          <p className="mt-2 text-slate">Please wait — confirmation is automatic.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Order verified</h1>
          <p className="mt-3 text-slate">{message}</p>
          <p className="mt-2 text-sm text-slate">
            Invoice sent to{' '}
            <span className="font-semibold text-ink">{order?.customer_email}</span>.
          </p>
          <p className="mt-4 text-xs text-slate">Redirecting to confirmation…</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Verification failed</h1>
          <p className="mt-3 text-slate">{message}</p>
          <Link to="/" className="mt-8 inline-block text-sm font-semibold text-blue-600 hover:underline">
            Back to home
          </Link>
        </>
      )}
    </div>
  )
}
