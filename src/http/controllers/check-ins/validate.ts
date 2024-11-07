import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInId = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInId.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
