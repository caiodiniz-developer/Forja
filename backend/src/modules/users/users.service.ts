import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { usersRepository } from "./users.repository.js";
import type {
  CreateUserDTO,
  ListUsersQuery,
  UpdateUserDTO,
} from "./users.validators.js";
import { conflict, notFound } from "../../shared/errors/AppError.js";
import { env } from "../../config/env.js";

export const usersService = {
  async list(q: ListUsersQuery) {
    const where: Prisma.UserWhereInput = {
      ...(q.role ? { role: q.role } : {}),
      ...(q.search
        ? {
            OR: [
              { name: { contains: q.search } },
              { email: { contains: q.search } },
            ],
          }
        : {}),
    };

    const skip = (q.page - 1) * q.perPage;
    const { items, total } = await usersRepository.list(where, skip, q.perPage);
    return {
      items,
      pagination: {
        page: q.page,
        perPage: q.perPage,
        total,
        totalPages: Math.ceil(total / q.perPage),
      },
    };
  },

  async update(id: string, dto: UpdateUserDTO) {
    const existing = await usersRepository.findById(id);
    if (!existing) throw notFound("Usuário não encontrado");
    return usersRepository.update(id, dto);
  },

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId)
      throw conflict("Você não pode excluir a sua própria conta");
    const existing = await usersRepository.findById(id);
    if (!existing) throw notFound("Usuário não encontrado");
    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      throw conflict(
        "Não é possível excluir: este usuário é dono de cursos, eventos ou tarefas. Transfira o conteúdo antes.",
      );
    }
    return { id };
  },

  async create(dto: CreateUserDTO) {
    const taken = await prisma.user.findUnique({ where: { email: dto.email } });
    if (taken) throw conflict("Já existe um usuário com este e-mail");
    const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    return usersRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      emailVerified: true,
    });
  },
};
