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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">📝 Blog Posts</h1>
      {blogs.length === 0 && <p className="text-gray-500">No blogs found 😶</p>}
      {blogs.map((blog: any) => (
        <Link
          href={`/blog/${blog._id}`}
          key={blog._id}
          className="block p-4 rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <p className="text-sm text-gray-500">By {blog.author}</p>
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="mt-2 rounded-lg object-cover h-48 w-full"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
