import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "cvdinizramos@gmail.com";
const PASSWORD = "Admin@123";
const NAME = "Caio Diniz Ramos";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      passwordHash,
      role: "ADMIN",
      plan: "PRO",
      emailVerified: true,
      isBlocked: false,
    },
    create: {
      name: NAME,
      email: EMAIL,
      passwordHash,
      role: "ADMIN",
      plan: "PRO",
      emailVerified: true,
    },
  });
  console.log(`✅ Admin pronto: ${admin.email} (senha: ${PASSWORD})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
