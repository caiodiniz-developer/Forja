import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  plan: true,
  isBlocked: true,
  avatarUrl: true,
  createdAt: true,
  _count: { select: { enrollments: true, certificates: true } },
} satisfies Prisma.UserSelect;

export const usersRepository = {
  async list(where: Prisma.UserWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: publicSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicSelect });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: publicSelect });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: publicSelect });
  },
};
