import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export async function POST(request) {
  try {
    const { title, category } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const validCategories = [
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

    const selectedCategory = category || "news";
    if (!validCategories.includes(selectedCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const slug = generateUniqueSlug(title);

    const categoryContext = {
      news: "new interest topics, current events, and informative content",
      technology:
        "technology trends, gadgets, software, AI, programming, and tech industry news",
      business:
        "business strategies, entrepreneurship, finance, market trends, and corporate insights",
      sports:
        "sports events, athlete profiles, game analysis, fitness, and sporting achievements",
      education:
        "education news, exams, learning resources, study strategies, schools, colleges, and student updates",
      entertainment:
        "movies, TV shows, celebrity news, music, gaming, and pop culture",
      lifestyle:
        "lifestyle tips, wellness, fashion, travel, food, and personal development",
      health:
        "health tips, medical insights, fitness, nutrition, mental health, and wellness",
      science:
        "scientific discoveries, research, space exploration, environmental science, and innovation",
    };

    const contentPrompt = `
You are a professional content writer for Pracika, a digital publication that delivers concise, human-friendly articles.

Write a short blog content about "${title}" in the ${selectedCategory} category.

Requirements:
- Begin with a clear, engaging summary in 1 sentences (this will serve as the excerpt).
- Then, write 3–4 short bullet points or key highlights about the topic (optional if not natural).
- Finish with a small paragraph (80–120 words) elaborating the topic in plain language.
- Ensure the tone is conversational, human-like, and SEO-friendly.
- Return only plain text (no HTML, no markdown, no headings).

Example format:
[1 sentence excerpt]

- Key point 1
- Key point 2

[Short elaboration paragraph]
`;

    const titlePrompt = `Create a compelling, SEO-friendly headline for "${title}" in the ${selectedCategory.replace(
      "-",
      " "
    )} category.
Requirements:
- 50-65 characters optimal length
- Include the main keyword "${title}"
- Make it engaging and clickable
- Use active voice and strong verbs
- Appeal to readers interested in ${categoryContext[selectedCategory]}
- Follow professional headline standards

Return only the headline, no quotes or additional text.`;

    const metaPrompt = `Write a compelling SEO meta description for an article about "${title}".
Requirements:
- Exactly 150-160 characters
- Include the keyword "${title}"
- Summarize the key point
- Encourage clicks
- Use active voice
- Appeal to readers interested in ${categoryContext[selectedCategory]}

Return only the meta description, no quotes or formatting.`;

    const [contentResult, titleResult, metaResult] = await Promise.all([
      model.generateContent(contentPrompt),
      model.generateContent(titlePrompt),
      model.generateContent(metaPrompt),
    ]);

    let aiContent = contentResult.response.text().trim();
    aiContent = aiContent
      .replace(/^```html/i, "")
      .replace(/^```/m, "")
      .replace(/```$/gm, "")
      .replace(/^#+\s/gm, "")
      .trim();

    let aiTitle = titleResult.response
      .text()
      .trim()
      .replace(/^```/, "")
      .replace(/```$/, "")
      .replace(/^["']|["']$/g, "")
      .trim();

    let aiMetaDescription = metaResult.response
      .text()
      .trim()
      .replace(/^```/, "")
      .replace(/```$/, "")
      .replace(/^["']|["']$/g, "")
      .trim();

    if (aiMetaDescription.length > 160) {
      aiMetaDescription = aiMetaDescription.substring(0, 157) + "...";
    }

    const sentences = aiContent.split(/[.!?]+/);
    const excerpt = sentences[0]
      ? sentences[0].trim() + "."
      : aiContent.substring(0, 150) + "...";

    const currentDate = new Date();

    const draft = {
      title: aiTitle,
      slug,
      content: aiContent,
      excerpt,
      metaDescription: aiMetaDescription,
      category: selectedCategory,
      author: "Pracika Editorial",
      status: "draft",
      published: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    console.log("✅ Content generated successfully!");

    return NextResponse.json({
      success: true,
      content: aiContent, // Keep backward compatibility
      draft, // Enhanced draft with all KNN features
      message: "Content generated successfully with enhanced SEO features",
      seoData: {
        title: aiTitle,
        metaDescription: aiMetaDescription,
        slug,
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);

    // Return more specific error messages
    let errorMessage = "Failed to generate content";
    if (error.message?.includes("API key")) {
      errorMessage = "AI service configuration error";
    } else if (error.message?.includes("quota")) {
      errorMessage = "AI service quota exceeded. Please try again later.";
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error. Please check your connection.";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
