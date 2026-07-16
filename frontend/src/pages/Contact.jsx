import { useState } from 'react'
import { Mail, Phone, Clock, MapPin, Send, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Reveal from '../components/Reveal'

const initial = { name: '', email: '', subject: '', message: '' }

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@techstore.com',
    href: 'mailto:support@techstore.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (234) 567-8900',
    href: 'tel:+12345678900',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Fri 9am–6pm EST',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Technology Avenue, Innovation City',
  },
]

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    const eMap = {}
    if (!form.name.trim()) eMap.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) eMap.email = 'Valid email required'
    if (form.message.trim().length < 10) eMap.message = 'At least 10 characters'
    setErrors(eMap)
    if (Object.keys(eMap).length) return

    setSending(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent successfully!')
      setForm(initial)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const fieldClass =
    'w-full rounded-2xl border border-ink/8 bg-fog/80 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate/50 focus:border-blue-500/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10'

  return (
    <div className="overflow-hidden bg-fog">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=85"
          alt="Modern office workspace"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/93 via-[#0f172a]/78 to-[#1e3a8a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-[#020617]/35" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <p className="animate-fade-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Let&apos;s Talk
          </p>
          <h1 className="animate-fade-up-delay mt-5 font-display text-2xl font-semibold text-white/90 sm:text-3xl md:text-4xl">
            Get in Touch With Our Team
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base text-white/60 sm:text-lg">
            Whether you need product advice, order support, or a business partnership — our specialists are ready to assist you.
          </p>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <form
              onSubmit={submit}
              className="relative overflow-hidden rounded-[28px] border border-ink/5 bg-white p-6 shadow-xl shadow-blue-600/5 sm:p-10"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl" />
              <div className="relative">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Message</p>
                <h2 className="font-display text-2xl font-bold text-ink">Send us a note</h2>
                <p className="mt-1.5 text-sm text-slate">We usually reply within one business day.</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Your name"
                      className={fieldClass}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="you@email.com"
                      className={fieldClass}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-1.5 block text-sm font-medium text-ink">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    placeholder="How can we help?"
                    className={fieldClass}
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Tell us more..."
                    className={`${fieldClass} resize-none`}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-press mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:shadow-blue-600/40 disabled:opacity-60 sm:w-auto sm:px-10"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                  {!sending && <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </Reveal>

          {/* Info + map */}
          <div className="space-y-8 lg:col-span-5">
            <Reveal delay={1}>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Reach us</p>
                <h2 className="font-display text-2xl font-bold text-ink">Get in touch</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  Prefer email or a quick call? Use any channel below — our team is ready.
                </p>
              </div>
            </Reveal>

            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href }, i) => {
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20 transition duration-300 group-hover:scale-105">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate/70">{label}</p>
                      <p className="mt-0.5 break-words text-sm font-semibold text-ink">{value}</p>
                    </div>
                    {href && (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate/40 opacity-0 transition group-hover:opacity-100" />
                    )}
                  </>
                )

                const className =
                  'group flex items-center gap-4 rounded-2xl border border-ink/5 bg-white/80 px-4 py-4 backdrop-blur-sm transition duration-300 hover:border-blue-500/20 hover:bg-white hover:shadow-lg hover:shadow-blue-600/5'

                return (
                  <Reveal key={label} delay={Math.min(i + 1, 4)}>
                    {href ? (
                      <a href={href} className={className}>
                        {content}
                      </a>
                    ) : (
                      <div className={className}>{content}</div>
                    )}
                  </Reveal>
                )
              })}
            </div>

            <Reveal delay={2}>
              <div className="overflow-hidden rounded-[24px] border border-ink/5 bg-white shadow-lg shadow-blue-600/5">
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-mist to-fog sm:h-64">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.12),_transparent_70%)]" />
                  <div className="relative text-center px-6">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <p className="font-display text-sm font-semibold text-ink">Visit our hub</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate">
                      123 Technology Avenue
                      <br />
                      Innovation City
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
