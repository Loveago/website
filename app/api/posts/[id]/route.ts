import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function removePost(id: string, userId: string) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return removePost(params.id, session.user.id);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const method = form.get("_method");
  if (method === "delete") {
    return removePost(params.id, session.user.id);
  }
  return NextResponse.json({ error: "Unsupported" }, { status: 400 });
}
