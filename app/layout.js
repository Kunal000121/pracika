import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../contexts/ThemeContext";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "omnicore - Trending News and Updates",
    template: "%s | omnicore",
  },
  description:
    "Stay ahead with omnicore - your source for trending topics, quick insights, and breaking news. Get real-time updates on tech, business, lifestyle, and more.",
  keywords: [
    "trending news",
    "quick updates",
    "AI news",
    "tech trends",
    "business insights",
    "lifestyle updates",
    "breaking news",
    "real-time updates",
  ],
  authors: [{ name: "omnicore AI Team" }],
  creator: "omnicore Team",
  publisher: "omnicore",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "omnicore",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    title: "omnicore - Trending News and Updates",
    description:
      "Stay ahead with omnicore - your source for trending topics and quick insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "omnicore News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@omnicore",
    title: "omnicore - Trending News and Updates",
    description:
      "Stay ahead with omnicore - your AI-powered source for trending topics and quick insights.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                      (function() {
                        function getInitialTheme() {
                          const persistedTheme = window.localStorage.getItem('theme');
                          const hasPersistedPreference = typeof persistedTheme === 'string';
                          
                          if (hasPersistedPreference) {
                            if (persistedTheme === 'system') {
                              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                            }
                            return persistedTheme;
                          }
                          
                          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                        }
                        
                        const theme = getInitialTheme();
                        document.documentElement.classList.add(theme);
                      })();
                    `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
