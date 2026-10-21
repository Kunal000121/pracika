"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/AdminLayout";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, post: null });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Category metadata
  const getCategoryMetadata = (category) => {
    const categoryMap = {
      news: {
        label: "News",
        icon: "📰",
        color: "bg-zinc-100 text-zinc-800 border-zinc-300",
      },
      technology: {
        label: "Technology",
        icon: "💻",
        color: "bg-blue-100 text-blue-800 border-blue-300",
      },
      business: {
        label: "Business",
        icon: "💼",
        color: "bg-purple-100 text-purple-800 border-purple-300",
      },
      sports: {
        label: "Sports",
        icon: "⚽",
        color: "bg-green-100 text-green-800 border-green-300",
      },
      education: {
        label: "Education",
        icon: "🎓",
        color: "bg-amber-100 text-amber-800 border-amber-300",
      },
      entertainment: {
        label: "Entertainment",
        icon: "🎬",
        color: "bg-pink-100 text-pink-800 border-pink-300",
      },
      lifestyle: {
        label: "Lifestyle",
        icon: "✨",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      health: {
        label: "Health",
        icon: "🏥",
        color: "bg-red-100 text-red-800 border-red-300",
      },
      science: {
        label: "Science",
        icon: "🔬",
        color: "bg-indigo-100 text-indigo-800 border-indigo-300",
      },
    };

    return categoryMap[category] || categoryMap.news;
  };

  // Format date function
  const formatDate = (date, format = "short") => {
    const dateObj = new Date(date);

    switch (format) {
      case "short":
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
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
      default:
        return dateObj.toLocaleDateString();
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts?includeUnpublished=true");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      // Handle both array response and object with posts array
      const postsArray = Array.isArray(data) ? data : data.posts || [];
      setPosts(postsArray);
    } catch (err) {
      setError(err.message || "Failed to load posts");
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (post) => {
    setDeleteModal({ show: true, post });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, post: null });
  };

  const deletePost = async () => {
    const post = deleteModal.post;
    if (!post) return;

    try {
      setDeleteLoading(post._id);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      const result = await response.json();

      // Remove post from local state
      setPosts(posts.filter((p) => p._id !== post._id));

      // Show success notification with details
      let message = `Post "${post.title}" deleted successfully!`;
      if (result.details?.imageDeleted) {
        message += " Image also removed from storage.";
      } else if (result.details?.imageDeleteError) {
        message += " (Note: Image could not be removed from storage)";
      }

      showNotification(message, "success");
      closeDeleteModal();
    } catch (err) {
      console.error("Delete error:", err);
      showNotification(err.message || "Failed to delete post", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const togglePublishStatus = async (post) => {
    try {
      const response = await fetch(`/api/posts/${post._id}/toggle-publish`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      // Update post in local state
      setPosts(
        posts.map((p) =>
          p._id === post._id ? { ...p, published: !p.published } : p
        )
      );

      showNotification(
        `Post ${
          !post.published ? "published" : "moved to drafts"
        } successfully!`,
        "success"
      );
    } catch (err) {
      showNotification(err.message || "Failed to update post status", "error");
    }
  };

  // Filter and search posts
  const filteredPosts = posts.filter((post) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && post.published) ||
      (filter === "draft" && !post.published) ||
      filter === post.category;

    const matchesSearch =
      !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const categories = [
    "news",
    "technology",
    "business",
    "sports",
    "education",
    "entertainment",
    "lifestyle",
    "health",
    "science",
  ];

  // Calculate stats
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;
  const categoriesCount = new Set(posts.map((p) => p.category)).size;

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-zinc-600">Loading posts...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300 p-6">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {notification.type === "success" ? "✅" : "❌"}
              </span>
              <p className="text-sm font-medium">{notification.message}</p>
              <button
                onClick={() =>
                  setNotification({ show: false, message: "", type: "" })
                }
                className="ml-2 text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Delete Post
                  </h3>
                  <p className="text-sm text-zinc-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-zinc-700 mb-2">
                  Are you sure you want to delete this post?
                </p>
                <div className="bg-zinc-50 rounded-lg p-3">
                  <p className="font-medium text-zinc-900">
                    {deleteModal.post?.title}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {getCategoryMetadata(deleteModal.post?.category)?.label} •{" "}
                    {formatDate(deleteModal.post?.createdAt)}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  * The associated image will also be removed from storage if
                  hosted on our servers.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deletePost}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>🗑️ Delete Post</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold ">All Posts</h1>
              <p className="text-zinc-100 mt-1">
                Manage your published and draft posts
              </p>
            </div>
            <Link
              href="/kbh/create"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">✍️</span>
              Create New Post
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts by title, content, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-rose-950"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-zinc-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-rose-950"
              >
                <option value="all">All Posts ({posts.length})</option>
                <option value="published">Published ({publishedCount})</option>
                <option value="draft">Drafts ({draftCount})</option>
                <optgroup label="Categories">
                  {categories.map((category) => {
                    const count = posts.filter(
                      (p) => p.category === category
                    ).length;
                    const meta = getCategoryMetadata(category);
                    return (
                      <option key={category} value={category}>
                        {meta.icon} {meta.label} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>

            {/* Clear Filters */}
            {(filter !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-3 text-zinc-900 hover:text-zinc-800 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-600">Total Posts</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {posts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-600">Published</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {publishedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-600">Drafts</p>
                <p className="text-2xl font-bold text-zinc-900">{draftCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-600">Categories</p>
                <p className="text-2xl font-bold text-zinc-900">
                  {categoriesCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <div>
                <p className="font-medium">Error loading posts</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchPosts}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-100 rounded-full flex items-center justify-center">
              <span className="text-zinc-400 text-4xl">
                {posts.length === 0 ? "📝" : "🔍"}
              </span>
            </div>
            <h3 className="text-xl font-medium text-zinc-900 mb-2">
              {posts.length === 0 ? "No posts yet" : "No posts found"}
            </h3>
            <p className="text-zinc-600 mb-6 max-w-md mx-auto">
              {posts.length === 0
                ? "Get started by creating your first AI-powered post!"
                : "Try adjusting your search criteria or filters to find what you're looking for."}
            </p>
            {posts.length === 0 && (
              <Link
                href="/kbh/create"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span className="mr-2">✍️</span>
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-zinc-600">
                Showing {filteredPosts.length} of {posts.length} posts
                {filter !== "all" && ` in ${filter}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => {
                const categoryMeta = getCategoryMetadata(post.category);
                return (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48">
                      <Image
                        src={post.featuredImage || "/placeholder-image.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryMeta.color}`}
                        >
                          <span className="mr-1">{categoryMeta.icon}</span>
                          {categoryMeta.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300"
                          }`}
                        >
                          {post.published ? "✅ Published" : "📝 Draft"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-zinc-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/posts/${post.slug}`} target="_blank">
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-zinc-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt || "No excerpt available"}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 pb-4 border-b border-zinc-100">
                        <div className="flex items-center space-x-3">
                          <span>👤 {post.author || "Unknown"}</span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            target="_blank"
                          >
                            👁️ View
                          </Link>
                          <button
                            onClick={() => togglePublishStatus(post)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                          >
                            {post.published ? "📤 Unpublish" : "📤 Publish"}
                          </button>
                        </div>

                        <button
                          onClick={() => openDeleteModal(post)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex items-center"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
