import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import pg from 'pg'

const app = Fastify({ logger: true })
const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

await app.register(cors, {
  origin: 'http://localhost:5173',
})

app.get('/health', async () => ({ status: 'ok' }))

app.get('/db-check', async () => {
  const result = await pool.query('SELECT NOW() AS time, current_database() AS database')
  return result.rows[0]
})

const port = Number(process.env.PORT ?? 3000)

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  await pool.end()
  process.exit(1)
}
