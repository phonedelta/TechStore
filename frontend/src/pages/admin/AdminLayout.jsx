import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Tags,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  ExternalLink,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/TechStore.png'
import usePageTitle from '../../hooks/usePageTitle'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

const titles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/messages': 'Messages',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  usePageTitle()

  const pageTitle = useMemo(() => {
    const match = Object.keys(titles)
      .sort((a, b) => b.length - a.length)
      .find((path) =>
        path === '/admin'
          ? location.pathname === '/admin'
          : location.pathname.startsWith(path)
      )
    return titles[match] || 'Admin'
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const nav = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-8 flex shrink-0 items-center gap-2.5 px-2">
        <img src={logo} alt="TechStore" className="h-9 w-9 rounded-xl object-contain" />
        <div>
          <p className="font-display text-base font-bold text-ink">TechStore</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate/60">Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#f0f1f3] text-ink shadow-sm'
                  : 'text-slate hover:bg-[#f7f8fa] hover:text-ink'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto shrink-0 space-y-2 border-t border-ink/5 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-full bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-sm ring-1 ring-ink/10 transition hover:bg-[#f7f8fa]"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          View Store
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-full bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-sm ring-1 ring-ink/10 transition hover:bg-[#f7f8fa] hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="font-admin flex min-h-screen bg-[#f5f5f5]">
      <aside className="sticky top-3 m-3 hidden h-[calc(100vh-1.5rem)] w-[240px] shrink-0 flex-col rounded-[22px] bg-white p-4 shadow-sm lg:flex">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute bottom-3 left-3 top-3 flex w-[240px] flex-col rounded-[22px] bg-white p-4 shadow-xl">
            <button
              type="button"
              className="mb-2 self-end rounded-xl p-2 text-slate hover:bg-fog"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col px-3 pb-3 pt-3 sm:px-5 lg:pl-0">
        <header className="mb-4 flex flex-wrap items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-sm sm:px-5">
          <button
            type="button"
            className="rounded-xl p-2 text-slate hover:bg-fog lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">{pageTitle}</h1>

          <div className="order-last w-full sm:order-none sm:mx-auto sm:w-auto sm:flex-1 sm:max-w-md lg:max-w-lg">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
              <input
                type="search"
                placeholder="Search products, orders, messages..."
                className="w-full rounded-2xl border-0 bg-[#f5f5f5] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate/45 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-slate transition hover:bg-[#ebebeb]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                2
              </span>
            </button>
            <div
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f5f5f5] text-slate"
              title={user?.name || 'Admin'}
            >
              <User className="h-[18px] w-[18px]" />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
