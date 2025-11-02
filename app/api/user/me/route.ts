import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, username: true, email: true, image: true, bio: true } });
  return NextResponse.json({ user });
}
