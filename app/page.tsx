import { DeleteButton } from "@/lib/deleteButton";
import { EditButton } from "@/lib/editButton";
import Link from "next/link";

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function HomePage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        <div className="text-center space-y-3 py-8 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Articles and thoughts from our community
          </p>

          <Link
            href="/blog/add"
            className="inline-flex items-center px-4 py-2 mt-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to create a post
            </p>
            <Link
              href="/blog/add"
              className="text-gray-900 dark:text-white underline hover:no-underline"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog: any) => (
              <div key={blog._id} className="block group">
                <article className="border-b border-gray-100 dark:border-gray-800 pb-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-4 rounded-lg transition-colors">
                  <Link href={`/blog/${blog._id}`}>
                    {blog.image && (
                      <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>

                  <div className="space-y-3">
                    <Link href={`/blog/${blog._id}`}>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {blog.title}
                      </h2>
                    </Link>

                    {blog.excerpt && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>{blog.author || "Anonymous"}</span>
                        {blog.createdAt && (
                          <>
                            <span>•</span>
                            <time>
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </time>
                          </>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <EditButton id={blog._id} />
                        <DeleteButton id={blog._id} />
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                      Read more →
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}

        {blogs.length > 0 && (
          <div className="text-center pt-12 pb-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to share your thoughts?
            </p>
            <Link
              href="/blog/add"
              className="text-gray-900 dark:text-white underline hover:no-underline"
            >
              Create a new post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
