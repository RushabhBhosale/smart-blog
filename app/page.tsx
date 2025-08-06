import { DeleteButton } from "@/lib/deleteButton";
import { EditButton } from "@/lib/editButton";
import Link from "next/link";
import { Calendar, User, Clock, TrendingUp, Bookmark } from "lucide-react";

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function HomePage() {
  const blogs = await getBlogs();

  // Sort blogs by date (newest first)
  const sortedBlogs = blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get featured blog (most recent)
  const featuredBlog = sortedBlogs[0];
  const otherBlogs = sortedBlogs.slice(1);

  // Get recent blogs for sidebar
  const recentBlogs = sortedBlogs.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="sans text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover insights, tutorials, and stories from our community of
              creators and developers
            </p>

            <Link
              href="/blog/add"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Write New Post
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border shadow-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="heading text-2xl font-semibold text-foreground mb-3">
                  No posts yet
                </h3>
                <p className="sans text-muted-foreground mb-8 max-w-md mx-auto">
                  Be the first to share your thoughts and create engaging
                  content for our community
                </p>
                <Link
                  href="/blog/add"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Blog */}
                {featuredBlog && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <h2 className="heading text-2xl font-semibold text-foreground">
                        Featured Post
                      </h2>
                    </div>

                    <article className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                      <Link
                        href={`/blog/${featuredBlog._id}`}
                        className="block"
                      >
                        {featuredBlog.image && (
                          <div className="relative h-80 overflow-hidden">
                            <img
                              src={featuredBlog.image}
                              alt={featuredBlog.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                Featured
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-8">
                          <h3 className="heading text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                            {featuredBlog.title}
                          </h3>

                          {featuredBlog.excerpt && (
                            <p className="sans text-lg text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                              {featuredBlog.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>
                                  {featuredBlog.author || "Anonymous"}
                                </span>
                              </div>
                              {featuredBlog.createdAt && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <time>
                                    {new Date(
                                      featuredBlog.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </time>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <EditButton id={featuredBlog._id} />
                              <DeleteButton id={featuredBlog._id} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </section>
                )}

                {/* Other Blog Posts */}
                {otherBlogs.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="heading text-2xl font-semibold text-foreground">
                      Latest Posts
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      {otherBlogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                          <Link href={`/blog/${blog._id}`} className="block">
                            {blog.image && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              </div>
                            )}

                            <div className="p-6">
                              <h3 className="heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {blog.title}
                              </h3>

                              {blog.excerpt && (
                                <p className="sans text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                                  {blog.excerpt}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{blog.author || "Anonymous"}</span>
                                  </div>
                                  {blog.createdAt && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <time>
                                        {new Date(
                                          blog.createdAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </time>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <EditButton id={blog._id} />
                                  <DeleteButton id={blog._id} />
                                </div>
                              </div>

                              <div className="mt-4 text-sm text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
                                Read more →
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Recent Posts */}
            {recentBlogs.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-lg p-6">
                <h3 className="heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Posts
                </h3>

                <div className="space-y-4">
                  {recentBlogs.map((blog, index) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog._id}`}
                      className="block group"
                    >
                      <article className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="sans font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                            {blog.title}
                          </h4>
                          {blog.createdAt && (
                            <time className="text-xs text-muted-foreground mt-1 block">
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </time>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 p-6 text-center">
              <h3 className="heading text-lg font-semibold text-foreground mb-3">
                Share Your Story
              </h3>
              <p className="sans text-sm text-muted-foreground mb-4">
                Have something interesting to share? Join our community of
                writers.
              </p>
              <Link
                href="/blog/add"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Start Writing
              </Link>
            </div>

            {/* Stats Widget (Optional) */}
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              <h3 className="heading text-lg font-semibold text-foreground mb-4">
                Blog Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="sans text-sm text-muted-foreground">
                    Total Posts
                  </span>
                  <span className="font-semibold text-foreground">
                    {blogs.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="sans text-sm text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-semibold text-foreground">
                    {
                      blogs.filter((blog) => {
                        const blogDate = new Date(blog.createdAt);
                        const now = new Date();
                        return (
                          blogDate.getMonth() === now.getMonth() &&
                          blogDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
