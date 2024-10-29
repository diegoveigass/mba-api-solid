import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // $2a$06$d19ZiT9qRctzgMiPU3ldnOKWw/xjwWIeSlQZdFImJjLw1BkLO6kRC

  const { email, name, password } = registerBodySchema.parse(request.body)

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    reply.status(409).send({
      error: 'User with this email already exists',
    })
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password_hash,
    },
  })

  return reply.status(201).send()
}
