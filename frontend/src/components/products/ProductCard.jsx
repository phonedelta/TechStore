import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../utils/money'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const hasDiscount = Number(product.discount_percent) > 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock < 1) {
      toast.error('Out of stock')
      return
    }
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group hover-lift flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <img
          src={product.image_url || product.image}
          alt={product.name}
          className="h-full w-full object-cover duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-amber px-2 py-1 text-xs font-bold text-ink shadow-sm transition duration-300 group-hover:scale-105">
            -{Math.round(product.discount_percent)}%
          </span>
        )}
        {product.stock < 1 && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-sm font-semibold text-white backdrop-blur-[2px]">
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-teal transition-colors">
          {product.category?.name}
        </p>
        <h3 className="font-display text-base font-semibold text-ink line-clamp-2 transition-colors duration-300 group-hover:text-teal-dark">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {formatMoney(product.final_price ?? product.price)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-slate line-through">{formatMoney(product.price)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock < 1}
            className="btn-press flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-md shadow-ink/10 transition duration-300 hover:bg-teal hover:shadow-lg hover:shadow-teal/30 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4 transition duration-300 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </Link>
  )
}
