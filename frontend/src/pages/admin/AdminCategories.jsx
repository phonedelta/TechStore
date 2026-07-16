import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', is_active: true })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get('/admin/categories')
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/admin/categories/${editing.id}`, form)
        toast.success('Category updated')
      } else {
        await api.post('/admin/categories', form)
        toast.success('Category created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      toast.success('Deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Categories</h1>
        <button
          type="button"
          onClick={() => { setEditing(null); setForm({ name: '', description: '', is_active: true }); setModal(true) }}
          className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/5 text-xs uppercase text-slate">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate">Loading...</td></tr>
            ) : categories.map((c) => (
              <tr key={c.id} className="border-b border-ink/5">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-slate">{c.products_count}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? 'bg-teal/10 text-teal' : 'bg-slate/10 text-slate'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '', is_active: c.is_active }); setModal(true) }} className="rounded-lg p-2 hover:bg-fog">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(c.id)} className="rounded-lg p-2 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex justify-between">
              <h2 className="font-display font-bold">{editing ? 'Edit' : 'Add'} Category</h2>
              <button type="button" onClick={() => setModal(false)}><X /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full rounded-xl bg-fog px-3 py-2 text-sm ring-1 ring-ink/10 outline-none" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-xl bg-fog px-3 py-2 text-sm ring-1 ring-ink/10 outline-none" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
              </label>
              <button type="submit" disabled={saving} className="w-full rounded-xl bg-teal py-2.5 text-sm font-semibold text-white">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
