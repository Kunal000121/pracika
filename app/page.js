// app/page.js
import Link from "next/link";
import PostCard from "../components/PostCard";
import { connectToDatabase } from "../lib/mongodb";
import Post from "../lib/models/Post";

// No fixed revalidation - we revalidate on-demand when a post is published
export const revalidate = false;
// But we DO want it to revalidate when triggered, so we use force-dynamic.
export const dynamic = "force-static";

async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ published: true })
      .select(
        "title slug excerpt featuredImage category author createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-zinc-600 dark:text-zinc-300 mb-4">
                No posts yet
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                We're working on fresh content! Check back soon for the latest
                trending updates.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Post Section */}
            {featuredPost && (
              <div className="mb-12">
                <div className="flex items-center space-x-2 mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Featured Story
                  </h2>
                </div>
                <PostCard post={featuredPost} featured={true} />
              </div>
            )}

            {/* Latest Updates Section */}
            {regularPosts.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Latest Updates
                    </h2>
                    <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>{regularPosts.length} New</span>
                    </div>
                  </div>

                  <Link
                    href="/trending"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1 transition-colors"
                  >
                    <span>View All</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <div
                      key={post._id}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
