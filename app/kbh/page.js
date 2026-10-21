"use client";

import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="flex flex-col space-y-6">
          <Link
            href="/kbh/create"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-8 hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">✍️</div>
              <div>
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <p className="text-blue-200 mt-1">
                  Write and publish fresh content
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/kbh/posts"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-8 hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📚</div>
              <div>
                <h2 className="text-xl font-semibold">Manage Posts</h2>
                <p className="text-purple-200 mt-1">
                  Edit or remove existing blog posts
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
