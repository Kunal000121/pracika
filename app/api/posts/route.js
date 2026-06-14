// app/api/posts/route.js
import { connectToDatabase } from "../../../lib/mongodb";
import Post from "../../../lib/models/Post";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectToDatabase();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Build query
    const query = {};

    // Filter by published status
    if (!includeUnpublished) {
      query.published = true;
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { excerpt: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const posts = await Post.find(query)
      .select(
        includeUnpublished
          ? "title slug excerpt featuredImage category author createdAt updatedAt published views metaDescription"
          : "title slug excerpt featuredImage category author createdAt"
      )
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Return with pagination metadata if requested
    if (searchParams.get("includePagination") === "true") {
      return NextResponse.json({
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
        query: {
          includeUnpublished,
          category: category || "all",
          search: search || "",
          sortBy,
          sortOrder: sortOrder === 1 ? "asc" : "desc",
        },
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // This endpoint would typically require authentication
    // For now, we'll redirect to the publish endpoint
    return NextResponse.json(
      {
        error: "Use /api/posts/publish endpoint for creating posts",
        redirect: "/api/posts/publish",
      },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
