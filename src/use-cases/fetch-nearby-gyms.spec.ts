import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Teste de descrição',
      latitude: -23.998353,
      longitude: -48.8699311,
      phone: '15997447389',
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Teste de descrição',
      latitude: -42.111,
      longitude: -48.8699311,
      phone: '15997447389',
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.998353,
      userLongitude: -48.8699311,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
