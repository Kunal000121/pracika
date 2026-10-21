import Link from "next/link";

export const metadata = {
  title: "Page Not Found - omnicore",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  const categories = [
    { name: "Technology", icon: "💻", href: "/technology" },
    { name: "Business", icon: "💼", href: "/business" },
    { name: "Sports", icon: "⚽", href: "/sports" },
    { name: "Education", icon: "🎓", href: "/education" },
    { name: "Lifestyle", icon: "✨", href: "/lifestyle" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-extrabold text-zinc-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-4">
          The page you're looking for might have been removed, deleted, or is
          temporarily unavailable.
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Don't worry, it happens to the best of us!
        </p>

        {/* Search Suggestions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
              What you can do:
            </h3>
            <ul className="text-left space-y-2 text-zinc-700 dark:text-zinc-300">
              {[
                "Check the URL for any typos",
                "Go back to our homepage",
                "Browse our latest posts",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition-transform transform hover:scale-105"
            >
              🏠 Go to Homepage
            </Link>
          </div>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Popular Categories
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center p-4 bg-white dark:bg-zinc-800 rounded-lg shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
