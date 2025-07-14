import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const codes = ["INVITE123", "INVITE456", "INVITE789"]; // Example invite codes

  for (const code of codes) {
    await prisma.inviteCode.upsert({
      where: { code },
      update: {},
      create: {
        code,
        used: false,
        token: code, // You can generate a random token if you want
      },
    });
  }

  console.log("Seeded invite codes successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
