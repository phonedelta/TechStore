import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Rocket,
  Eye,
  Shield,
  Truck,
  Award,
  Headphones,
  Lightbulb,
  Gem,
  Scale,
  HeartHandshake,
  BadgeCheck,
  TrendingUp,
  Star,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'

const features = [
  {
    icon: Shield,
    title: 'Secure Shopping',
    text: 'Your personal information and payments are protected using industry-standard security.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    text: 'Quick and reliable shipping to ensure your products arrive safely and on time.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    text: 'Every product is carefully selected from trusted manufacturers and verified suppliers.',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    text: 'Our support team is always available to answer your questions and assist with your purchases.',
  },
]

const stats = [
  { label: 'Products Sold', end: 50000, suffix: '+' },
  { label: 'Happy Customers', end: 18000, suffix: '+' },
  { label: 'Orders Delivered', end: 32000, suffix: '+' },
  { label: 'Years of Experience', end: 10, suffix: '+' },
  { label: 'Countries Served', end: 25, suffix: '+' },
  { label: 'Customer Satisfaction', end: 99, suffix: '%' },
]

const team = [
  {
    name: 'James Anderson',
    role: 'CEO & Founder',
    bio: 'Technology enthusiast with more than 15 years of experience in the electronics industry.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80',
  },
  {
    name: 'Sarah Wilson',
    role: 'Operations Manager',
    bio: 'Ensures smooth logistics and efficient order fulfillment.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
  },
  {
    name: 'Michael Brown',
    role: 'Technical Specialist',
    bio: 'Expert in consumer electronics and product quality.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
  },
  {
    name: 'Emma Johnson',
    role: 'Customer Success Manager',
    bio: 'Dedicated to providing exceptional customer support and satisfaction.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
  },
]

const values = [
  { icon: Lightbulb, title: 'Innovation', text: 'We constantly search for the newest technology.' },
  { icon: Gem, title: 'Quality', text: 'Only trusted brands and verified products.' },
  { icon: Scale, title: 'Integrity', text: 'Honest pricing and transparent service.' },
  { icon: HeartHandshake, title: 'Customer First', text: 'Every decision starts with customer satisfaction.' },
  { icon: BadgeCheck, title: 'Reliability', text: 'Fast delivery and dependable support.' },
  { icon: TrendingUp, title: 'Growth', text: 'Always improving our products and services.' },
]

const timeline = [
  { year: '2016', text: 'TechStore was founded.' },
  { year: '2018', text: 'Reached 10,000 customers.' },
  { year: '2020', text: 'Expanded nationwide.' },
  { year: '2022', text: 'Added over 5,000 technology products.' },
  { year: '2024', text: 'Launched international shipping.' },
  { year: '2026', text: 'Serving customers across multiple countries with thousands of successful orders.' },
]

const testimonials = [
  {
    name: 'David Thompson',
    text: 'Excellent service and very fast delivery. My laptop arrived in perfect condition.',
  },
  {
    name: 'Emily Carter',
    text: 'The product quality exceeded my expectations. I highly recommend TechStore.',
  },
  {
    name: 'John Miller',
    text: 'Customer support was incredibly helpful throughout my purchase.',
  },
]

export default function About() {
  return (
    <div className="bg-fog">
      {/* 1. Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-ink">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2400&q=85"
          alt="Modern electronics workspace"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/92 via-[#0f172a]/75 to-[#1e3a8a]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-[#020617]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(37,99,235,0.45),_transparent_55%)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
          <p className="animate-fade-up font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            About TechStore
          </p>
          <p className="animate-fade-up-delay mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
            Your trusted destination for premium electronics, innovative technology, and exceptional customer service.
          </p>
          <div className="animate-fade-up-delay-2 mt-8">
            <Link
              to="/products"
              className="btn-press group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:shadow-xl hover:shadow-blue-600/40"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[20px] shadow-xl shadow-blue-600/10 ring-1 ring-ink/5">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80"
                alt="TechStore showroom"
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Our Journey</p>
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Our Story</h2>
              <p className="mt-5 leading-relaxed text-slate">
                Founded with a passion for technology, TechStore was created to make high-quality electronic products
                accessible to everyone. From smartphones and laptops to computer accessories and smart gadgets, we
                carefully select products that combine innovation, performance, and affordability.
              </p>
              <p className="mt-4 leading-relaxed text-slate">
                Our mission is to simplify online shopping by offering reliable products, competitive prices, and
                outstanding customer support. Every product in our catalog is chosen with quality and customer
                satisfaction in mind.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="hover-lift group h-full rounded-[20px] bg-gradient-to-br from-blue-50 to-white p-8 ring-1 ring-blue-100 sm:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25 transition duration-400 group-hover:scale-110">
                <Rocket className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-slate">
                Our mission is to provide customers with the latest technology products at competitive prices while
                delivering a secure, fast, and enjoyable shopping experience.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="hover-lift group h-full rounded-[20px] bg-gradient-to-br from-slate-50 to-white p-8 ring-1 ring-ink/5 sm:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/20 transition duration-400 group-hover:scale-110 group-hover:bg-blue-600">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-slate">
                We aim to become one of the most trusted online technology stores by continuously improving our
                services, expanding our product catalog, and building lasting relationships with our customers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Why Choose */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Benefits</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Why Choose TechStore</h2>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 4) + 1}>
              <div className="hover-lift group h-full rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-400 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Statistics */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) + 1}>
              <div>
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/70 sm:text-sm">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Team */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">People</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Meet Our Team</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate">
              The experts behind TechStore — passionate about technology and customer success.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) + 1}>
              <div className="hover-lift group overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-ink/5">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-full w-full object-cover duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="font-display text-lg font-bold text-ink">{m.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-blue-600">{m.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{m.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 7. Core Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Principles</p>
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Our Core Values</h2>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 3) + 1}>
                <div className="hover-lift flex h-full gap-4 rounded-[20px] bg-fog p-6 ring-1 ring-ink/5 transition hover:ring-blue-200">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">History</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Our Timeline</h2>
          </div>
        </Reveal>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue-600 via-blue-300 to-blue-100 md:left-1/2 md:-translate-x-px" />
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={(i % 3) + 1}>
                <div
                  className={`relative flex flex-col gap-2 pl-12 md:w-1/2 md:pl-0 ${
                    i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <span className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100 md:left-1/2 md:-translate-x-1/2" />
                  <p className="font-display text-2xl font-bold text-blue-600">{item.year}</p>
                  <p className="text-slate">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">Reviews</p>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">What Customers Say</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i + 1}>
                <div className="hover-lift h-full rounded-[20px] bg-ink-soft p-7 ring-1 ring-white/10">
                  <div className="mb-4 flex gap-1 text-amber">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-white/75">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-5 text-sm font-semibold text-white">— {t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-6 py-14 text-center shadow-2xl shadow-blue-600/25 sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_45%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to Upgrade Your Technology?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
                Explore our collection of premium electronics and discover the latest innovations at unbeatable prices.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/products"
                  className="btn-press inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="btn-press inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
