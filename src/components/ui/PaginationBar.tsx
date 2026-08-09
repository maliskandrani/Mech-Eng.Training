import Link from "next/link";

export default function PaginationBar({
  page,
  totalPages,
  buildHref,
  prevLabel = "السابق",
  nextLabel = "التالي",
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`rounded-lg border border-border px-3 py-1.5 text-sm transition ${
          page === 1 ? "pointer-events-none opacity-40" : "text-muted hover:border-accent hover:text-accent"
        }`}
      >
        {prevLabel}
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            p === page ? "border-accent bg-accent/10 text-accent-soft" : "border-border text-muted hover:border-accent/60"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`rounded-lg border border-border px-3 py-1.5 text-sm transition ${
          page === totalPages ? "pointer-events-none opacity-40" : "text-muted hover:border-accent hover:text-accent"
        }`}
      >
        {nextLabel}
      </Link>
    </div>
  );
}
