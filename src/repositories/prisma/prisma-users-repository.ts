import { prisma } from '@/lib/prisma'
import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    await prisma.user.create({
      data,
    })

    return data
  }

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
