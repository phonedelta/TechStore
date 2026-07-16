import { Link, useLocation } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'

export default function OrderCheckEmail() {
  const { state } = useLocation()
  const email = state?.customer_email || 'your email'
  const verificationUrl = state?.verification_url
  const orderNumber = state?.order_number
  const emailSent = state?.email_sent !== false

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Mail className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-bold text-ink">Check your email</h1>
      <p className="mt-3 text-slate">
        {emailSent ? (
          <>
            We sent a verification link to{' '}
            <span className="font-semibold text-ink">{email}</span>
            {orderNumber ? (
              <>
                {' '}
                for order <span className="font-semibold text-ink">{orderNumber}</span>
              </>
            ) : null}
            .
          </>
        ) : (
          <>
            Your order was created, but the email could not be delivered to{' '}
            <span className="font-semibold text-ink">{email}</span>.
          </>
        )}
      </p>
      <p className="mt-2 text-sm text-slate">
        {emailSent
          ? 'Open the link in the email — or use the button below. Your order will be verified automatically, then the invoice can be downloaded.'
          : 'Use the button below to verify your order now. You can also check spam if an email arrives later.'}
      </p>

      {verificationUrl && (
        <a
          href={verificationUrl}
          className="btn-press mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
        >
          Verify my order now
          <ArrowRight className="h-4 w-4" />
        </a>
      )}

      <p className="mt-6 text-sm text-slate">
        Didn&apos;t get the email? Check spam / promotions, then use the button above.
      </p>
      <Link to="/products" className="mt-8 inline-block text-sm font-semibold text-blue-600 hover:underline">
        Continue shopping
      </Link>
    </div>
  )
}
