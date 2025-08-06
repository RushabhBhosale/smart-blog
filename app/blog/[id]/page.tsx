import Link from "next/link";
import ReactMarkdown from "react-markdown";

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const blogs = await getBlogs();
  const { id } = await params;

  if (!id) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Invalid URL
          </h1>
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 underline hover:no-underline"
          >
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  const blog = blogs.find((b: any) => b._id === id);
  console.log("egwwe", blog.content);

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Blog post not found
          </h1>
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 underline hover:no-underline"
          >
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
          >
            ← Back to blog
          </Link>
        </nav>

        <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>By {blog.author || "Anonymous"}</span>
            {blog.createdAt && (
              <>
                <span>•</span>
                <time>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        <article className="prose prose-gray dark:prose-invert prose-lg max-w-none">
          {blog.content
            .split(/(?<=\.)\s+(?=[A-Z])|(?=- \*\*)/g)
            .map((para: string, i: number) => (
              <div key={i} className="mb-4">
                <ReactMarkdown>{para.trim()}</ReactMarkdown>
              </div>
            ))}
        </article>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All posts
          </Link>
        </footer>
      </div>
    </div>
  );
}
