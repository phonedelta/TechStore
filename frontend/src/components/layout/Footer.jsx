import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import logo from '../../assets/images/TechStore.png'

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.19 2.12.19v2.34h-1.2c-1.18 0-1.55.74-1.55 1.49v1.79h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  )
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  )
}

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .56.04.83.12V9.01a6.27 6.27 0 0 0-.83-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.7a8.18 8.18 0 0 0 4.77-1.05v-1z" />
    </svg>
  )
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
    </svg>
  )
}

const socials = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TikTokIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
]

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const categories = [
  { to: '/products?category=smartphones', label: 'Smartphones' },
  { to: '/products?category=laptops', label: 'Laptops' },
  { to: '/products?category=computer-accessories', label: 'Accessories' },
  { to: '/products?category=headphones', label: 'Gaming' },
]

const support = [
  { href: '#', label: 'FAQ' },
  { href: '#', label: 'Shipping Policy' },
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms & Conditions' },
]

function FooterLink({ to, href, children }) {
  const className =
    'group inline-flex items-center gap-1 text-sm text-white/55 transition duration-300 hover:translate-x-1 hover:text-white'

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
        <ArrowUpRight className="h-3 w-3 opacity-0 transition duration-300 group-hover:opacity-100" />
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {children}
      <ArrowUpRight className="h-3 w-3 opacity-0 transition duration-300 group-hover:opacity-100" />
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#060b16] text-white">
      {/* Fluid background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-10 pb-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5 transition hover:opacity-90">
              <img
                src={logo}
                alt="TechStore"
                className="h-10 w-10 rounded-xl object-contain shadow-lg shadow-blue-600/20"
              />
              <span className="font-display text-2xl font-bold tracking-tight">TechStore</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
              Your trusted destination for premium electronics and innovative technology.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/30"
                >
                  <Icon className="h-[18px] w-[18px] transition duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Support
            </h4>
            <ul className="space-y-3">
              {support.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-white/55">
              <li>
                <a
                  href="mailto:support@techstore.com"
                  className="group flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="break-all">support@techstore.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+12345678900"
                  className="group flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap">+1 (234) 567-8900</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="leading-relaxed">123 Technology Avenue, Innovation City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
            <p>© 2026 TechStore. All Rights Reserved.</p>
            <a
              href="https://thinkgroup.ma/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition duration-300 hover:text-blue-400"
            >
              Conçu et réalisé par Think Group.
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
