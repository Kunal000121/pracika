import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
  },
  featuredImage: {
    type: String,
    required: function () {
      return this.published;
    },
  },
  cloudinaryPublicId: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    default: "news",
    enum: [
      "news",
      "technology",
      "business",
      "sports",
      "education",
      "entertainment",
      "lifestyle",
      "health",
      "science",
    ],
  },
  author: {
    type: String,
    required: true,
    default: "omnicore Editorial",
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  published: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  seoMetadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  structuredData: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
  analytics: {
    impressions: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 },
    avgTimeOnPage: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
  },
});

// Pre-save middleware
PostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Truncate metaDescription to 160 characters before saving
  if (this.metaDescription && this.metaDescription.length > 160) {
    this.metaDescription = this.metaDescription.substring(0, 157) + "...";
  }

  // Set publishedAt when status changes to published
  if (this.published && !this.publishedAt) {
    this.publishedAt = Date.now();
  }

  next();
});

// Virtual for formatted date
PostSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Indexes
PostSchema.index({ published: 1, createdAt: -1 });
PostSchema.index({ published: 1, publishedAt: -1 });
PostSchema.index({ slug: 1, published: 1 });
PostSchema.index({ category: 1, published: 1 });
PostSchema.index({ views: -1, published: 1 });
PostSchema.index({ cloudinaryPublicId: 1 });

// Enhanced text search index
PostSchema.index(
  {
    title: "text",
    content: "text",
    excerpt: "text",
    metaDescription: "text",
  },
  {
    weights: {
      title: 10,
      excerpt: 3,
      metaDescription: 2,
      content: 1,
    },
  }
);

// Compound indexes for better query performance
PostSchema.index({ category: 1, published: 1, createdAt: -1 });
PostSchema.index({ author: 1, published: 1, createdAt: -1 });

// Static methods for common queries
PostSchema.statics.findPublished = function (limit = 20, category = null) {
  let query = { published: true };
  if (category && category !== "all") {
    query.category = category;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title slug excerpt featuredImage category author createdAt views");
};

PostSchema.statics.findByCategory = function (category, limit = 10) {
  return this.find({ category, published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title slug excerpt featuredImage author createdAt");
};

PostSchema.statics.findPopular = function (limit = 10) {
  return this.find({ published: true })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select("title slug excerpt featuredImage category author createdAt views");
};

PostSchema.statics.searchPosts = function (searchTerm, limit = 20) {
  return this.find({
    $text: { $search: searchTerm },
    published: true,
  })
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .select("title slug excerpt featuredImage category author createdAt");
};

// Instance methods
PostSchema.methods.incrementViews = function () {
  this.views += 1;
  this.analytics.impressions += 1;
  return this.save();
};

PostSchema.methods.generateSEOData = function () {
  return {
    title: `${this.title} | omnicore`,
    description: this.metaDescription || this.excerpt,
    canonical: `/posts/${this.slug}`,
    openGraph: {
      title: this.title,
      description: this.excerpt,
      image: this.featuredImage,
      type: "article",
      url: `/posts/${this.slug}`,
    },
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: this.title,
      description: this.excerpt,
      image: this.featuredImage,
      author: {
        "@type": "Person",
        name: this.author,
      },
      publisher: {
        "@type": "Organization",
        name: "omnicore",
      },
      datePublished: this.publishedAt || this.createdAt,
      dateModified: this.updatedAt,
    },
  };
};

// Ensure virtual fields are serialized
PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
