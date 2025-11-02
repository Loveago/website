import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function getExtension(file: Blob): string {
  const anyFile = file as any;
  const name: string | undefined = anyFile?.name;
  if (name && name.includes(".")) return "." + name.split(".").pop();
  const type = (file as any)?.type as string | undefined;
  if (type) {
    if (type === "image/png") return ".png";
    if (type === "image/jpeg") return ".jpg";
    if (type === "image/webp") return ".webp";
    if (type === "image/gif") return ".gif";
    if (type === "image/svg+xml") return ".svg";
  }
  return ".png";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = getExtension(file);
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (e: any) {
    const message = typeof e?.message === "string" ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
