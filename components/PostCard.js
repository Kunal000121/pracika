import Link from "next/link";
import Image from "next/image";

function getCategoryStyle(category) {
  const styles = {
    tech: "category-tech",
    technology: "category-tech",
    business: "category-business",
    education: "category-education",
    lifestyle: "category-lifestyle",
    trending: "category-trending",
    default: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  };

  return styles[category.toLowerCase()] || styles.default;
}

function getTimeAgo(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "1d ago";
  return postDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post, featured = false }) {
  const categoryStyle = getCategoryStyle(post.category);
  const timeAgo = getTimeAgo(post.createdAt);

  if (featured) {
    return (
      <article className="col-span-full lg:col-span-2 card group animate-fade-in">
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-1/2 h-64 lg:h-auto">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover "
            />
            {post.category.toLowerCase() === "trending" && (
              <div className="absolute top-4 left-4 trending-badge">
                <div className="flex items-center space-x-1">
                  <div className="pulse-dot"></div>
                  <span className="text-xs font-bold">TRENDING</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryStyle}`}
                >
                  {post.category.toUpperCase()}
                </span>
                <div className="flex items-center space-x-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{timeAgo}</span>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  {post.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card group animate-slide-up">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Quick update badge for recent posts */}
        {timeAgo === "Just now" && (
          <div className="absolute top-3 right-3 quick-update-badge">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span>NEW</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyle}`}
          >
            {post.category.toUpperCase()}
          </span>
          <div className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{timeAgo}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.author.charAt(0)}
              </span>
            </div>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              {post.author}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
