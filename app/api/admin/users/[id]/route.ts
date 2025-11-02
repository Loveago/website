import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const role = body.role as "USER" | "ADMIN" | undefined;
  if (!role) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.post.deleteMany({ where: { userId: params.id } });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
