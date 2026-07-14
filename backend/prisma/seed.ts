import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Semeando a Forja...");

  const passwordHash = await bcrypt.hash("Forja@123", 10);
  const adminHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "cvdinizramos@gmail.com" },
    update: { passwordHash: adminHash, role: "ADMIN", emailVerified: true },
    create: {
      name: "Caio Diniz Ramos",
      email: "cvdinizramos@gmail.com",
      passwordHash: adminHash,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "marina@forja.dev" },
    update: {},
    create: {
      name: "Marina Alvez",
      email: "marina@forja.dev",
      passwordHash,
      role: "INSTRUCTOR",
      emailVerified: true,
      bio: "Staff Engineer, ex-Nubank. Foco em front-end e performance.",
    },
  });

  const frontend = await prisma.category.upsert({
    where: { slug: "front-end" },
    update: {},
    create: { name: "Front-end", slug: "front-end", icon: "code" },
  });

  await prisma.plan.upsert({
    where: { slug: "brasa" },
    update: {},
    create: {
      name: "Brasa",
      slug: "brasa",
      priceCents: 0,
      interval: "FREE",
      features: JSON.stringify(["12 cursos selecionados", "Certificado", "Comunidade"]),
    },
  });
  await prisma.plan.upsert({
    where: { slug: "fornalha" },
    update: {},
    create: {
      name: "Fornalha",
      slug: "fornalha",
      priceCents: 8900,
      interval: "YEARLY",
      features: JSON.stringify(["Catálogo completo", "IA nas aulas", "Certificados verificáveis"]),
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "react-do-fundamento-a-forja" },
    update: {},
    create: {
      title: "React do Fundamento à Forja",
      slug: "react-do-fundamento-a-forja",
      subtitle: "Do zero à arquitetura de aplicações reais",
      description: "Aprenda React na prática, construindo projetos reais.",
      level: "INTERMEDIATE",
      status: "PUBLISHED",
      price: 29700,
      isFree: false,
      durationMin: 2520,
      ratingAvg: 4.9,
      ratingCount: 812,
      studentsCount: 5400,
      tags: JSON.stringify(["react", "typescript", "front-end"]),
      categoryId: frontend.id,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Fundamentos",
            order: 0,
            sections: {
              create: [
                {
                  title: "Começando",
                  order: 0,
                  lessons: {
                    create: [
                      { title: "Bem-vindo à forja", type: "VIDEO", order: 0, durationSec: 320, isPreview: true },
                      { title: "Ambiente e Vite", type: "VIDEO", order: 1, durationSec: 640 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Pronto:", { admin: admin.email, instructor: instructor.email, course: course.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
