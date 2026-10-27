import databasePoolConfig from '../config/databasePool.js'

async function poolRoutes(app, { pool }) {
  app.get('/db-pool', {
    schema: {
      tags: ['System'],
      summary: 'Inspect PostgreSQL connection pool settings and activity',
      response: {
        200: {
          type: 'object',
          properties: {
            config: {
              type: 'object',
              properties: {
                max: { type: 'integer' },
                idleTimeoutMillis: { type: 'integer' },
                connectionTimeoutMillis: { type: 'integer' },
              },
              required: ['max', 'idleTimeoutMillis', 'connectionTimeoutMillis'],
              additionalProperties: false,
            },
            totalCount: { type: 'integer' },
            idleCount: { type: 'integer' },
            waitingCount: { type: 'integer' },
          },
          required: ['config', 'totalCount', 'idleCount', 'waitingCount'],
          additionalProperties: false,
        },
      },
    },
  }, async () => ({
    config: databasePoolConfig,
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  }))
}

export default poolRoutes
