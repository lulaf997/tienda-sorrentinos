import { STORE_NAME, STORE_TAGLINE } from "../config"
import { useCart } from "../context/CartContext"

export default function Header() {
  const { count, setIsOpen } = useCart()

  return (
    <header>
      <div className="awning-stripes h-3 w-full" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-[var(--ink)] md:text-5xl">
            {STORE_NAME}
          </h1>
          <p className="mt-1 max-w-md text-sm text-[var(--ink)]/70">{STORE_TAGLINE}</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="stamp-btn relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--paper-light)] shadow-[3px_3px_0_var(--ink)]"
          aria-label="Ver carrito"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--stamp)] px-1 font-mono text-xs font-semibold text-[var(--paper-light)]">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
