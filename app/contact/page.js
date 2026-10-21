"use client";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-gray-950 dark:via-zinc-800 dark:to-zinc-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
              Have questions, feedback, or suggestions? We're here to help!
              Reach out to us through any of the following methods.
            </p>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                    Email
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <a
                    href="mailto:heyomnicore@gmail.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    heyomnicore@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                    Response Time
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    We typically respond to all inquiries within 24 hours during
                    business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                    Support
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Whether it's technical issues, content suggestions, or
                    general feedback - we're here to help.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mt-8 bg-blue-50 dark:bg-zinc-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Frequently Asked Questions
              </h4>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <p>
                  <strong>Q: How often is content updated?</strong>
                  <br />
                  A: We provide real-time updates 24/7 to keep you informed of
                  the latest trends.
                </p>

                <p>
                  <strong>Q: Can I suggest topics for coverage?</strong>
                  <br />
                  A: Absolutely! We welcome content suggestions and feedback
                  from our readers.
                </p>

                <p>
                  <strong>
                    Q: How can I report an issue with the website?
                  </strong>
                  <br />
                  A: Please use the contact form above or email us directly with
                  details about the issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
