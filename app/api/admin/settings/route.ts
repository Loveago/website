import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SettingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const existing = await prisma.siteSettings.findFirst();
  const data = { siteName: parsed.data.siteName, tagline: parsed.data.tagline ?? null, faviconUrl: parsed.data.faviconUrl ?? null };
  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
    : await prisma.siteSettings.create({ data });
  return NextResponse.json({ settings });
}
