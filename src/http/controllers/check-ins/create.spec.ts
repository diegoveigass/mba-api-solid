import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a checkin', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -23.998353,
        longitude: -48.8699311,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.998353,
        longitude: -48.8699311,
      })

    expect(response.statusCode).toEqual(201)
  })
})
