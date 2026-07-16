import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = {
  items: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload }
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: Math.min(i.quantity + (action.payload.quantity || 1), i.stock) }
              : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: action.payload.id,
            name: action.payload.name,
            image_url: action.payload.image_url,
            price: action.payload.final_price ?? action.payload.price,
            stock: action.payload.stock,
            quantity: action.payload.quantity || 1,
            free_shipping: Boolean(action.payload.free_shipping),
            shipping_cost: Number(action.payload.shipping_cost) || 0,
            tax_percent: Number(action.payload.tax_percent) || 0,
          },
        ],
      }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.payload) }
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, i.stock)) }
            : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('techstore_cart')
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('techstore_cart', JSON.stringify(state.items))
  }, [state.items])

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = state.items.reduce((sum, i) => {
      if (i.free_shipping) return sum
      return sum + (Number(i.shipping_cost) || 0) * i.quantity
    }, 0)
    const tax = state.items.reduce((sum, i) => {
      const line = i.price * i.quantity
      return sum + line * ((Number(i.tax_percent) || 0) / 100)
    }, 0)
    const total = Math.round((subtotal + shipping + tax) * 100) / 100
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

    const uniqueTaxRates = [
      ...new Set(state.items.map((i) => Number(i.tax_percent) || 0)),
    ]
    const taxPercent =
      uniqueTaxRates.length === 1
        ? uniqueTaxRates[0]
        : subtotal > 0
          ? Math.round((tax / subtotal) * 1000) / 10
          : 0

    return {
      items: state.items,
      count,
      subtotal,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      taxPercent,
      total,
      addToCart: (product, quantity = 1) =>
        dispatch({ type: 'ADD', payload: { ...product, quantity } }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', payload: id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
