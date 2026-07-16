import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import Reveal from '../components/Reveal'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .get('/products', {
        params: {
          search: search || undefined,
          category: category || undefined,
          sort,
          page,
          per_page: 12,
        },
      })
      .then((res) => {
        setProducts(res.data.data || [])
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        })
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [search, category, sort, page])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const activeCategoryName = categories.find((c) => c.slug === category)?.name

  return (
    <div className="min-h-screen overflow-hidden bg-fog">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute -left-40 top-40 h-80 w-80 rounded-full bg-blue-500/8 blur-3xl" />

        <Reveal>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {activeCategoryName || 'Shop'}
            </h1>
            <p className="mt-1.5 text-sm text-slate">
              {meta
                ? `${meta.total} product${meta.total === 1 ? '' : 's'} available`
                : 'Browse our electronics catalog'}
            </p>
          </div>
        </Reveal>

        {/* Toolbar */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/60" />
              <input
                defaultValue={search}
                key={search}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateParam('search', e.target.value.trim())
                }}
                placeholder="Search products..."
                className="w-full rounded-2xl border border-ink/8 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate/50 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-2xl border border-ink/8 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="btn-press inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-md shadow-ink/10 transition hover:bg-blue-600 lg:hidden"
            >
              {filtersOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              Filters
            </button>
          </div>
        </Reveal>

        {/* Active filter chip */}
        {(category || search) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {category && (
              <button
                type="button"
                onClick={() => updateParam('category', '')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-600/15"
              >
                {activeCategoryName || category}
                <X className="h-3 w-3" />
              </button>
            )}
            {search && (
              <button
                type="button"
                onClick={() => updateParam('search', '')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink/5 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-ink/10"
              >
                “{search}”
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside
            className={`${filtersOpen ? 'block' : 'hidden'} w-full shrink-0 lg:block lg:w-60`}
          >
            <Reveal>
              <div className="sticky top-24 overflow-hidden rounded-[24px] border border-ink/5 bg-white p-6 shadow-lg shadow-blue-600/5">
                <h3 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        updateParam('category', '')
                        setFiltersOpen(false)
                      }}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition duration-300 ${
                        !category
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 font-semibold text-white shadow-md shadow-blue-600/20'
                          : 'text-slate hover:bg-fog hover:text-ink'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          updateParam('category', c.slug)
                          setFiltersOpen(false)
                        }}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition duration-300 ${
                          category === c.slug
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 font-semibold text-white shadow-md shadow-blue-600/20'
                            : 'text-slate hover:bg-fog hover:text-ink'
                        }`}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>

          {/* Grid */}
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <ProductSkeleton count={6} />
              ) : products.length === 0 ? (
                <div className="col-span-full rounded-[24px] border border-ink/5 bg-white py-20 text-center">
                  <p className="font-display text-lg font-semibold text-ink">No products found</p>
                  <p className="mt-2 text-sm text-slate">Try a different search or filter.</p>
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="btn-press mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                products.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) + 1}>
                    <ProductCard product={p} />
                  </Reveal>
                ))
              )}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                  className="btn-press inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/8 bg-white text-ink transition hover:border-blue-500/30 hover:bg-blue-50 disabled:opacity-35"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[7rem] text-center text-sm font-medium text-slate">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.last_page}
                  onClick={() => updateParam('page', String(page + 1))}
                  className="btn-press inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/8 bg-white text-ink transition hover:border-blue-500/30 hover:bg-blue-50 disabled:opacity-35"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
