import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass =
    delay === 1 ? 'reveal-delay-1' :
    delay === 2 ? 'reveal-delay-2' :
    delay === 3 ? 'reveal-delay-3' :
    delay === 4 ? 'reveal-delay-4' : ''

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  )
}
