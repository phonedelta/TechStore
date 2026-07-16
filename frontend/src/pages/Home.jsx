import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Headphones, RotateCcw, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import Reveal from '../components/Reveal'

const features = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders over 100 MAD worldwide' },
  { icon: Shield, title: 'Secure Checkout', text: 'Encrypted payments & buyer protection' },
  { icon: Headphones, title: '24/7 Support', text: 'Real humans ready to help anytime' },
  { icon: RotateCcw, title: '30-Day Returns', text: 'Hassle-free returns on all products' },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    text: 'TechStore delivered my laptop in two days. Packaging was impeccable and the price beat every competitor.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    name: 'Marcus Webb',
    role: 'Developer',
    text: 'Finally an electronics store that feels premium. The ANC headphones are studio-quality.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    name: 'Elena Rossi',
    role: 'Photographer',
    text: 'Customer service sorted a cable swap in minutes. I shop here for all my gear now.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/products', { params: { featured: 1, per_page: 8 } }),
      api.get('/categories'),
    ])
      .then(([productsRes, catsRes]) => {
        setFeatured(productsRes.data.data || [])
        setCategories(catsRes.data.slice(0, 8))
      })
      .catch(() => toast.error('Failed to load homepage data'))
      .finally(() => setLoading(false))
  }, [])

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <div className="overflow-hidden bg-fog">
      {/* Hero — full-bleed, brand first */}
      <section className="relative min-h-[100svh] overflow-hidden bg-ink">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#0f172a]/80 to-[#1e3a8a]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/75 via-transparent to-[#020617]/30" />
        <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
          <p className="animate-fade-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            TechStore
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl font-display text-2xl font-semibold leading-snug text-white/90 sm:text-3xl md:text-4xl">
            Upgrade Your Tech Lifestyle
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            Discover the latest electronics and accessories at the best prices. Quality you can trust.
          </p>
          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="btn-press group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:shadow-xl hover:shadow-blue-600/45"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="btn-press inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:border-white/40 hover:bg-white/10"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Catalog</p>
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Shop by Category</h2>
              <p className="mt-2 text-slate">Find exactly what you need</p>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:gap-2.5 hover:text-blue-700 sm:inline-flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 4) + 1}>
              <Link
                to={`/products?category=${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-[20px]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent transition duration-500 group-hover:from-ink/95" />
                <div className="absolute inset-x-0 bottom-0 p-4 transition duration-400 group-hover:-translate-y-0.5">
                  <p className="font-display text-sm font-semibold text-white sm:text-base">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-white/55">{cat.products_count} products</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="relative bg-white py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Bestsellers</p>
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Featured Products</h2>
              <p className="mt-2 text-slate">Hand-picked picks this season</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? <ProductSkeleton count={4} />
              : featured.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) + 1}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                to="/products"
                className="btn-press group inline-flex items-center gap-2 rounded-2xl bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/15 transition duration-300 hover:bg-blue-600 hover:shadow-blue-600/30"
              >
                Browse All Products
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Promo — fluid full-bleed */}
      <Reveal>
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/90 to-ink/95" />
          <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-amber/15 blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mb-4 inline-flex items-center gap-2 text-amber">
              <Sparkles className="h-4 w-4" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.25em]">Limited Offer</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Free shipping on every order over 100 MAD
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              Plus up to 30% off selected accessories this week.
            </p>
            <Link
              to="/products"
              className="btn-press mt-8 inline-flex rounded-2xl bg-amber px-7 py-3.5 text-sm font-bold text-ink shadow-lg shadow-amber/25 transition duration-300 hover:scale-[1.03] hover:bg-amber-soft"
            >
              Claim Deal
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Why choose — fluid strip, not heavy cards */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Promise</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Why Choose TechStore</h2>
            <p className="mt-2 text-slate">Built around trust, speed, and quality</p>
          </div>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i + 1}>
              <div className="group text-center sm:text-left">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25 transition duration-500 group-hover:scale-110 group-hover:shadow-blue-600/40 sm:mx-0">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-[#060b16] py-20">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Reviews</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">What Customers Say</h2>
              <p className="mt-2 text-white/45">Real reviews from real buyers</p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i + 1}>
                <div className="hover-lift h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:border-blue-500/30 hover:bg-white/[0.07]">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/70">&ldquo;{t.text}&rdquo;</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#060b16] px-6 py-14 sm:px-12">
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-blue-400/15 blur-3xl" />
            <div className="relative mx-auto max-w-xl text-center">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Stay in the loop</h2>
              <p className="mt-2 text-white/50">New drops, exclusive deals, and tech tips — no spam.</p>
              <form onSubmit={subscribe} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/15"
                  required
                />
                <button
                  type="submit"
                  className="btn-press rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:shadow-blue-600/40"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
