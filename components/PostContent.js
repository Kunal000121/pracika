"use client";

import { useState } from "react";

export default function PostContent({ content }) {
  const [showFullContent, setShowFullContent] = useState(false);

  // Strip all tags EXCEPT anchor tags - preserve links
  const stripTagsKeepLinks = (value) => {
    return value
      .replace(/<(?!\/?(a)\b)[^>]*>/gi, "") // remove all tags except <a> and </a>
      .trim();
  };

  const stripAllTags = (value) => value.replace(/<[^>]*>/g, "").trim();

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Check if a string contains an anchor tag
  const hasLink = (value) => /<a\s/i.test(value);

  const parseHtmlListContent = (content) => {
    const listItems = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((match) => match[1]) // keep raw inner HTML
      .filter((point) => stripAllTags(point).length > 15)
      .slice(0, 6);

    if (listItems.length === 0) return null;

    const contentAfterList = content.replace(/^[\s\S]*?<\/ul>/i, "").trim();
    const paragraphs = [
      ...contentAfterList.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
    ]
      .map((match) => match[1])
      .filter(Boolean);
    const summaryText =
      paragraphs.join("\n\n") || stripAllTags(contentAfterList);

    return {
      bulletPoints: listItems,
      remainingContent: summaryText
        ? summaryText
            .split(/\n{2,}/)
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join("\n")
        : "",
      hasMore: summaryText.length > 0,
      isHtml: true, // flag that bullet points contain HTML
    };
  };

  const parseContent = (content) => {
    const htmlListContent = parseHtmlListContent(content);
    if (htmlListContent) return htmlListContent;

    const lines = content.split("\n");
    const bulletPoints = [];
    const remainingContent = [];
    let foundBullets = false;
    let bulletSection = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (
        line.match(/^[-•*]\s+/) ||
        line.match(/^\d+\.\s+/) ||
        (line.includes("•") && line.length < 200 && line.length > 20)
      ) {
        if (bulletSection && bulletPoints.length < 6) {
          // Keep raw content (may include links), just strip bullet marker
          const cleanPoint = line
            .replace(/^[-•*]\s*/, "")
            .replace(/^\d+\.\s*/, "")
            .trim();

          if (stripAllTags(cleanPoint).length > 15) {
            bulletPoints.push(cleanPoint);
            foundBullets = true;
          }
        } else {
          remainingContent.push(line);
        }
      } else if (line.length > 0) {
        if (foundBullets && bulletPoints.length > 0 && bulletSection) {
          if (line.length > 100) {
            bulletSection = false;
          }
        }

        if (!bulletSection || bulletPoints.length >= 6) {
          remainingContent.push(line);
        } else if (bulletPoints.length === 0) {
          remainingContent.push(line);
        }
      } else {
        remainingContent.push(line);
      }
    }

    if (bulletPoints.length === 0) {
      const textContent = stripAllTags(content);
      const sentences = textContent.split(/[.!?]+/);
      const keyPoints = sentences
        .filter((sentence) => {
          const cleaned = sentence.trim();
          return (
            cleaned.length > 30 &&
            cleaned.length < 150 &&
            !cleaned.toLowerCase().includes("http") &&
            !cleaned.toLowerCase().includes("www") &&
            cleaned.split(" ").length > 5
          );
        })
        .slice(0, 5)
        .map((sentence) => sentence.trim());

      if (keyPoints.length >= 3) {
        bulletPoints.push(...keyPoints);
        let cleanedContent = content;
        keyPoints.forEach((point) => {
          const variations = [point, point + ".", point + "!", point + "?"];
          variations.forEach((variation) => {
            cleanedContent = cleanedContent.replace(variation, "");
          });
        });
        return {
          bulletPoints,
          remainingContent: cleanedContent,
          hasMore: cleanedContent.trim().length > 200,
          isHtml: false,
        };
      }
    }

    return {
      bulletPoints,
      remainingContent: remainingContent.join("\n"),
      hasMore:
        remainingContent.length > 0 &&
        remainingContent.join("").trim().length > 200,
      isHtml: false,
    };
  };

  const { bulletPoints, remainingContent, hasMore, isHtml } =
    parseContent(content);
  const contentLength = stripAllTags(content).length;
  const isLongContent = contentLength > 600;

  // Render a bullet point — if it has HTML (links), use dangerouslySetInnerHTML
  const renderBulletPoint = (point, index) => {
    const pointHasLink = hasLink(point);
    const cleanedPoint = pointHasLink
      ? point // keep HTML with links intact
      : stripAllTags(point).replace(/[.!?]+$/, "");

    return (
      <div key={index} className="flex items-start gap-3 group">
        <div className="flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-md flex-shrink-0 mt-0.5 font-bold text-xs">
          {index + 1}
        </div>
        {pointHasLink ? (
          <p
            className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm md:text-base [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:font-medium [&_a]:hover:text-blue-800 [&_a]:dark:hover:text-blue-300 [&_a]:transition-colors"
            dangerouslySetInnerHTML={{ __html: cleanedPoint }}
          />
        ) : (
          <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm md:text-base">
            {cleanedPoint}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {bulletPoints.length > 0 && (
        <div className="not-prose">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md">
                <span className="text-white text-sm font-bold">✨</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Main Highlights
              </h3>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            </div>

            <div className="grid gap-3">
              {bulletPoints.map((point, index) =>
                renderBulletPoint(point, index),
              )}
            </div>

            {hasMore && (
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <span className="text-sm">
                    {showFullContent ? "📖" : "🔍"}
                  </span>
                  <span>
                    {showFullContent ? "Show Less" : "Read Full Article"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showFullContent ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full content or remaining content */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          showFullContent || bulletPoints.length === 0
            ? "opacity-100 max-h-none transform translate-y-0"
            : hasMore
              ? "opacity-0 max-h-0 overflow-hidden transform -translate-y-4"
              : "opacity-100 max-h-none transform translate-y-0"
        }`}
      >
        {(showFullContent || bulletPoints.length === 0) && (
          <div
            className="prose-content prose-headings:scroll-mt-24 prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-em:text-zinc-800 dark:prose-em:text-zinc-200 prose-code:text-zinc-900 dark:prose-code:text-zinc-100 prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:font-medium [&_a]:hover:text-blue-800 [&_a]:dark:hover:text-blue-300 [&_a]:transition-colors"
            dangerouslySetInnerHTML={{
              __html: bulletPoints.length > 0 ? remainingContent : content,
            }}
          />
        )}
      </div>

      {/* If no bullet points, show truncated content with read more */}
      {bulletPoints.length === 0 && isLongContent && (
        <div className="not-prose">
          <div
            className={`transition-all duration-700 ease-in-out ${
              showFullContent ? "hidden" : "block"
            }`}
          >
            <div
              className="prose-content relative prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:font-medium [&_a]:hover:text-blue-800 [&_a]:transition-colors"
              dangerouslySetInnerHTML={{
                __html: content.substring(0, 600) + "...",
              }}
            />

            <div className="relative -mt-16 h-16 bg-gradient-to-t from-white dark:from-zinc-900 via-white/80 dark:via-zinc-900/80 to-transparent pointer-events-none"></div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowFullContent(true)}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">📚</span>
                <span>Continue Reading</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
