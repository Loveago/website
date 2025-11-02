import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeRichHtml } from "@/lib/sanitize";

const PostSchema = z.object({ title: z.string().min(1), content: z.string().min(1), image: z.string().url().optional() });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Ensure user exists to avoid foreign key errors (ephemeral DBs after deploy)
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found. Please sign in again." }, { status: 401 });
    }
    const data = await req.json();
    const parsed = PostSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const safeHtml = sanitizeRichHtml(parsed.data.content);

    const post = await prisma.post.create({
      data: { title: parsed.data.title, content: safeHtml, image: parsed.data.image, userId: user.id },
    });

    return NextResponse.json({ post });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
