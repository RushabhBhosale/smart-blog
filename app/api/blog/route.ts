import { NextResponse } from "next/server";
import { blogCollection } from "@/lib/mongo";
import { BlogSchema } from "@/lib/blogSchema";

// GET all blogs
export async function GET() {
  try {
    const blogs = await blogCollection.find({}).toArray();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = BlogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const blog = { ...parsed.data, createdAt: new Date() };
  const res = await blogCollection.insertOne(blog);
  return NextResponse.json({ ...blog, _id: res.insertedId });
}
