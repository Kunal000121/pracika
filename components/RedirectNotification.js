// components/RedirectNotification.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RedirectNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromDeletedPost = searchParams.get("from");
    const original = searchParams.get("original");

    if (fromDeletedPost === "deleted-post" && original) {
      setOriginalSlug(original);
      setShowNotification(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-amber-500 text-xl">ℹ️</span>
          </div>
          <div className="ml-3 flex-grow">
            <h3 className="text-sm font-medium text-amber-800">
              Post Not Available
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              The post you were looking for has been removed. We've redirected
              you to related content instead.
            </p>
            {originalSlug && (
              <p className="mt-1 text-xs text-amber-600 font-mono">
                Original: {originalSlug}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={() => setShowNotification(false)}
              className="text-amber-400 hover:text-amber-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
