import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  TrendingUp,
  Bookmark,
  Newspaper,
  Tv,
  Trophy,
  Laptop,
  MapPin,
  Sparkles,
  Gamepad,
} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  image?: string;
  excerpt?: string;
  author?: string;
  createdAt: string;
  tags: string[];
}

interface TagConfig {
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface BlogData {
  allBlogs: Blog[];
  [key: string]: Blog[];
}

const TAGS = [
  "news",
  "anime",
  "movies_tv",
  "sports",
  "tech",
  "travel",
  "fashion",
] as const;

const TAG_CONFIG: Record<string, TagConfig> = {
  news: {
    name: "News",
    icon: Newspaper,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  anime: {
    name: "Anime",
    icon: Gamepad,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  movies_tv: {
    name: "Movies & TV",
    icon: Tv,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  sports: {
    name: "Sports",
    icon: Trophy,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  tech: {
    name: "Technology",
    icon: Laptop,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  travel: {
    name: "Travel",
    icon: MapPin,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  fashion: {
    name: "Fashion",
    icon: Sparkles,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
};

async function getBlogsByTags(): Promise<BlogData> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");

    const blogs: Blog[] = await res.json();
    const sortedBlogs = blogs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const blogData: BlogData = { allBlogs: sortedBlogs };
    TAGS.forEach((tag) => {
      blogData[`${tag}Blogs`] = sortedBlogs.filter((blog) =>
        blog.tags.includes(tag)
      );
    });

    return blogData;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      allBlogs: [],
      ...Object.fromEntries(TAGS.map((tag) => [`${tag}Blogs`, []])),
    };
  }
}

function BlogCard({
  blog,
  isLarge = false,
}: {
  blog: Blog;
  isLarge?: boolean;
}) {
  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        isLarge ? "md:col-span-2" : ""
      }`}
    >
      {blog.image && (
        <Link href={`/blog/${blog._id}`} className="block">
          <div
            className={`relative overflow-hidden ${isLarge ? "h-64" : "h-48"}`}
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {blog.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-2">
                {blog.tags.slice(0, 2).map((tag) => {
                  const config = TAG_CONFIG[tag];
                  if (!config) return null;
                  return (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}
                    >
                      {config.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </Link>
      )}
      <div className={`p-6 ${isLarge ? "p-8" : ""}`}>
        <h3
          className={`font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 ${
            isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p
            className={`text-muted-foreground leading-relaxed mb-4 line-clamp-2 ${
              isLarge ? "text-lg line-clamp-3" : ""
            }`}
          >
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
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 text-sm text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
          Read more →
        </div>
      </div>
    </div>
  );
}

function TagSection({
  title,
  blogs,
  icon: Icon,
  tagKey,
}: {
  title: string;
  blogs: Blog[];
  icon: any;
  tagKey: keyof typeof TAG_CONFIG;
}) {
  if (!blogs.length) return null;
  const config = TAG_CONFIG[tagKey];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
        >
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
          {blogs.length}
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(0, 6).map((blog, index) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            isLarge={index === 0 && blogs.length > 3}
          />
        ))}
      </div>
      {blogs.length > 6 && (
        <div className="text-center">
          <Link
            href={`/blog?tag=${tagKey}`}
            className="text-primary hover:text-primary/80 font-medium text-sm border border-border hover:border-primary px-4 py-2 rounded-lg transition-colors"
          >
            View all {title.toLowerCase()} posts ({blogs.length})
          </Link>
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const blogs = await getBlogsByTags();
  const { allBlogs } = blogs;
  const featuredBlog = allBlogs[0];
  const recentBlogs = allBlogs.slice(0, 5);

  const tagStats = TAGS.map((tag) => ({
    tag,
    count: blogs[`${tag}Blogs`].length,
  }))
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover insights, tutorials, and stories across technology,
              entertainment, sports, and lifestyle
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

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-12">
            {allBlogs.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border shadow-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  No posts yet
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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
                {featuredBlog && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-semibold text-foreground">
                        Featured Post
                      </h2>
                    </div>
                    <div className="bg-card rounded-2xl border border-border shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                Featured
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="p-8">
                          <h3 className="text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                            {featuredBlog.title}
                          </h3>
                          {featuredBlog.excerpt && (
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6 line-clamp-3">
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
                          </div>
                        </div>
                      </Link>
                    </div>
                  </section>
                )}
                {TAGS.map((tag) => (
                  <TagSection
                    key={tag}
                    title={TAG_CONFIG[tag].name}
                    blogs={blogs[`${tag}Blogs`]}
                    icon={TAG_CONFIG[tag].icon}
                    tagKey={tag}
                  />
                ))}
              </>
            )}
          </main>

          <aside className="space-y-6">
            {recentBlogs.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog._id}`}
                      className="block group"
                    >
                      <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
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
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {tagStats.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Categories
                </h3>
                <div className="space-y-3">
                  {tagStats.map(({ tag, count }) => {
                    const config = TAG_CONFIG[tag];
                    if (!config || count === 0) return null;
                    return (
                      <div
                        key={tag}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                          <span className="text-sm text-foreground">
                            {config.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20 p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Share Your Story
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
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
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Blog Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Posts
                  </span>
                  <span className="font-semibold text-foreground">
                    {allBlogs.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-semibold text-foreground">
                    {
                      allBlogs.filter((blog) => {
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Categories
                  </span>
                  <span className="font-semibold text-foreground">
                    {tagStats.length}
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
