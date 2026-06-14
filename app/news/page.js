import { connectToDatabase } from "../../lib/mongodb";
import Post from "../../lib/models/Post";
import PostCard from "../../components/PostCard";
import Breadcrumbs from "../../components/Breadcrumbs";

const categoryMetadata = {
  title: "News",
  description: "Latest news and current events - Stay updated with Pracika",
  category: "news",
};

async function getCategoryPosts(category) {
  try {
    await connectToDatabase();
    const posts = await Post.find({
      category: category,
      published: true,
    })
      .select(
        "title slug excerpt featuredImage category author createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: `${categoryMetadata.title} | Pracika`,
    description: categoryMetadata.description,
    openGraph: {
      title: `${categoryMetadata.title} Articles | Pracika`,
      description: categoryMetadata.description,
      type: "website",
    },
  };
}

export default async function NewsPage() {
  const posts = await getCategoryPosts("news");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-4">
          <Breadcrumbs items={[{ label: categoryMetadata.title }]} />
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              No Posts Yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              We're working on bringing you the latest{" "}
              {categoryMetadata.title.toLowerCase()} content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
