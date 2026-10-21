import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About omnicore
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Delivering quick, trending insights to keep you informed and ahead
            of the curve
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              At omnicore, we believe that staying informed shouldn't be
              time-consuming. In today's fast-paced world, you need quick access
              to the most relevant and trending information across various
              topics.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Our mission is to curate and present the most important insights
              in a format that's easy to digest, helping you stay informed
              without overwhelming you with information overload.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                No Opinions, Just Facts
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                We don’t write news articles or blogs. We only show quick
                snapshots of trending facts, helping you stay informed in a
                neutral way.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                Curated Content
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Our team carefully curates content to ensure quality and
                relevance, filtering out noise to bring you what matters most.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                24/7 Coverage
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Round-the-clock coverage ensures you never miss important
                updates, no matter when they happen.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                Easy to Digest
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                We present information in quick, scannable formats that respect
                your time and attention.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Our Values
          </h2>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                  Accuracy
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  We prioritize factual, verified information to maintain your
                  trust.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                  Speed
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Quick delivery of insights without compromising on quality.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                  Relevance
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Content that matters to you and impacts your world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-6">
            Join thousands of readers who trust omnicore for their daily
            insights.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
