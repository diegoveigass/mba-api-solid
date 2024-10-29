import { prisma } from '@/lib/prisma'
import { registerUseCase } from '@/use-cases/register'
import { compare, hash } from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({
      email,
      name,
      password,
    })
  } catch (error) {
    reply.status(409).send()
  }

  return reply.status(201).send()
}
