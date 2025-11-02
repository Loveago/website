import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.published === "boolean") data.published = body.published;
  const post = await prisma.post.update({ where: { id: params.id }, data });
  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
