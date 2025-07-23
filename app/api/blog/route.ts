import { NextResponse } from "next/server";
import { blogCollection } from "@/lib/mongo";
import { BlogSchema } from "@/lib/blogSchema";
import JSON5 from "json5";

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
  let body: any;

  try {
    let raw = await req.text();

    raw = raw
      .replace(/\\n/g, "\n")
      .replace(/\n/g, " ")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\s\s+/g, " ");

    body = JSON5.parse(raw);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON format after cleanup" },
      { status: 400 }
    );
  }

  const parsed = BlogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const blogData = parsed.data;

  let { image, ...rest } = parsed.data;

  if (typeof image === "string" && !image.startsWith("data:image/")) {
    image = `data:image/jpeg;base64,${image}`;
  }

  const blog = { ...rest, image, createdAt: new Date() };

  try {
    const res = await blogCollection.insertOne(blog);
    return NextResponse.json({ ...blog, _id: res.insertedId });
  } catch (err) {
    return NextResponse.json(
      { error: "Database insert failed" },
      { status: 500 }
    );
  }
}
