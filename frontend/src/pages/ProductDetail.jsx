import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Heart, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import usePageTitle from '../hooks/usePageTitle'
import { formatMoney } from '../utils/money'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [loading, setLoading] = useState(true)
  usePageTitle(product?.name || 'Product Details')

  useEffect(() => {
    setLoading(true)
    setActiveImage(0)
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const gallery = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.gallery_urls) && product.gallery_urls.length > 0) {
      return product.gallery_urls
    }
    const main = product.image_url || product.image
    return main ? [main] : []
  }, [product])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="skeleton aspect-square rounded-[20px]" />
          </div>
          <div className="space-y-4">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            <div className="skeleton h-28 w-full rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-slate">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const hasDiscount = Number(product.discount_percent) > 0
  const inStock = product.stock > 0

  const handleAdd = () => {
    if (!inStock) {
      toast.error('Out of stock')
      return
    }
    addToCart(product, qty)
    toast.success(`${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    if (!inStock) {
      toast.error('Out of stock')
      return
    }
    addToCart(product, qty)
    navigate('/checkout')
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate">
          <Link to="/" className="transition hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-blue-600">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="transition hover:text-blue-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="font-medium text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <div className="mr-auto flex w-full max-w-[380px] flex-col items-start">
            <div className="relative w-full overflow-hidden rounded-[20px] bg-fog ring-1 ring-ink/5">
              {gallery.length > 0 ? (
                <img
                  key={gallery[activeImage]}
                  src={gallery[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className="animate-fade-in aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-slate">
                  No image available
                </div>
              )}
              {hasDiscount && (
                <span className="absolute left-3 top-3 rounded-xl bg-amber px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
                  -{Math.round(product.discount_percent)}% OFF
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-start gap-2">
                {gallery.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`group h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-fog transition duration-300 ring-2 sm:h-16 sm:w-16 ${
                      activeImage === index
                        ? 'ring-blue-600 shadow-md shadow-blue-600/20'
                        : 'ring-transparent hover:ring-blue-200'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl font-bold text-ink">
                {formatMoney(product.final_price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate line-through">
                  {formatMoney(product.price)}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}
              >
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="mt-5 leading-relaxed text-slate">{product.description}</p>

            <div className="mt-8">
              <p className="mb-2 text-sm font-semibold text-ink">Quantity</p>
              <div className="inline-flex items-center rounded-2xl bg-fog ring-1 ring-ink/10">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-slate transition hover:text-ink"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-slate transition hover:text-ink disabled:opacity-40"
                  disabled={qty >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!inStock}
                className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setWishlist(!wishlist)
                toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist')
              }}
              className={`mt-4 inline-flex items-center gap-2 text-sm font-medium transition ${
                wishlist ? 'text-red-500' : 'text-slate hover:text-blue-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlist ? 'fill-current' : ''}`} />
              {wishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
