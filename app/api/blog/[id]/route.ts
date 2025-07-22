import { NextResponse } from "next/server";
import { blogCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { BlogSchema } from "@/lib/blogSchema";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const parsed = BlogSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const id = new ObjectId(params.id);
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
  { params }: { params: { id: string } }
) {
  const id = new ObjectId(params.id);
  const res: any = await blogCollection.findOneAndDelete({ _id: id });
  if (!res.value)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.value);
}
