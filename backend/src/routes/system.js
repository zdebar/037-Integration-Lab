import { getDbCheck } from '../services/database.js'

async function systemRoutes(app, { pool }) {
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
  }, async () => getDbCheck(pool))
}

export default systemRoutes
