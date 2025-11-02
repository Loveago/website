import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("No ADMIN_EMAIL/ADMIN_PASSWORD set. Skipping.");
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists.");
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hash, role: "ADMIN" } });
  console.log("Admin user created:", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
