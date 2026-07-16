import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/': 'Home',
  '/products': 'Products',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/admin/login': 'Admin Login',
  '/admin': 'Dashboard',
  '/admin/products': 'Manage Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/messages': 'Messages',
}

export default function usePageTitle(customTitle) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (customTitle) {
      document.title = `TechStore | ${customTitle}`
      return
    }

    // Dynamic pages set their own title
    if (
      (pathname.startsWith('/products/') && pathname !== '/products') ||
      pathname.startsWith('/order-success/')
    ) {
      return
    }

    const pageName = titles[pathname] || 'Shop'
    document.title = `TechStore | ${pageName}`
  }, [pathname, customTitle])
}
