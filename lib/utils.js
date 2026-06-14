import slugify from "slugify";

// Generate SEO-friendly slug from title
export function generateSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

// Format date in various formats
export function formatDate(date, format = "long") {
  const dateObj = new Date(date);

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "medium":
      return dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    default:
      return dateObj.toLocaleDateString();
  }
}

// Truncate text to specified length
export function truncateText(text, maxLength = 160) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// Extract plain text from HTML content
export function extractTextFromHTML(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

// Generate excerpt from content
export function generateExcerpt(content, maxLength = 200) {
  const plainText = extractTextFromHTML(content);
  return truncateText(plainText, maxLength);
}

// Validate image file
export function validateImage(file) {
  const errors = [];

  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
    );
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push("File size too large. Maximum 5MB allowed.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize filename for uploads
export function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate unique filename with timestamp
export function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(originalName);
  const extension = sanitized.split(".").pop();
  const nameWithoutExt = sanitized.replace(`.${extension}`, "");

  return `${nameWithoutExt}-${timestamp}.${extension}`;
}

// Clean and validate post data
export function validatePostData(data) {
  const errors = [];
  const cleaned = { ...data };

  // Required fields
  if (!cleaned.title?.trim()) {
    errors.push("Title is required");
  } else {
    cleaned.title = cleaned.title.trim();
  }

  if (!cleaned.content?.trim()) {
    errors.push("Content is required");
  } else if (cleaned.content.length < 100) {
    errors.push("Content must be at least 100 characters long");
  }

  if (!cleaned.featuredImage?.trim()) {
    errors.push("Featured image is required");
  }

  // Optional fields with defaults
  cleaned.category = cleaned.category || "news";
  cleaned.author = cleaned.author?.trim() || "Pracika Admin";
  cleaned.published = Boolean(cleaned.published);

  // Generate slug if not provided
  if (!cleaned.slug && cleaned.title) {
    cleaned.slug = generateSlug(cleaned.title);
  }

  // Generate excerpt if not provided
  if (!cleaned.excerpt && cleaned.content) {
    cleaned.excerpt = generateExcerpt(cleaned.content);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: cleaned,
  };
}

// Get category metadata
export function getCategoryMetadata(category) {
  const categoryMap = {
    news: {
      label: "News",
      icon: "📰",
      color: "bg-zinc-100 text-zinc-800 border-zinc-300",
      description: "Current interest topics and current events",
    },
    technology: {
      label: "Technology",
      icon: "💻",
      color: "bg-blue-100 text-blue-800 border-blue-300",
      description: "Tech trends, gadgets, and digital innovation",
    },
    business: {
      label: "Business",
      icon: "💼",
      color: "bg-purple-100 text-purple-800 border-purple-300",
      description: "Business strategies, finance, and entrepreneurship",
    },
    sports: {
      label: "Sports",
      icon: "⚽",
      color: "bg-green-100 text-green-800 border-green-300",
      description: "Sports events, fitness, and athletic achievements",
    },
    education: {
      label: "Education",
      icon: "🎓",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Education news, exams, learning guides, and student updates",
    },
    entertainment: {
      label: "Entertainment",
      icon: "🎬",
      color: "bg-pink-100 text-pink-800 border-pink-300",
      description: "Movies, music, celebrity news, and pop culture",
    },
    lifestyle: {
      label: "Lifestyle",
      icon: "✨",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      description: "Lifestyle tips, wellness, fashion, and travel",
    },
    health: {
      label: "Health",
      icon: "🏥",
      color: "bg-red-100 text-red-800 border-red-300",
      description: "Health tips, medical insights, and wellness",
    },
    science: {
      label: "Science",
      icon: "🔬",
      color: "bg-indigo-100 text-indigo-800 border-indigo-300",
      description: "Scientific discoveries, research, and innovation",
    },
  };

  return categoryMap[category] || categoryMap.news;
}

// Generate SEO metadata for posts
export function generateSEOMetadata(post) {
  const categoryMeta = getCategoryMetadata(post.category);

  return {
    title: `${post.title} | Pracika`,
    description: post.excerpt || post.metaDescription,
    author: post.author,
    canonical: `/posts/${post.slug}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      type: "article",
      url: `/posts/${post.slug}`,
      siteName: "Pracika",
      publishedTime: post.publishedAt || post.createdAt,
      author: post.author,
      section: categoryMeta.label,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      image: post.featuredImage,
    },
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Pracika",
      },
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}`,
      },
      articleSection: categoryMeta.label,
    },
  };
}

// URL and path utilities
export function getAbsoluteURL(path) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseURL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
