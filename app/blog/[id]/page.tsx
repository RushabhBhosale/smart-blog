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

  if (!id) return <div className="p-6">Invalid URL 🚫</div>;

  const blog = blogs.find((b: any) => b._id === id);

  if (!blog) return <div className="p-6 text-center">Blog not found ❌</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-500 text-sm">By {blog.author}</p>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="rounded-lg w-full h-auto"
        />
      )}
      <p className="text-lg leading-relaxed">{blog.content}</p>
    </div>
  );
}
