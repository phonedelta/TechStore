import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import logo from '../../assets/images/TechStore.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [cartPop, setCartPop] = useState(false)
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (count > 0) {
      setCartPop(true)
      const t = setTimeout(() => setCartPop(false), 450)
      return () => clearTimeout(t)
    }
  }, [count])

  const onSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? 'glass border-b border-slate-200/60 shadow-[0_8px_30px_rgb(12,18,34,0.06)]'
          : 'bg-white/90 border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <img
            src={logo}
            alt="TechStore"
            className="h-9 w-9 rounded-lg object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
          />
          <span className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-blue-600">
            TechStore
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-[15px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 ${
                      isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => { setSearchOpen(!searchOpen); setOpen(false) }}
            className={`btn-press flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${
              searchOpen ? 'bg-blue-50 text-blue-600' : ''
            }`}
            aria-label="Search"
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={1.75} />
          </button>

          <Link
            to="/cart"
            className={`btn-press relative flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${
              cartPop ? 'animate-cart-pop' : ''
            }`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm shadow-blue-600/40">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="btn-press flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-all duration-300 hover:bg-blue-50 md:hidden"
            onClick={() => { setOpen(!open); setSearchOpen(false) }}
            aria-label="Toggle menu"
          >
            <span className="relative h-5 w-5">
              <Menu
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                  open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
                strokeWidth={1.75}
              />
              <X
                className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                  open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
                strokeWidth={1.75}
              />
            </span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="animate-slide-down border-t border-slate-100/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <form onSubmit={onSearch} className="mx-auto flex max-w-7xl gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15"
            />
            <button
              type="submit"
              className="btn-press shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-600/35"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <div className="animate-slide-down border-t border-slate-100/80 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={({ isActive }) =>
                  `animate-fade-up rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:translate-x-1'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
