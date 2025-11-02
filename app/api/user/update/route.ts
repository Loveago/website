import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const ImageUrlSchema = z.string().url().or(z.string().regex(/^\//, { message: "must be an absolute URL or start with /" }));

const UpdateSchema = z.object({
  name: z.string().optional().nullable(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/).optional().nullable(),
  email: z.string().email(),
  password: z.string().min(6).optional().nullable(),
  image: ImageUrlSchema.optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, username, email, password, image, bio } = parsed.data;

  const emailOwner = await prisma.user.findUnique({ where: { email } });
  if (emailOwner && emailOwner.id !== userId) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  if (username) {
    const usernameOwner = await prisma.user.findFirst({ where: { username } as any });
    if (usernameOwner && usernameOwner.id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  const data: any = { name: name ?? undefined, email };
  if (image !== undefined) data.image = image;
  if (username !== undefined) data.username = username;
  if (bio !== undefined) data.bio = bio;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ success: true });
}
