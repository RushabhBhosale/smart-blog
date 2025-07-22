import { NextRequest, NextResponse } from "next/server";
import { blogCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { BlogSchema } from "@/lib/blogSchema";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const parsed = BlogSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id: idString } = await context.params;
  const id = new ObjectId(idString);
  const res: any = await blogCollection.findOneAndUpdate(
    { _id: id },
    { $set: parsed.data },
    { returnDocument: "after" }
  );
  if (!res.value)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.value);
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await context.params;
  const id = new ObjectId(idString);
  const res: any = await blogCollection.findOneAndDelete({ _id: id });
  if (!res.value)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.value);
}
