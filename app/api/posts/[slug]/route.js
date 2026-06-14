import { connectToDatabase } from "../../../../lib/mongodb";
import Post from "../../../../lib/models/Post";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
} from "../../../../lib/cloudinary";
import { NextResponse } from "next/server";

// Helper function to get category label
function getCategoryLabel(category) {
  const categoryMap = {
    news: "News",
    technology: "Technology",
    business: "Business",
    sports: "Sports",
    education: "Education",
    entertainment: "Entertainment",
    lifestyle: "Lifestyle",
    health: "Health",
    science: "Science",
  };
  return categoryMap[category] || "News";
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // Find the post and increment view count
    const post = await Post.findOneAndUpdate(
      { slug: params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const enrichedPost = {
      ...post.toObject(),
      lastModified: post.updatedAt || post.createdAt,
      breadcrumbs: [
        { name: "Home", url: "/" },
        {
          name: getCategoryLabel(post.category),
          url: `/${post.category}`,
        },
        { name: post.title, url: `/posts/${post.slug}` },
      ],
    };

    return NextResponse.json(enrichedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    // First, find the post to get image URL before deletion
    const post = await Post.findById(params.slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const featuredImageUrl = post.featuredImage;

    // Delete the post from database
    const deletedPost = await Post.findByIdAndDelete(params.slug);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Failed to delete post from database" },
        { status: 500 }
      );
    }

    // Try to delete image from Cloudinary if it exists
    let imageDeleted = false;
    let imageDeleteError = null;

    if (featuredImageUrl && !featuredImageUrl.includes("unsplash.com")) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = extractPublicIdFromUrl(featuredImageUrl);

        if (publicId) {
          console.log(`Attempting to delete Cloudinary image: ${publicId}`);
          imageDeleted = await deleteFromCloudinary(publicId);

          if (imageDeleted) {
            console.log(`Successfully deleted Cloudinary image: ${publicId}`);
          } else {
            console.log(`Image not found in Cloudinary: ${publicId}`);
          }
        } else {
          console.log(
            "Could not extract public_id from URL:",
            featuredImageUrl
          );
        }
      } catch (imageError) {
        console.error("Error deleting image from Cloudinary:", imageError);
        imageDeleteError = imageError.message;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
      details: {
        postId: deletedPost._id,
        title: deletedPost.title,
        imageDeleted,
        imageDeleteError,
        featuredImageUrl,
      },
    });
  } catch (error) {
    console.error("Error deleting post:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to delete post";
    if (error.name === "CastError") {
      errorMessage = "Invalid post ID format";
    } else if (error.code === 11000) {
      errorMessage = "Database constraint error";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
      },
      { status: 500 }
    );
  }
}
