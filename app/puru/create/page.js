"use client";

import { useState } from "react";
import Image from "next/image";
import AdminLayout from "../../../components/AdminLayout";

export default function CreatePostPage() {
  const [headline, setHeadline] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [category, setCategory] = useState("news");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [summary, setSummary] = useState("");
  const [bulletPoints, setBulletPoints] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
    { id: 3, text: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "news", label: "News", icon: "📰" },
    { value: "technology", label: "Technology", icon: "💻" },
    { value: "business", label: "Business", icon: "💼" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "lifestyle", label: "Lifestyle", icon: "✨" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "science", label: "Science", icon: "🔬" },
  ];

  const generateSlug = (text) => {
    const base = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 60);
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `${base}-${dateStr}-${timestamp}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const addBulletPoint = () => {
    setBulletPoints((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const removeBulletPoint = (id) => {
    if (bulletPoints.length <= 1) return;
    setBulletPoints((prev) => prev.filter((bp) => bp.id !== id));
  };

  const updateBulletPoint = (id, text) => {
    setBulletPoints((prev) =>
      prev.map((bp) => (bp.id === id ? { ...bp, text } : bp)),
    );
  };

  const buildContent = () => {
    const filledBullets = bulletPoints.filter((bp) => bp.text.trim());
    const bulletHTML = filledBullets
      .map((bp) => `<li>${bp.text.trim()}</li>`)
      .join("\n");
    return `<ul>\n${bulletHTML}\n</ul>\n\n<p>${summary.trim()}</p>`;
  };

  const buildExcerpt = () => {
    const firstBullet = bulletPoints.find((bp) => bp.text.trim());
    if (firstBullet)
      return firstBullet.text
        .trim()
        .replace(/<[^>]*>/g, "")
        .substring(0, 200);
    return summary.trim().substring(0, 200);
  };

  const handlePublish = async () => {
    if (!headline.trim()) {
      setError("Headline is required");
      return;
    }
    if (!selectedImage) {
      setError("Featured image is required");
      return;
    }
    if (!summary.trim()) {
      setError("Summary is required");
      return;
    }
    const filledBullets = bulletPoints.filter((bp) => bp.text.trim());
    if (filledBullets.length === 0) {
      setError("At least one bullet point is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("image", selectedImage);
      const uploadResponse = await fetch("/api/posts/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload image");
      const { imageUrl, publicId } = await uploadResponse.json();

      // Build slug from custom URL or headline
      const slugSource = customUrl.trim() || headline.trim();
      const slug = generateSlug(slugSource);

      // Build content and excerpt
      const content = buildContent();
      const excerpt = buildExcerpt();

      const response = await fetch("/api/posts/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: headline.trim(),
          slug,
          content,
          excerpt,
          metaDescription:
            excerpt.substring(0, 157) + (excerpt.length > 157 ? "..." : ""),
          featuredImage: imageUrl,
          cloudinaryPublicId: publicId,
          category,
          author: "Pracika Admin",
          published: true,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to publish");
      }

      const { post } = await response.json();

      // Trigger home page revalidation so Google bot sees it immediately
      await fetch("/api/revalidate-home", { method: "POST" }).catch(() => {});

      window.location.href = `/posts/${post.slug}`;
    } catch (err) {
      setError(err.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">
            Create New Post
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Headline */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
                Headline *
              </label>
              <input
                type="text"
                className="w-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={120}
              />
              <p className="text-xs text-zinc-400 mt-1">
                {headline.length}/120
              </p>
            </div>

            {/* Custom URL (optional) */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-200">
                Custom URL slug{" "}
                <span className="text-zinc-400 font-normal">
                  (optional — headline is used if empty)
                </span>
              </label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-zinc-400 whitespace-nowrap">
                  /posts/
                </span>
                <input
                  type="text"
                  className="flex-1 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  placeholder="gseb-ssc-result-2026"
                  value={customUrl}
                  onChange={(e) =>
                    setCustomUrl(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    )
                  }
                />
              </div>
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-200">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all hover:shadow-md ${
                      category === cat.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200"
                        : "border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={category === cat.value}
                      onChange={(e) => setCategory(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div
                      className={`text-xs font-medium ${
                        category === cat.value
                          ? "text-blue-700"
                          : "text-zinc-700 dark:text-zinc-200"
                      }`}
                    >
                      {cat.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Bullet Points */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Bullet Points *
                </label>
                <button
                  onClick={addBulletPoint}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  + Add Point
                </button>
              </div>
              <p className="text-xs text-zinc-400 mb-2">
                These are shown as "Main Highlights" on the article. You can
                include links like{" "}
                <code className="bg-zinc-100 dark:bg-zinc-700 px-1 rounded text-xs">
                  &lt;a href="https://example.com" target="_blank"&gt;Click
                  here&lt;/a&gt;
                </code>
              </p>
              <div className="space-y-3">
                {bulletPoints.map((bp, index) => (
                  <div key={bp.id} className="flex items-start gap-2">
                    <span className="text-zinc-400 text-base mt-3 w-4 flex-shrink-0">
                      •
                    </span>
                    <textarea
                      className="flex-1 border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none font-mono"
                      rows={2}
                      placeholder={`Key highlight ${index + 1}... (supports <a href="..."> links)`}
                      value={bp.text}
                      onChange={(e) => updateBulletPoint(bp.id, e.target.value)}
                    />
                    {bulletPoints.length > 1 && (
                      <button
                        onClick={() => removeBulletPoint(bp.id)}
                        className="text-red-400 hover:text-red-600 mt-2 text-xl leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary / Article Body */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-200">
                Full Summary / Article Body *
              </label>
              <p className="text-xs text-zinc-400 mb-3">
                This is hidden behind the "Read Full Article" button. Readers
                see bullet points first.
              </p>
              <textarea
                className="w-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                rows={8}
                placeholder="The Gujarat Secondary and Higher Secondary Education Board (GSEB) has officially declared the Class 10 (SSC) results today..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <p className="text-xs text-zinc-400 mt-1">
                {summary.length} characters
              </p>
            </div>

            {/* Featured Image */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-6">
              <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-200">
                Featured Image *
              </label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="text-4xl mb-3">📸</div>
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Click to upload an image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-zinc-400 mt-2">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-56 rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 text-sm"
                  >
                    ✕
                  </button>
                  <div className="mt-2 text-center">
                    <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Publishing...
                </div>
              ) : (
                "✅ Publish Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
