import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ✅ Step 1: Seed example invite codes
  const codes = ["INVITE123", "INVITE456", "INVITE789"];
  for (const code of codes) {
    await prisma.inviteCode.upsert({
      where: { code },
      update: {},
      create: {
        code,
        used: false,
        token: code, // Optional: token same as code for now
      },
    });
  }

  // ✅ Step 2: Create an admin user (if they don't already exist)
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@cma.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("adminpass", 10); // 🔐 You can change this
    await prisma.user.create({
      data: {
        email: "admin@cma.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user created: admin@cma.com / adminpass");
  } else {
    console.log("ℹ️ Admin user already exists.");
  }

  console.log("✅ Seeded invite codes successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
