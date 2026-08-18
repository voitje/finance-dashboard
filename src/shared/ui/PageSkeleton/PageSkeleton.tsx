export const PageSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-48 rounded-md bg-slate-200" />
        <div className="h-10 w-36 rounded-md bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border border-slate-100 bg-slate-100"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-xl border border-slate-100 bg-slate-100" />
        <div className="h-72 rounded-xl border border-slate-100 bg-slate-100" />
      </div>
    </div>
  )
}

export default PageSkeleton
