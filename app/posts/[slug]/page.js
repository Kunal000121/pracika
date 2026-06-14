import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { connectToDatabase } from "../../../lib/mongodb";
import Post from "../../../lib/models/Post";
import ShareButtons from "../../../components/ShareButtons";
import PostContent from "../../../components/PostContent";
import Breadcrumbs from "../../../components/Breadcrumbs";

export const revalidate = false;

async function getPost(slug) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ published: true }).select("slug").lean();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: "Post Not Found | Pracika",
      description: "The requested post could not be found.",
    };
  }
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://Pracika.com";
  const postURL = `${baseURL}/posts/${post.slug}`;
  return {
    title: `${post.title} | Pracika`,
    description: post.metaDescription || post.excerpt,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: "Pracika",
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(baseURL),
    alternates: { canonical: postURL },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      url: postURL,
      siteName: "Pracika",
      images: [
        { url: post.featuredImage, width: 1200, height: 630, alt: post.title },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      creator: "@Pracika",
      site: "@Pracika",
      images: [{ url: post.featuredImage, alt: post.title }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function getCategoryMetadata(category) {
  const categoryMap = {
    news: {
      label: "News",
      icon: "📰",
      color:
        "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
    },
    technology: {
      label: "Technology",
      icon: "💻",
      color:
        "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
    },
    business: {
      label: "Business",
      icon: "💼",
      color:
        "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800",
    },
    sports: {
      label: "Sports",
      icon: "⚽",
      color:
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
    },
    education: {
      label: "Education",
      icon: "🎓",
      color:
        "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800",
    },
    entertainment: {
      label: "Entertainment",
      icon: "🎬",
      color:
        "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:hover:bg-pink-800",
    },
    lifestyle: {
      label: "Lifestyle",
      icon: "✨",
      color:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800",
    },
    health: {
      label: "Health",
      icon: "🏥",
      color:
        "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800",
    },
    science: {
      label: "Science",
      icon: "🔬",
      color:
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800",
    },
  };
  return categoryMap[category] || categoryMap.news;
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) return redirect(`/posts/${params.slug}/not-found`);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://Pracika.com";
  const postURL = `${baseURL}/posts/${post.slug}`;
  const categoryMeta = getCategoryMetadata(post.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postURL}#article`,
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        image: {
          "@type": "ImageObject",
          url: post.featuredImage,
          width: 1200,
          height: 630,
        },
        author: { "@type": "Person", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "Pracika",
          logo: { "@type": "ImageObject", url: `${baseURL}/logo.png` },
        },
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": postURL },
        url: postURL,
        articleSection: categoryMeta.label,
        genre: categoryMeta.label,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        copyrightYear: new Date(post.createdAt).getFullYear(),
        copyrightHolder: { "@type": "Organization", name: "Pracika" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300">
        <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              items={[
                { label: categoryMeta.label, href: `/${post.category}` },
                { label: "Article" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${categoryMeta.color}`}
              >
                {categoryMeta.icon} {categoryMeta.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-6">
              {post.title}
            </h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="prose prose-base md:prose-lg max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-code:text-zinc-900 dark:prose-code:text-zinc-100 prose-pre:bg-zinc-800 dark:prose-pre:bg-zinc-900">
                <PostContent content={post.content} />
              </div>
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-center">
                    Found this helpful? Share it with others!
                  </h3>
                  <ShareButtons url={postURL} title={post.title} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
              <div className="sticky top-8">
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                <div className="mt-6 hidden md:block">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 text-white p-6">
                      <h3 className="text-lg font-bold mb-2">
                        Article Information
                      </h3>
                      <p className="text-zinc-300 dark:text-zinc-400 text-sm">
                        Everything you need to know about this post
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300 text-sm">
                            Category
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${categoryMeta.color.replace("hover:", "")}`}
                          >
                            {categoryMeta.icon} {categoryMeta.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300 text-sm">
                            Published
                          </span>
                          <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
