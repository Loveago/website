import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({ postId: z.string().min(1), content: z.string().min(1).max(2000) });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, username: true, image: true } } },
  });
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { postId, content } = parsed.data;
  // Ensure user and post exist to avoid FK issues
  const [user, post] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.post.findUnique({ where: { id: postId } }),
  ]);
  if (!user) return NextResponse.json({ error: "User not found. Please sign in again." }, { status: 401 });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const comment = await prisma.comment.create({ data: { postId, content, authorId: user.id } });
  return NextResponse.json({ comment });
}
