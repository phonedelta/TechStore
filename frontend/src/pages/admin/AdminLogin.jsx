import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/TechStore.png'
import usePageTitle from '../../hooks/usePageTitle'

const features = [
  { icon: BarChart3, label: 'Live sales insights' },
  { icon: ShieldCheck, label: 'Secure admin access' },
  { icon: Package, label: 'Product & order control' },
]

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@techstore.com')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  usePageTitle()

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          'Login failed'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="font-admin flex min-h-screen flex-col lg:flex-row">
      {/* Left — brand panel */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f7f1e8] px-8 py-10 sm:px-12 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#e8dcc8]/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5">
          <img src={logo} alt="TechStore" className="h-10 w-10 rounded-full object-contain ring-2 ring-white shadow-sm" />
          <span className="font-display text-lg font-bold text-ink">TechStore</span>
        </Link>

        <div className="relative z-10 mt-10 max-w-lg lg:mt-14">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[2.6rem]">
            TechStore Admin{' '}
            <span className="text-blue-600">Panel</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
            Your{' '}
            <span className="font-semibold text-blue-600">intelligent</span> hub for{' '}
            <span className="font-semibold text-blue-600">store management</span>
          </p>
          <p className="mt-2 text-sm text-slate/80">
            Manage products, orders, categories, and customer messages with ease.
          </p>
        </div>

        {/* Store-related collage */}
        <div className="relative z-10 mx-auto mt-8 flex w-full max-w-md flex-1 items-center justify-center lg:mt-6 lg:max-w-lg">
          <div className="relative w-full">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=85"
              alt="Electronics workspace"
              className="w-full rounded-[28px] object-cover shadow-2xl shadow-ink/15 ring-1 ring-ink/5"
            />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
              alt="Premium headphones"
              className="absolute -bottom-4 -left-3 w-[38%] rounded-2xl object-cover shadow-xl ring-4 ring-[#f7f1e8] sm:-left-6"
            />
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80"
              alt="Smartphone"
              className="absolute -right-2 -top-4 w-[32%] rounded-2xl object-cover shadow-xl ring-4 ring-[#f7f1e8] sm:-right-5"
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-10">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-sm ring-1 ring-ink/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold leading-snug text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f3f4f6] px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-xl shadow-ink/5 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <img src={logo} alt="TechStore" className="h-12 w-12 rounded-full object-contain ring-2 ring-fog" />
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Sign in</h2>
              <p className="text-sm text-slate">Access your TechStore account</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@techstore.com"
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-10 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate/50 transition hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-press group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
              {!submitting && (
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate/70">
            Default: admin@techstore.com / password
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-slate/50">
          <p>TechStore Admin Panel v1.0.0</p>
          <p className="mt-1">© 2026 TechStore — All rights reserved</p>
        </div>
      </div>
    </div>
  )
}
