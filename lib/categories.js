export const categories = {
  news: {
    label: "News",
    icon: "📰",
    href: "/news",
    description: "Latest news and current events - Stay updated with Pracika",
    color:
      "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
  },
  technology: {
    label: "Technology",
    icon: "💻",
    href: "/technology",
    description: "Tech trends, gadgets, software, AI, and digital innovation",
    color:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800",
  },
  sports: {
    label: "Sports",
    icon: "⚽",
    href: "/sports",
    description: "Sports events, athlete profiles, fitness, and match updates",
    color:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800",
  },
  business: {
    label: "Business",
    icon: "💼",
    href: "/business",
    description: "Business strategies, finance, market trends, and startups",
    color:
      "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800",
  },
  education: {
    label: "Education",
    icon: "🎓",
    href: "/education",
    description: "Education news, exams, learning guides, and student updates",
    color:
      "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800",
  },
  lifestyle: {
    label: "Lifestyle",
    icon: "✨",
    href: "/lifestyle",
    description: "Lifestyle tips, wellness, fashion, travel, and food",
    color:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800",
  },
};

export const visibleCategories = [
  "news",
  "technology",
  "sports",
  "business",
  "education",
  "lifestyle",
];

export function getCategory(category) {
  return categories[category] || categories.news;
}
