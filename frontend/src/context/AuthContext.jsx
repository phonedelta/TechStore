import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techstore_user'))
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('techstore_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('techstore_token'))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/me')
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('techstore_user', JSON.stringify(res.data))
      })
      .catch(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('techstore_token')
        localStorage.removeItem('techstore_user')
      })
      .finally(() => setLoading(false))
  }, [token])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login: async (email, password) => {
        const { data } = await api.post('/login', { email, password })
        localStorage.setItem('techstore_token', data.token)
        localStorage.setItem('techstore_user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return data
      },
      logout: async () => {
        try {
          await api.post('/logout')
        } catch {
          /* ignore */
        }
        localStorage.removeItem('techstore_token')
        localStorage.removeItem('techstore_user')
        setToken(null)
        setUser(null)
      },
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
