import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import mercurius from 'mercurius'
import pg from 'pg'

const app = Fastify({ logger: true })
const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function getDbCheck() {
  const result = await pool.query('SELECT NOW() AS time, current_database() AS database')
  const row = result.rows[0]

  return {
    time: row.time.toISOString(),
    database: row.database,
  }
}

await app.register(cors, {
  origin: 'http://localhost:5173',
})

await app.register(swagger, {
  openapi: {
    openapi: '3.0.3',
    info: {
      title: 'Integration Lab API',
      description: 'Local API for the Integration Lab project.',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
    tags: [{ name: 'System', description: 'API and database health checks' }],
  },
})

await app.register(swaggerUi, {
  routePrefix: '/documentation',
})

await app.register(mercurius, {
  graphiql: true,
  schema: `
    type DbCheck {
      database: String!
      time: String!
    }

    type Query {
      dbCheck: DbCheck!
    }
  `,
  resolvers: {
    Query: {
      dbCheck: getDbCheck,
    },
  },
})

app.get('/health', {
  schema: {
    tags: ['System'],
    summary: 'Check API availability',
    response: {
      200: {
        description: 'The API is running.',
        type: 'object',
        properties: { status: { type: 'string', example: 'ok' } },
        required: ['status'],
        additionalProperties: false,
      },
    },
  },
}, async () => ({ status: 'ok' }))

app.get('/db-check', {
  schema: {
    tags: ['System'],
    summary: 'Check PostgreSQL connection',
    response: {
      200: {
        description: 'Current database time and name.',
        type: 'object',
        properties: {
          time: { type: 'string', format: 'date-time' },
          database: { type: 'string' },
        },
        required: ['time', 'database'],
        additionalProperties: false,
      },
    },
  },
}, async () => {
  return getDbCheck()
})

const port = Number(process.env.PORT ?? 3000)

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  await pool.end()
  process.exit(1)
}
