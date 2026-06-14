"use client";

import { useState } from "react";

export default function ShareButtons({ url, title, description }) {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const handleShare = (platform) => {
    setShareCount((prev) => prev + 1);

    if (typeof gtag !== "undefined") {
      gtag("event", "share", {
        method: platform,
        content_type: "article",
        item_id: url,
      });
    }
  };

  const shareOnTwitter = () => {
    handleShare("twitter");
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}&via=Pracika`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareOnFacebook = () => {
    handleShare("facebook");
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    handleShare("linkedin");
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
      description || ""
    )}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    handleShare("whatsapp");
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnTelegram = () => {
    handleShare("telegram");
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      handleShare("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        handleShare("copy");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        handleShare("native");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-8">
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">📢</span>
              Share This Article
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Help others discover this content
            </p>
          </div>
          {shareCount > 0 && (
            <div className="mt-3 sm:mt-0 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-3 py-1 rounded-full">
              Shared {shareCount} time{shareCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Responsive Grid: 2 cols on mobile, 3 on tablet, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {/* WhatsApp */}
          <button
            onClick={shareOnWhatsApp}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-500 rounded-xl transition-all duration-200 group"
            aria-label="Share on WhatsApp"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              WhatsApp
            </span>
          </button>

          {/* Telegram */}
          <button
            onClick={shareOnTelegram}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-200 group"
            aria-label="Share on Telegram"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Telegram
            </span>
          </button>
          {/* Twitter */}
          <button
            onClick={shareOnTwitter}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-200 group"
            aria-label="Share on Twitter"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Twitter
            </span>
          </button>

          {/* Facebook */}
          <button
            onClick={shareOnFacebook}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-200 group"
            aria-label="Share on Facebook"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Facebook
            </span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={shareOnLinkedIn}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-200 group"
            aria-label="Share on LinkedIn"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-700 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              LinkedIn
            </span>
          </button>

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500 rounded-xl transition-all duration-200 group ${
              copied
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600"
                : ""
            }`}
            aria-label="Copy link"
          >
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
                copied ? "bg-green-500" : "bg-zinc-600 dark:bg-zinc-500"
              }`}
            >
              {copied ? (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>
        </div>

        {/* Native Share (Mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={shareViaNative}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share Article
            </button>
          </div>
        )}

        {/* SEO-friendly sharing prompt */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1">
            <span className="text-purple-500">💡</span>
            Found this article helpful? Share it with your network!
          </p>
        </div>
      </div>
    </div>
  );
}
