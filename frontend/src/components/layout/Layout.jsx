import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import usePageTitle from '../../hooks/usePageTitle'

export default function Layout() {
  const location = useLocation()
  usePageTitle()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
