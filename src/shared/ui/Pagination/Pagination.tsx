interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const pageButtonClass = (active: boolean) =>
  [
    'min-w-9 rounded px-3 py-1.5 text-sm font-medium transition-colors',
    active
      ? 'bg-slate-900 text-white'
      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200',
  ].join(' ')

const navButtonClass =
  'rounded border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage])
  for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i)
  }

  return [...pages].sort((a, b) => a - b)
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={navButtonClass}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        Previous
      </button>

      {pages.map((page, index) => {
        const prev = pages[index - 1]
        const showEllipsis = prev !== undefined && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-1 text-slate-400" aria-hidden>
                …
              </span>
            )}
            <button
              type="button"
              className={pageButtonClass(page === currentPage)}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        className={navButtonClass}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  )
}
