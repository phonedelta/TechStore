import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { formatMoney } from '../../utils/money'

const empty = {
  name: '',
  description: '',
  category_id: '',
  price: '',
  discount_percent: '0',
  stock: '',
  free_shipping: false,
  shipping_cost: '',
  tax_percent: '10',
  is_featured: false,
  is_active: true,
  image_url: '',
}

const fieldClass =
  'w-full rounded-2xl border border-ink/8 bg-[#f7f8fa] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate/45 focus:border-blue-500/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [closing, setClosing] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFiles, setImageFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteClosing, setDeleteClosing] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/admin/products', { params: { search: search || undefined } }),
      api.get('/admin/categories'),
    ])
      .then(([p, c]) => {
        setProducts(p.data.data || [])
        setCategories(c.data)
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!modal) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [modal])

  const openCreate = () => {
    setEditing(null)
    setForm(empty)
    setImageFiles([])
    setClosing(false)
    setModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      category_id: String(p.category_id),
      price: String(p.price),
      discount_percent: String(p.discount_percent),
      stock: String(p.stock),
      free_shipping: Boolean(p.free_shipping),
      shipping_cost: String(p.shipping_cost ?? 0),
      tax_percent: String(p.tax_percent ?? 0),
      is_featured: p.is_featured,
      is_active: p.is_active,
      image_url: '',
    })
    setImageFiles([])
    setClosing(false)
    setModal(true)
  }

  const closeModal = () => {
    setClosing(true)
    setTimeout(() => {
      setModal(false)
      setClosing(false)
    }, 180)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'is_featured' || k === 'is_active' || k === 'free_shipping') {
          fd.append(k, v ? '1' : '0')
        } else if (k === 'shipping_cost') {
          fd.append(k, form.free_shipping ? '0' : (v || '0'))
        } else if (v !== '') {
          fd.append(k, v)
        }
      })
      imageFiles.forEach((file, i) => fd.append(`images[${i}]`, file))

      if (editing) {
        fd.append('_method', 'PUT')
        await api.post(`/admin/products/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Product updated')
      } else {
        await api.post('/admin/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Product created')
      }
      closeModal()
      load()
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {})[0]?.[0]
      toast.error(msg || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const openDelete = (product) => {
    setDeleteClosing(false)
    setDeleteTarget(product)
  }

  const closeDelete = () => {
    setDeleteClosing(true)
    setTimeout(() => {
      setDeleteTarget(null)
      setDeleteClosing(false)
    }, 180)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/admin/products/${deleteTarget.id}`)
      toast.success('Product deleted')
      closeDelete()
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink sm:text-xl">Manage catalog</h2>
          <p className="text-sm text-slate">Add, edit, or remove store products</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-press inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search products..."
          className="flex-1 rounded-2xl border border-ink/8 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
        />
        <button
          type="button"
          onClick={load}
          className="btn-press rounded-2xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/5 text-xs uppercase tracking-wide text-slate">
              <th className="px-4 py-3.5 font-medium">Product</th>
              <th className="px-4 py-3.5 font-medium">Category</th>
              <th className="px-4 py-3.5 font-medium">Price</th>
              <th className="px-4 py-3.5 font-medium">Stock</th>
              <th className="px-4 py-3.5 font-medium">Status</th>
              <th className="px-4 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate">No products</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 transition hover:bg-[#fafbfc]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url || p.image} alt="" className="h-10 w-10 rounded-xl object-cover" />
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">{p.category?.name}</td>
                  <td className="px-4 py-3 font-medium">{formatMoney(p.final_price)}</td>
                  <td className={`px-4 py-3 font-medium ${p.stock <= 10 ? 'text-red-500' : 'text-ink'}`}>{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.is_active ? 'bg-blue-50 text-blue-600' : 'bg-slate/10 text-slate'}`}>
                      {p.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(p)} className="rounded-xl p-2 text-slate transition hover:bg-fog hover:text-ink">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => openDelete(p)} className="rounded-xl p-2 text-red-500 transition hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 ${
            closing ? 'animate-out' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-200 ${
              closing ? 'opacity-0' : 'animate-fade-in'
            }`}
          />

          <div
            className={`relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl shadow-ink/20 sm:rounded-[28px] ${
              closing
                ? 'translate-y-4 opacity-0 transition duration-200 sm:translate-y-2 sm:scale-[0.98]'
                : 'animate-scale-in'
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-ink/5 px-6 py-5">
              <div>
                <h2 id="product-modal-title" className="font-display text-xl font-bold text-ink">
                  {editing ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="mt-0.5 text-sm text-slate">
                  {editing ? 'Update product details' : 'Fill in the details below'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f5f5] text-slate transition hover:bg-[#ebebeb] hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
              <div className="space-y-4 overflow-y-auto px-6 py-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Name</label>
                  <input
                    required
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Short product description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Category</label>
                  <select
                    required
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className={fieldClass}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Price (MAD)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Discount %</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Stock</label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-ink/8 bg-[#f7f8fa] p-4">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={form.free_shipping}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          free_shipping: e.target.checked,
                          shipping_cost: e.target.checked ? '0' : form.shipping_cost,
                        })
                      }
                      className="h-4 w-4 rounded border-ink/20 text-blue-600 focus:ring-blue-500/30"
                    />
                    Free shipping
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">
                        Shipping cost (MAD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required={!form.free_shipping}
                        disabled={form.free_shipping}
                        placeholder="0.00"
                        value={form.free_shipping ? '0' : form.shipping_cost}
                        onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })}
                        className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">
                        Tax %
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="10"
                        value={form.tax_percent}
                        onChange={(e) => setForm({ ...form, tax_percent: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/40" />
                    <input
                      type="url"
                      placeholder="https://... (optional)"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className={`${fieldClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate">
                    Upload images
                  </label>
                  {editing?.gallery_urls?.length > 0 && imageFiles.length === 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {editing.gallery_urls.map((src, i) => (
                        <img
                          key={`${src}-${i}`}
                          src={src}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink/10"
                        />
                      ))}
                      <p className="w-full text-xs text-slate">
                        Current gallery — choose new files to replace them.
                      </p>
                    </div>
                  )}
                  <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/15 bg-[#f7f8fa] px-4 py-6 text-center transition hover:border-blue-500/40 hover:bg-blue-50/40">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-ink/5 transition group-hover:scale-105">
                      <Upload className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-ink">
                      {imageFiles.length > 0
                        ? `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} selected`
                        : 'Click to choose one or more images'}
                    </span>
                    <span className="text-xs text-slate">PNG, JPG — up to 8 images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).slice(0, 8)
                        setImageFiles(files)
                      }}
                    />
                  </label>
                  {imageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {imageFiles.map((file, i) => (
                        <div key={`${file.name}-${i}`} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink/10"
                          />
                          <button
                            type="button"
                            onClick={() => setImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-[#f7f8fa] px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#eef0f3]">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="h-4 w-4 rounded border-ink/20 text-blue-600 focus:ring-blue-500/30"
                    />
                    Featured
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-[#f7f8fa] px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#eef0f3]">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-ink/20 text-blue-600 focus:ring-blue-500/30"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="shrink-0 border-t border-ink/5 bg-white px-6 py-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-press flex-1 rounded-2xl bg-[#f5f5f5] py-3 text-sm font-semibold text-ink transition hover:bg-[#ebebeb]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-press flex-[1.4] rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={closeDelete}
            className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-200 ${
              deleteClosing ? 'opacity-0' : 'animate-fade-in'
            }`}
          />
          <div
            className={`relative z-10 w-full max-w-sm overflow-hidden rounded-[24px] bg-white p-6 shadow-2xl shadow-ink/20 ${
              deleteClosing
                ? 'translate-y-2 scale-[0.98] opacity-0 transition duration-200'
                : 'animate-scale-in'
            }`}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 id="delete-product-title" className="text-center font-display text-xl font-bold text-ink">
              Delete product?
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-ink">{deleteTarget.name}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeDelete}
                disabled={deleting}
                className="btn-press flex-1 rounded-2xl bg-[#f5f5f5] py-3 text-sm font-semibold text-ink transition hover:bg-[#ebebeb] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="btn-press flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
