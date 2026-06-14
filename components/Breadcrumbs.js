import Link from "next/link";

export default function Breadcrumbs({ items = [], className = "" }) {
  const crumbs = [{ label: "Home", href: "/" }, ...items].filter(
    (item) => item?.label
  );

  return (
    <nav className={className || "mb-4"} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-zinc-400 dark:text-zinc-600">/</span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-zinc-900 dark:text-zinc-100 font-medium"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
