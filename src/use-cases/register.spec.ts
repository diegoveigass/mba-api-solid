import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findUserByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'Jonh doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
