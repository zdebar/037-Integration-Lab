import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import mercurius from 'mercurius'
import pool from './db/pool.js'
import corsOptions from './config/cors.js'
import { openApiOptions, swaggerUiOptions } from './config/openapi.js'
import graphqlSchema from './graphql/schema.js'
import createGraphqlResolvers from './graphql/resolvers.js'
import practiceRoutes from './routes/practice.js'
import poolRoutes from './routes/pool.js'
import systemRoutes from './routes/system.js'

const app = Fastify({ logger: true })

pool.on('error', (error) => {
  app.log.error(error, 'Unexpected error on idle PostgreSQL client')
})

await app.register(cors, corsOptions)
await app.register(swagger, openApiOptions)
await app.register(swaggerUi, swaggerUiOptions)
await app.register(mercurius, {
  graphiql: true,
  schema: graphqlSchema,
  resolvers: createGraphqlResolvers(pool),
})

await app.register(systemRoutes, { pool })
await app.register(practiceRoutes, { pool })
await app.register(poolRoutes, { pool })

app.addHook('onClose', async () => {
  await pool.end()
})

export default app
