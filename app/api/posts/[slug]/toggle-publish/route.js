// app/api/posts/[slug]/toggle-publish/route.js
import { connectToDatabase } from "../../../../../lib/mongodb";
import Post from "../../../../../lib/models/Post";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();

    // Find the post by ID (slug parameter is actually the ID in this case)
    const post = await Post.findById(params.slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Toggle published status
    const newPublishedStatus = !post.published;

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      params.slug,
      {
        published: newPublishedStatus,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Post ${
        newPublishedStatus ? "published" : "unpublished"
      } successfully`,
      post: {
        _id: updatedPost._id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        published: updatedPost.published,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);

    let errorMessage = "Failed to update post status";
    if (error.name === "CastError") {
      errorMessage = "Invalid post ID format";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
