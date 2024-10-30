import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { register } from './http/controllers/register'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // here we should log to an external tool like datadog/newrelic/sentry, etc..
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
