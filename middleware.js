// middleware.js (in your root directory)
import { NextResponse } from "next/server";

// List of deleted posts that should redirect to specific pages
// You can maintain this list when you delete popular posts
const DELETED_POST_REDIRECTS = {
  // Example: 'old-post-slug': '/new-post-slug',
  // 'deleted-tech-article': '/technology',
  // 'removed-business-post': '/business',
};

// Common patterns for deleted posts to redirect to categories
const CATEGORY_REDIRECTS = {
  tech: "/technology",
  business: "/business",
  sports: "/sports",
  health: "/health",
  lifestyle: "/lifestyle",
  entertainment: "/entertainment",
  science: "/science",
  news: "/news",
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only handle post URLs
  if (pathname.startsWith("/posts/")) {
    const slug = pathname.replace("/posts/", "");

    // Check for specific redirect mappings
    if (DELETED_POST_REDIRECTS[slug]) {
      return NextResponse.redirect(
        new URL(DELETED_POST_REDIRECTS[slug], request.url)
      );
    }

    // Smart category-based redirects
    // Check if the slug contains category keywords
    for (const [keyword, categoryPath] of Object.entries(CATEGORY_REDIRECTS)) {
      if (slug.toLowerCase().includes(keyword)) {
        const url = new URL(categoryPath, request.url);
        // Add a query parameter to show a notification
        url.searchParams.set("from", "deleted-post");
        url.searchParams.set("original", slug);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
