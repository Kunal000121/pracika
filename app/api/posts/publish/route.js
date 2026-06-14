import { connectToDatabase } from "../../../../lib/mongodb";
import Post from "../../../../lib/models/Post";
import { extractPublicIdFromUrl } from "../../../../lib/cloudinary";
import { NextResponse } from "next/server";

const generateUniqueSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);

  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${baseSlug}-${dateStr}-${timestamp}`;
};

function truncateMetaDescription(text) {
  if (!text) return "";
  if (text.length <= 160) return text;

  const truncated = text.substring(0, 157);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 140) {
    return text.substring(0, lastSpace) + "...";
  } else {
    return text.substring(0, 157) + "...";
  }
}

export async function POST(request) {
  try {
    const requestBody = await request.json();

    const isDraftData = requestBody.draftData;
    const postData = isDraftData ? requestBody.draftData : requestBody;

    const {
      title,
      content,
      excerpt,
      metaDescription,
      featuredImage,
      category,
      author,
      published = true,
      slug: providedSlug,
      cloudinaryPublicId,
    } = postData;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title and content are required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let slug = providedSlug;
    if (!slug) {
      slug = generateUniqueSlug(title);
    } else {
      let slugCounter = 1;
      let originalSlug = slug;

      while (await Post.findOne({ slug })) {
        slug = `${originalSlug}-${slugCounter}`;
        slugCounter++;
      }
    }

    let finalExcerpt = excerpt;
    if (!finalExcerpt) {
      const sentences = content.split(/[.!?]+/);
      finalExcerpt = sentences[0]
        ? sentences[0].trim() + "."
        : content
            .replace(/<[^>]*>/g, "")
            .substring(0, 200)
            .trim() + "...";
    }

    let finalMetaDescription;
    if (metaDescription) {
      finalMetaDescription = truncateMetaDescription(metaDescription);
    } else if (finalExcerpt) {
      finalMetaDescription = truncateMetaDescription(finalExcerpt);
    } else {
      const sentences = content.split(/[.!?]+/);
      const firstSentence = sentences[0]
        ? sentences[0].trim() + "."
        : content.replace(/<[^>]*>/g, "").substring(0, 150);
      finalMetaDescription = truncateMetaDescription(firstSentence);
    }

    let finalCloudinaryPublicId = cloudinaryPublicId;
    if (!finalCloudinaryPublicId && featuredImage) {
      finalCloudinaryPublicId = extractPublicIdFromUrl(featuredImage);
    }

    const now = new Date();

    const seoMetadata = {
      metaDescription: finalMetaDescription,
      og: {
        title,
        description: finalMetaDescription,
        type: "article",
        image: featuredImage,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: finalMetaDescription,
        image: featuredImage,
      },
      jsonLD: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: finalMetaDescription,
        image: featuredImage,
        author: {
          "@type": "Person",
          name: author || "Pracika Editorial",
        },
        publisher: {
          "@type": "Organization",
          name: "Pracika",
          logo: {
            "@type": "ImageObject",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
          },
        },
        datePublished: now.toISOString(),
        dateModified: now.toISOString(),
        articleSection: category,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${slug}`,
        },
      },
    };

    const finalPostData = {
      title: title.trim(),
      slug,
      content,
      excerpt: finalExcerpt,
      featuredImage:
        featuredImage || `https://source.unsplash.com/1200x630/?${category}`,
      cloudinaryPublicId: finalCloudinaryPublicId,
      category: category || "news",
      author: author || "Pracika Editorial",
      published,
      views: 0,
      createdAt: now,
      updatedAt: now,
      metaDescription: finalMetaDescription,
      seoMetadata,
    };

    const newPost = new Post(finalPostData);
    await newPost.save();

    return NextResponse.json({
      success: true,
      post: {
        ...newPost.toObject(),
        _id: newPost._id.toString(),
      },
      message: published
        ? "Post published successfully with enhanced SEO!"
        : "Post saved as draft!",
      seoData: {
        slug,
        metaDescription: finalMetaDescription,
        aiGeneratedTitle: title,
        cloudinaryPublicId: finalCloudinaryPublicId,
      },
    });
  } catch (error) {
    console.error("Error publishing post:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A post with this title already exists. Please use a different title.",
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationErrors.join(", ")}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to publish post. Please try again.",
      },
      { status: 500 }
    );
  }
}
