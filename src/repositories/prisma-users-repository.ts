import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    await prisma.user.create({
      data,
    })

    return data
  }
}
