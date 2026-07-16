import { useEffect, useState } from 'react'
import { Eye, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/admin/contact')
      .then((res) => setMessages(res.data.data || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const view = async (id) => {
    try {
      const { data } = await api.get(`/admin/contact/${id}`)
      setSelected(data)
      load()
    } catch {
      toast.error('Failed to open message')
    }
  }

  const markRead = async (id) => {
    try {
      await api.put(`/admin/contact/${id}/read`)
      toast.success('Marked as read')
      load()
    } catch {
      toast.error('Failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await api.delete(`/admin/contact/${id}`)
      toast.success('Deleted')
      setSelected(null)
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">Contact Messages</h1>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/5">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/5 text-xs uppercase text-slate">
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate">Loading...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate">No messages</td></tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} className={`border-b border-ink/5 ${!m.is_read ? 'bg-teal/5' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-slate">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{m.subject || '—'}</td>
                  <td className="px-4 py-3 text-slate">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.is_read ? 'bg-slate/10 text-slate' : 'bg-teal/10 text-teal'}`}>
                      {m.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => view(m.id)} className="rounded-lg p-2 hover:bg-fog"><Eye className="h-4 w-4" /></button>
                      {!m.is_read && (
                        <button type="button" onClick={() => markRead(m.id)} className="rounded-lg p-2 hover:bg-fog"><Check className="h-4 w-4 text-teal" /></button>
                      )}
                      <button type="button" onClick={() => remove(m.id)} className="rounded-lg p-2 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex justify-between">
              <h2 className="font-display font-bold">Message</h2>
              <button type="button" onClick={() => setSelected(null)}><X /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">From:</span> {selected.name} ({selected.email})</p>
              <p><span className="font-medium">Subject:</span> {selected.subject || '—'}</p>
              <p><span className="font-medium">Date:</span> {new Date(selected.created_at).toLocaleString()}</p>
              <p className="mt-3 rounded-xl bg-fog p-4 leading-relaxed text-slate">{selected.message}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(selected.id)}
              className="mt-4 w-full rounded-xl bg-red-500 py-2 text-sm font-semibold text-white"
            >
              Delete Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
