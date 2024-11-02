import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id',
      title: 'Academia Teste',
      description: 'Academia loucura',
      phone: '1455929394',
      latitude: -23.998353,
      longitude: -48.8699311,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -23.998353,
      userLongitude: -48.8699311,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -23.998353,
      userLongitude: -48.8699311,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -23.998353,
        userLongitude: -48.8699311,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -23.998353,
      userLongitude: -48.8699311,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -23.998353,
      userLongitude: -48.8699311,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id-2',
      title: 'Academia Teste',
      description: 'Academia loucura',
      phone: '1455929394',
      latitude: new Decimal(-23.8522208),
      longitude: new Decimal(-48.7726797),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id-2',
        userId: 'user-id',
        userLatitude: -42.111,
        userLongitude: -48.8699311,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
