import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '@prisma/client'

interface GetUserMetricsUseCaseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCaseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseCaseRequest): Promise<GetUserMetricsUseCaseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
