export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
          <div className="skeleton aspect-[4/3]" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton mt-4 h-6 w-24 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}
